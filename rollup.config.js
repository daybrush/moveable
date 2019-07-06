
import builder from "@daybrush/builder";

export default builder([
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.js",
    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.min.js",
        uglify: true,

    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.pkgd.js",
        resolve: true,
    },
    {
        name: "Moveable",
        input: "src/index.umd.ts",
        output: "./dist/moveable.pkgd.min.js",
        resolve: true,
        uglify: true,
    },
    {
        input: "src/index.ts",
        output: "./dist/moveable.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/moveable.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
