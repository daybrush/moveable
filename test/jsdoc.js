const path = require("path");
const jsdocPath = require.resolve("@daybrush/jsdoc/jsdoc.js").replace("/jsdoc.js", "");
const pwd = process.cwd();
const fs = require("fs");
require = require("requizzle")({
    requirePaths: {
        before: [path.join(jsdocPath, "lib")],
        after: [path.join(jsdocPath, "node_modules")]
    },
    infect: true
});
env = require("@daybrush/jsdoc/lib/jsdoc/env");
env.dirname = jsdocPath;
env.pwd = pwd;
env.args = process.argv.slice(2);

const cli = require("@daybrush/jsdoc/cli");

cli.setVersionInfo();
cli.loadConfig();
cli.scanFiles();
cli.createParser();
cli.parseFiles();
cli.resolveTutorials();

env.opts.template = __dirname;

function exportJSON(result) {
    const json = JSON.stringify(result, undefined, 4);
    return `
export default ${json};
`;
}
function exportESM(result) {
    return Object.keys(result).map(longname => {
        const value = result[longname];
        const json = JSON.stringify(value, undefined, 4);

        const variableName = longname
            // typedef, member
            .replace(/\./g, "_")
            // function, method
            .replace(/#/g, "_")
            // event
            .replace(/:/g, "__");
        return `
export const ${variableName} = ${json};
`;
    }).join("");
}
cli.generateDocs().then(result => {
    fs.writeFileSync(path.resolve(pwd, "result.js"), exportESM(result), { encoding: "utf-8" });
});


