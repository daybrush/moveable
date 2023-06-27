import { mergeConfig } from "vite";

const glob = require("glob");
const path = require("path");
const fs = require("fs");
const { makeStories } = require("./frameworkStories");


/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ["../src/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
    staticDirs: [
        "../public"
    ],
    addons: [
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@storybook/addon-interactions",
    ],
    viteFinal: (config, options) => {
        const list = glob.sync("./stories/**/{react,script,vue2,vue3,svelte,angular,lit}/**/*.*");
        const codeObject = {};

        list.forEach(filePath => {
            const paths = filePath.split("/");
            const length = paths.length;

            const frameworkIndex = paths.findIndex(text => ["react", "script", "vue2", "vue3", "svelte", "angular", "lit"].includes(text));

            const framework = paths[frameworkIndex];
            const fileName = framework === "react" ? paths[frameworkIndex + 1] : paths[length - 1];
            const appName = framework === "react" ? paths[frameworkIndex + 1].split(".")[0] :  paths[length - 2];
            const relativePath = paths.slice(2, frameworkIndex).join("/");

            codeObject[`${relativePath}-${framework}-${appName}-${fileName}`] = {
                code: fs.readFileSync(path.resolve(__dirname,"../", filePath), "utf-8"),
                appName,
                fileName,
                framework,
                relativePath,
            };
        });


        makeStories();


        return mergeConfig(config, {
            define: {
                STORY_CODES: codeObject,
            },
        });
    },
    framework: {
      name: "@storybook/react-vite",
      options: {},
    },
    docs: {
      autodocs: "tag",
    },
};
export default config;



// require("./readme");

// const { DefinePlugin } = require("webpack");
// const path = require("path");
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// module.exports = {
//     features: {
//         interactionsDebugger: true,
//         previewMdx2: true, // 👈 MDX 2 enabled here
//     },
//     typescript: {
//         reactDocgen: "react-docgen-typescript",
//         reactDocgenTypescriptOptions: {
//             shouldExtractLiteralValuesFromEnum: true,
//             propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
//         },
//     },
//     webpackFinal: (config) => {
//         const definePlugin = new DefinePlugin({
//             SKIP_TEST: process.env.SKIP_TEST,
//             EXEC_TEST: process.env.EXEC_TEST,
//         });
//         config.module.rules.push({
//             test: /\.(ts|tsx)$/,
//             loader: 'ts-loader',
//             options: {
//                 // disable type checker - we will use it in fork plugin
//                 transpileOnly: true
//             },
//         });
//         config.plugins.push(definePlugin);
//         config.plugins.push(new ForkTsCheckerWebpackPlugin());
//         config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
//         config.resolve.alias["moveable-helper"] = path.resolve(__dirname, "../stories/moveable-helper");
//         config.resolve.alias["@/react-moveable"] = path.resolve(__dirname, "../src");
//         config.resolve.alias["@/helper"] = path.resolve(__dirname, "../../helper/src");

//         return config;
//     },
//     stories: [
//         "../stories/**/*.stories.mdx",
//         "../stories/**/*.stories.@(js|jsx|ts|tsx)"
//     ],
//     addons: [
//         "@storybook/addon-google-analytics",
//         {
//             name: '@storybook/addon-docs',
//             options: { configureJSX: true },
//         },
//         "storybook-addon-preview/register",
//         "@storybook/addon-controls/register",
//         "@storybook/addon-viewport/register",
//         "storybook-dark-mode/register",
//         "@storybook/addon-links",
//         "@storybook/addon-essentials",
//         "@storybook/addon-interactions",
//         // {
//         //     name: "@storybook/addon-coverage",
//         //     options: {
//         //         exclude: [
//         //             "**/stories/**",
//         //             "stories/**",
//         //             "*{App}.tsx",
//         //         ],
//         //     },
//         // },
//     ],
//     "framework": "@storybook/react",
// };
