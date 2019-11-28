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
        "preact-css-styler": "preact-css-styler",
        "@egjs/agent": "eg.Agent",
        "@egjs/children-differ": "eg.ChildrenDiffer",
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
                "react-css-styler": "preact-css-styler",
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
