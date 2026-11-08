import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ["src"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueOtpInput",
      fileName: (format) =>
        format === "es" ? "vue-otp-input.es.js" : "vue-otp-input.umd.cjs",
    },
    rollupOptions: {
      external: ["vue", "@libraries/otp-input-core"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
