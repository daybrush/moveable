const tester = require("@daybrush/tester");

tester.setFiles([
    "./src/react-moveable/**/*.ts",
    "./src/react-moveable/**/*.tsx",
    "./test/**/*.ts",
    "./test/**/*.tsx",
]);

module.exports = tester.karmaConfig;
