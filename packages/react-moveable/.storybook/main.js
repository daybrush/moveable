const path = require("path");

module.exports = {
    webpackFinal: config => {
        config.module.rules.push(...[
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve('awesome-typescript-loader'),
                    },
                    // Optional
                    {
                        loader: require.resolve('react-docgen-typescript-loader'),
                    },
                ],
            },
        ]);

        config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
        config.resolve.alias["moveable-helper"] = path.resolve(__dirname, "../stories/moveable-helper");
        config.resolve.alias["@/react-moveable"] = path.resolve(__dirname, "../src/react-moveable");
        return config;
    },
    stories: [
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        // "@storybook/addon-knobs/register",
        "@storybook/addon-docs/register",
        "@storybook/addon-controls/register",
        "@storybook/addon-viewport/register",
        "storybook-addon-preview/register",
        "storybook-dark-mode/register",
    ],
};
