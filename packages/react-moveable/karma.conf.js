const tester = require("@daybrush/tester");

tester.setFiles([
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./test/**/*.ts",
    "./test/**/*.tsx",
]);

module.exports = tester.karmaConfig;
