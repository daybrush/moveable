import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { angular } from '@nitedani/vite-plugin-angular/plugin';
import commonjs from 'vite-plugin-commonjs'
import Decorators from "@babel/plugin-proposal-decorators";


// config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
// config.resolve.alias["@/react-moveable"] = path.resolve(__dirname, "../src");
// config.resolve.alias["@/helper"] = path.resolve(__dirname, "../../helper/src");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        commonjs(),
        react({
            include: [
                path.resolve(__dirname, "../packages/react-moveable/src")
            ],
        }),
        vue(),
        svelte(),
        // angular(),
    ],
    resolve: {
        alias: [
            {
                find: "@/stories",
                replacement: path.resolve(__dirname, "./stories")
            },
            {
                find: "@/react-moveable",
                replacement: path.resolve(__dirname, "../packages/react-moveable/src")
            },
            {
                find: "croact-moveable",
                replacement: path.resolve(__dirname, "../packages/croact-moveable/dist/moveable.esm.js")
            },
            {
                find: "moveable",
                replacement: path.resolve(__dirname, "../packages/moveable/dist/moveable.esm.js")
            },
            {
                find: "vue3-moveable",
                replacement: path.resolve(__dirname, "../packages/vue3-moveable/src/components")
            },
            {
                find: "svelte-moveable",
                replacement: path.resolve(__dirname, "../packages/svelte-moveable/src/lib")
            },
            {
                find: "ngx-moveable",
                replacement: path.resolve(__dirname, "../packages/ngx-moveable/projects/ngx-moveable/src/public-api.ts")
            },
            {
                find: "lit-moveable",
                replacement: path.resolve(__dirname, "../packages/lit-moveable/src")
            },
            {
                find: "@moveable/helper",
                replacement: path.resolve(__dirname, "../packages/helper/src")
            },
            {
                find: "react-moveable",
                replacement: path.resolve(__dirname, "../packages/react-moveable/src")
            },

        ],
    },
})
