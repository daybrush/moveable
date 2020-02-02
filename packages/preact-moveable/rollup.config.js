import builder from "@daybrush/builder";
const preact = require("rollup-plugin-preact");


const defaultOptions = {
    sourcemap: false,
    tsconfig: "tsconfig.build.json",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "Dragger",
        "preact": "preact",
        "preact/compat": "preact/compat",
        "preact-compat": "preact-compat",
        "framework-utils": "framework-utils",
        "preact-css-styled": "preact-css-styled",
        "@egjs/agent": "eg.Agent",
        "@egjs/children-differ": "eg.ChildrenDiffer",
        "@moveable/matrix": "@moveable/matrix",
        "@scena/dragscroll": "@scena/dragscroll",
    },
    exports: "named",
    plugins: [
        preact({
            noPropTypes: false,
            noEnv: false,
            noReactIs: false,
            usePreactX: true,
            // resolvePreactCompat: true,
            aliasModules: {
                "react-css-styled": "preact-css-styled",
            },
        }),
    ],
};

export default builder([
    {
        ...defaultOptions,
        input: "src/preact-moveable/Moveable.ts",
        output: "./dist/moveable.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/preact-moveable/Moveable.ts",
        output: "./dist/moveable.cjs.js",
        format: "cjs",
        exports: "default",
    },
]);
