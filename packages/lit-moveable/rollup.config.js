const buildHelper = require("@daybrush/builder");

const defaultOptions = {
  input: "./src/index.ts",
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
};
module.exports = buildHelper([
  {
    ...defaultOptions,
    format: "es",
    output: "./dist/moveable.esm.js",
    exports: "named",
  },
  {
    ...defaultOptions,
    format: "cjs",
    output: "./dist/moveable.cjs.js",
    exports: "named",
  },
  {
    ...defaultOptions,
    format: "umd",
    name: "UMD",
    output: "./dist/moveable.umd.js",
    exports: "named",
    resolve: true,
  },
]);
