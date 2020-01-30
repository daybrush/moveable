
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

const external = {
    "react-simple-compat": "react-simple-compat",
    "react-compat-css-styled": "react-compat-css-styled",
    "react-compat-moveable": "react-compat-moveable",
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
