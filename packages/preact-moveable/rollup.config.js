import builder from "@daybrush/builder";
const preact = require("rollup-plugin-preact");


const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "preact": "Preact",
        "preact-compat": "preact-compat",
        "framework-utils": "framework-utils",
        "preact-css-styler": "preact-css-styler",
        "@egjs/agent": "eg.Agent",
    },
    exports: "named",
    plugins: [
        preact({
            noPropTypes: true,
            noEnv: true,
            noReactIs: true,
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
    },
]);
