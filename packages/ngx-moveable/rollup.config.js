const builder = require("@daybrush/builder");

const defaultOptions = {
  input: "./src/ngx-moveable/index.ts",
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
};
export default builder([
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
]);
