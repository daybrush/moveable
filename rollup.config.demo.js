import builder from "@daybrush/builder";
import cssbundle from "rollup-plugin-css-bundle";
import preact from "rollup-plugin-preact";

const preactPlugin = preact({
    noPropTypes: true,
    resolvePreactCompat: true,
    usePreactX: true,
});


export default builder([
    {
        input: "demo/src/index.ts",
        output: "./demo/dist/index.js",
        format: "iife",
        exports: "named",
        plugins: [
            cssbundle({output: "./demo/dist/index.css"}),
            // preactPlugin
        ],
        resolve: true,
        sourcemap: false,
        uglify: true,
    },
]);
