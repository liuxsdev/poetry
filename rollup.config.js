import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: { file: "dist/index.js", format: "esm" },
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), nodeResolve()],
    external: ["axios"],
};
