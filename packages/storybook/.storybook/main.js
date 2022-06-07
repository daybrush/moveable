const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
    webpackFinal: config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true
            },
        });
        config.plugins.push(new ForkTsCheckerWebpackPlugin());
        // config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
        // config.resolve.alias["moveable-helper"] = path.resolve(__dirname, "../stories/moveable-helper");
        // config.resolve.alias["@/react-moveable"] = path.resolve(__dirname, "../src/react-moveable");
        return config;
    },
    stories: [
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-docs/register",
        "@storybook/addon-controls/register",
        "@storybook/addon-viewport/register",
        "storybook-addon-preview/register",
        "storybook-dark-mode/register",
    ],
    "framework": "@storybook/react",
};
