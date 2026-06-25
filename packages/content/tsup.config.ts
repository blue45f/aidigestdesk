import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  // cliManuals는 별도 엔트리로 분리 — 웹에서 /resources 진입 시에만 lazy 로드되어
  // 메인 content-catalog 청크(번들 예산)에 포함되지 않게 한다.
  entry: ["src/index.ts", "src/cliManuals.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  sourcemap: true,
  target: "es2023",
}));
