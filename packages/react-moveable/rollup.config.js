import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([{
        ...defaultOptions,
        input: "src/react-moveable/index.esm.ts",
        output: "./dist/moveable.esm.js",
        visualizer: true,
        format: "es",
        exports: "default",
    },
    {
        ...defaultOptions,
        input: "src/react-moveable/index.umd.ts",
        output: "./dist/moveable.cjs.js",
        format: "cjs",
    },
]);