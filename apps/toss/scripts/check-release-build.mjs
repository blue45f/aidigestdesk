import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const TEST_AD_ID_PATTERN = /ait-ad-test-[a-z0-9-]+/gi;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );
  return files.flat();
}

const files = await collectFiles(DIST_DIR);
const violations = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const matches = [...source.matchAll(TEST_AD_ID_PATTERN)].map(([match]) => match);
  if (matches.length > 0) {
    violations.push({ file: path.relative(process.cwd(), file), ids: [...new Set(matches)] });
  }
}

if (violations.length > 0) {
  console.error('출시 빌드에 테스트용 토스 광고 그룹 ID가 포함되어 있습니다.');
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.ids.join(', ')}`);
  }
  process.exitCode = 1;
} else {
  console.log('Release ad ID check passed: no Apps in Toss test ad IDs found.');
}
