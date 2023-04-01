const builder = require("@daybrush/builder");
const css = require("rollup-plugin-css-bundle");
const preact = require("rollup-plugin-preact");




modulex.exports = builder({
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
            resolvePreactCompat: true,
            // usePreactX: true,
        }),
    ],
});
