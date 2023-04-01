
const builder = require("@daybrush/builder");
const compat = require("rollup-plugin-react-compat");

const compatPlugin = compat({
    useReactCompat: true,
    aliasModules: {
        "react-moveable": "react-compat-moveable"
    }
});
const resolveCompatPlugin = compat({
    useReactCompat: true,
    resolveCompat: true,
});
/*
    "demo:start": "rollup -c rollup.config.demo.js -w",
    "demo:build": "rm -rf ./demo/dist && rollup -c rollup.config.demo.js",
    "prerelease": "npm run doc && npm run build && npm run demo:build && prerelease --dirs=dist,doc",
    "release:before": "npm run build && npm run doc && npm run demo:build && npm run storybook",
*/
const external = {
    "react-simple-compat": "react-simple-compat",
    "react-compat-ruler": "react-compat-ruler",
    "react-compat-moveable": "react-compat-moveable",
    "react-compat-css-styled": "react-compat-css-styled",
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
    },
    {
        input: "src/index.ts",
        output: "./dist/moveable.esm.js",
        exports: "named",
        format: "es",
        minifyPrototype: true,
        plugins: [compatPlugin],
        external,
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
