
const builder = require("@daybrush/builder");
const compat = require("rollup-plugin-react-compat");

const compatPlugin = compat({
    useCroact: true,
    aliasModules: {
        "react-moveable": "croact-moveable"
    }
});
const resolveCompatPlugin = compat({
    useCroact: true,
    resolveCompat: true,
});
/*
    "demo:start": "rollup -c rollup.config.demo.js -w",
    "demo:build": "rm -rf ./demo/dist && rollup -c rollup.config.demo.js",
    "prerelease": "npm run doc && npm run build && npm run demo:build && prerelease --dirs=dist,doc",
    "release:before": "npm run build && npm run doc && npm run demo:build && npm run storybook",
*/
const external = {
    "croact": "croact",
    "croact-ruler": "croact-ruler",
    "croact-moveable": "croact-moveable",
    "croact-css-styled": "croact-css-styled",
    "@daybrush/utils": "utils",
    "css-styled": "css-styled",
    "framework-utils": "framework-utils",
    "gesto": "Gesto",
    "@scena/event-emitter": "@scena/event-emitter",
    "@egjs/agent": "eg.Agent",
    "@egjs/children-differ": "eg.ChildrenDiffer",
    "@moveable/matrix": "@moveable/matrix",
    "@scena/dragscroll": "@scena/dragscroll",
    "css-to-mat": "css-to-mat",
    "overlap-area": "overlap-area",
    "@scena/matrix": "@scena/matrix",
    "@egjs/list-differ": "eg.ListDiffer",
};
module.exports = builder([
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.js",
        exports: "default",
        format: "umd",
        minifyPrototype: true,
        plugins: [resolveCompatPlugin],
        typescript2: true,
    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.min.js",
        exports: "default",
        format: "umd",
        minifyPrototype: true,
        plugins: [resolveCompatPlugin],
        uglify: true,
        typescript2: true,
    },
    {
        input: "src/index.ts",
        output: "./dist/moveable.esm.js",
        exports: "named",
        format: "es",
        minifyPrototype: true,
        plugins: [compatPlugin],
        external,
        typescript2: true,
    },
    {
        input: "src/index.cjs.ts",
        output: "./dist/moveable.cjs.js",
        exports: "named",
        format: "cjs",
        minifyPrototype: true,
        plugins: [compatPlugin],
        external,

    },
]);
