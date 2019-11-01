import buildHelper from "@daybrush/builder";
import svelte from 'rollup-plugin-svelte';
import { preprocess } from "@pyoner/svelte-ts-preprocess";

const defaultOptions = {
    tsconfig: "",
    input: './src/Moveable.svelte',
    commonjs: true,
    external: {
        "svelte": "svelte",
    },
    plugins: [
        svelte({
            preprocess: preprocess(),
        }),
    ],
}
export default buildHelper([
    {
        ...defaultOptions,
        output: "dist/moveable.cjs.js",
        format: "cjs",
    },
    {
        ...defaultOptions,
        output: "dist/moveable.esm.js",
        format: "es",
    },
]);
