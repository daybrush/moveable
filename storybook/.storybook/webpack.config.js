const path = require("path");

module.exports = ({ config }) => {
    config.module.rules.push({
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
    });
    config.module.rules.push({
        test: /\.stories\.(tsx|jsx|ts|js)?$/,
        loaders: [
            {
                loader: require.resolve('@storybook/source-loader'),
                options: { parser: "typescript" },
            },
        ],
        include: path.resolve(__dirname, '../'), // this fixed it, I think.
        enforce: 'pre',
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
};
