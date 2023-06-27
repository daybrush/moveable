const builder = require("@daybrush/builder");

const defaultOptions = {
    typescript2: true,
    tsconfig: "tsconfig.build.json",
};

module.exports = builder([
    {
        ...defaultOptions,
        input: "src/index.ts",
        output: "./dist/helper.esm.js",
        visualizer: true,
        format: "es",
        exports: "named",
    },
    {
        ...defaultOptions,
        input: "src/index.cjs.ts",
        output: "./dist/helper.cjs.js",
        format: "cjs",
        exports: "named",
    },
    {
        ...defaultOptions,
        input: "src/index.umd.ts",
        output: "./dist/helper.js",
        format: "umd",
        exports: "default",
        resolve: true,
        name: "MoveableHelper",
    },
    {
        ...defaultOptions,
        input: "src/index.umd.ts",
        output: "./dist/helper.min.js",
        format: "umd",
        exports: "default",
        resolve: true,
        uglify: true,
        name: "MoveableHelper",
    },
]);
