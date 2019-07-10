import builder from "@daybrush/builder";
import css from "rollup-plugin-css-bundle";
const preact = require("rollup-plugin-preact");




export default builder({
    input: "./src/demo/index.tsx",
    tsconfig: "./tsconfig.build.json",
    sourcemap: false,
    format: "umd",
    output: "./demo/dist/index.js",
    name: "app",
    exports: "named",
    plugins: [
        css({ output: "./demo/dist/index.css" }),
        preact({
            noPropTypes: true,
            noEnv: true,
            noReactIs: true,
        }),
    ],
});
