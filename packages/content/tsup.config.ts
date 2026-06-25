import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  // cliManuals는 별도 엔트리로 분리 — 웹에서 /resources 진입 시에만 lazy 로드되어
  // 메인 content-catalog 청크(번들 예산)에 포함되지 않게 한다.
  // shared는 모듈 폴더(parse/inquiry/community)지만 출력은 dist/shared.js 단일로 유지하려고
  // 객체 엔트리 키로 이름을 고정한다(웹·토스의 @aidigestdesk/content/shared import 불변).
  entry: {
    index: "src/index.ts",
    cliManuals: "src/cliManuals.ts",
    shared: "src/shared/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  sourcemap: true,
  target: "es2023",
}));
