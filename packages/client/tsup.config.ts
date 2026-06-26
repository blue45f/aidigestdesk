import { defineConfig } from "tsup";

// 클라이언트 헤드리스 레이어. React는 앱이 제공하므로 external(번들 미포함 → React 단일 인스턴스 보장).
export default defineConfig((options) => ({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  sourcemap: true,
  target: "es2023",
  external: ["react", "react-dom"],
}));
