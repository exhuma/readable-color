import { resolve } from 'path';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
    
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "readable-color",
            fileName: "readable-color",
            formats: ["es"]
        }
    }
})