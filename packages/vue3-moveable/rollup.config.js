const buildHelper = require("@daybrush/builder");
const vuePlugin = require("rollup-plugin-vue");

const defaultOptions = {
    sourcemap: true,
    input: "./src/index.ts",
    exports: "named",
    plugins: [
        vuePlugin(),
    ]
};
export default buildHelper([
    {
        ...defaultOptions,
        format: "es",
        output: "./dist/moveable.esm.js",
    },
    {
        ...defaultOptions,
        format: "cjs",
        // input: "./src/index.umd.ts",
        exports: "named",
        output: "./dist/moveable.cjs.js",
    },
]);
