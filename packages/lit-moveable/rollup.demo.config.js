const buildHelper = require("@daybrush/builder");

const defaultOptions = {
  input: "./demo/index.ts",
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
};
export default buildHelper([
  {
    ...defaultOptions,
    format: "iife",
    output: "./demo/dist/index.js",
    resolve: true,
    exports: "named",
  },
]);
