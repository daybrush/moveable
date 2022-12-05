import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([{
    ...defaultOptions,
    input: "src/index.ts",
    output: "./dist/moveable.esm.js",
    visualizer: true,
    format: "es",
    exports: "named",
},
{
    ...defaultOptions,
    input: "src/index.umd.ts",
    output: "./dist/moveable.cjs.js",
    format: "cjs",
    exports: "named",
},
]);
