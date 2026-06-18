import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const distAssetsDir = new URL("../dist/assets/", import.meta.url);

const budgets = {
  maxJavaScriptBytes: 450 * 1024,
  maxJavaScriptGzipBytes: 130 * 1024,
  maxCssBytes: 80 * 1024,
};

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} KiB`;
}

async function readAssetSizes() {
  const entries = await readdir(distAssetsDir, { withFileTypes: true });
  const assets = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(?:js|css)$/.test(entry.name)) continue;

    const filePath = join(distAssetsDir.pathname, entry.name);
    const fileStat = await stat(filePath);
    const gzipBytes = gzipSync(await readFile(filePath)).byteLength;

    assets.push({
      name: entry.name,
      bytes: fileStat.size,
      gzipBytes,
      type: entry.name.endsWith(".css") ? "css" : "js",
    });
  }

  return assets.toSorted((a, b) => b.bytes - a.bytes);
}

const assets = await readAssetSizes();

if (!assets.length) {
  throw new Error("No JS or CSS build assets found. Run the web build before check:bundle.");
}

const failures = [];

for (const asset of assets) {
  if (asset.type === "js" && asset.bytes > budgets.maxJavaScriptBytes) {
    failures.push(
      `${asset.name} raw JS size ${formatSize(asset.bytes)} exceeds ${formatSize(
        budgets.maxJavaScriptBytes,
      )}`,
    );
  }

  if (asset.type === "js" && asset.gzipBytes > budgets.maxJavaScriptGzipBytes) {
    failures.push(
      `${asset.name} gzip JS size ${formatSize(asset.gzipBytes)} exceeds ${formatSize(
        budgets.maxJavaScriptGzipBytes,
      )}`,
    );
  }

  if (asset.type === "css" && asset.bytes > budgets.maxCssBytes) {
    failures.push(
      `${asset.name} raw CSS size ${formatSize(asset.bytes)} exceeds ${formatSize(
        budgets.maxCssBytes,
      )}`,
    );
  }
}

console.table(
  assets.map((asset) => ({
    asset: asset.name,
    type: asset.type,
    raw: formatSize(asset.bytes),
    gzip: formatSize(asset.gzipBytes),
  })),
);

if (failures.length) {
  throw new Error(`Bundle budget failed:\n${failures.join("\n")}`);
}

console.log("Bundle budget passed.");
