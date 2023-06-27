const builder = require("@daybrush/builder");

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    typescript2: true,
};

module.exports = builder([{
    ...defaultOptions,
    input: "src/index.ts",
    output: "./dist/snappable.esm.js",
    format: "es",
    exports: "named",
},
{
    ...defaultOptions,
    input: "src/index.umd.ts",
    output: "./dist/snappable.esm.js",
    format: "es",
    exports: "default",
    name: "Snappable",
},
{
    ...defaultOptions,
    input: "src/index.umd.ts",
    output: "./dist/snappable.cjs.js",
    format: "cjs",
    exports: "default",
},
]);
