import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    babel({
      exclude: [
        /[\/\\]node_modules[\/\\]/,
        /\0rolldown\/runtime\.js/,
        /packages[\/\\]content[\/\\]dist[\/\\]/,
      ],
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "content-catalog",
              test: /packages[\\/]content[\\/]dist[\\/]index/,
              priority: 3,
            },
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 2,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5297,
  },
  preview: {
    host: "127.0.0.1",
    port: 5297,
  },
});
