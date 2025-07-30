import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import sass from "sass";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        api: "modern-compiler",
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});
