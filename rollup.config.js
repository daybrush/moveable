
import builder from "@daybrush/builder";
import preact from "rollup-plugin-preact";

const preactPlugin = preact({
    usePreactCompat2: true,
    noPropTypes: true,
    resolvePreactCompat: true,
});

const external = {
    "@egjs/component": "@egjs/component",
    "@daybrush/utils": "@daybrush/utils",
    "@daybrush/drag": "@daybrush/drag",
    "framework-utils": "framework-utils",
    "@egjs/agent": "eg.Agent",
};
export default builder([
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.js",
        plugins: [preactPlugin],
    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.min.js",
        plugins: [preactPlugin],
        uglify: true,
    },
    {
        input: "src/index.esm.ts",
        output: "./dist/moveable.esm.js",
        exports: "named",
        format: "es",
        plugins: [preactPlugin],
        external,
    },
    {
        input: "src/index.umd.ts",
        output: "./dist/moveable.cjs.js",
        exports: "named",
        format: "cjs",
        plugins: [preactPlugin],
        external,
    },
]);
