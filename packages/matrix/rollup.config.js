
import builder from "@daybrush/builder";

export default builder([
    {
        input: "src/index.ts",
        output: "./dist/matrix.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/matrix.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
