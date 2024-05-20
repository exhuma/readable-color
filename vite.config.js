import { resolve } from "path";
import { defineConfig } from "vite";
import { rollup } from "rollup";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "readable-color",
      fileName: "readable-color",
      formats: ["es"],
    },
    rollupOptions: {
      plugins: [typescript({ tsconfig: "./tsconfig.json" })],
      output: {
        format: "es",
        dir: "dist",
      },
    },
  },
  plugins: [
    {
      name: "build-types",
      writeBundle: async () => {
        const config = {
          input: "./dist/types/index.d.ts",
          output: [{ file: "dist/readable-color.d.ts", format: "es" }],
          plugins: [dts()],
        };
        const bundle = await rollup(config);
        await bundle.write(config.output[0]);
      },
    },
  ],
});
