import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        index: "src/index.ts",
    },
    splitting: false,
    format: ["esm", "cjs"],
    // Generate declaration file
    dts: true,
    // Clean output directory before each build
    clean: true,
});
