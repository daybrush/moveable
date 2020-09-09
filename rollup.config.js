
import builder from "@daybrush/builder";
import compat from "rollup-plugin-react-compat";

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
    "react-compat-css-styled": "react-compat-css-styled",
    "react-compat-moveable": "react-compat-moveable",
    "@egjs/component": "@egjs/component",
    "@daybrush/utils": "@daybrush/utils",
    "gesto": "gesto",
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
        plugins: [resolveCompatPlugin],
    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.min.js",
        plugins: [resolveCompatPlugin],
        uglify: true,
    },
    {
        input: "src/index.esm.ts",
        output: "./dist/moveable.esm.js",
        exports: "named",
        format: "es",
        plugins: [compatPlugin],
        external,
    },
    {
        input: "src/index.umd.ts",
        output: "./dist/moveable.cjs.js",
        exports: "default",
        format: "cjs",
        plugins: [compatPlugin],
        external,
    },
]);
