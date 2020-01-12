
import builder from "@daybrush/builder";
import preact from "rollup-plugin-preact";

const preactPlugin = preact({
    noPropTypes: true,
    usePreactX: true,
    resolvePreactCompat: true,
});

const external = {
    "@egjs/component": "@egjs/component",
    "@daybrush/utils": "@daybrush/utils",
    "@daybrush/drag": "@daybrush/drag",
    "framework-utils": "framework-utils",
    "@egjs/agent": "eg.Agent",
    "@egjs/children-differ": "eg.ChildrenDiffer",
    "css-styled": "css-styled"
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
        exports: "default",
        format: "cjs",
        plugins: [preactPlugin],
        external,
    },
]);
