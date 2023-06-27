const glob = require("glob");
const path = require("path");
const fs = require("fs");
const ts = require("typescript");


function visitLoop(node, visitCallback) {
    function visit(subNode) {
        const result = visitCallback(subNode);

        if (result === false) {
            return;
        }
        ts.forEachChild(subNode, visit);
    }
    visit(node);
}

exports.makeStories = function makeStories() {
    const groupList = glob.sync("./stories/**/react-*.stories.tsx");

    groupList.forEach(storiesPath => {
        const absPath = path.resolve(__dirname, "../", storiesPath);
        const fileName = path.basename(absPath);
        const code = fs.readFileSync(absPath, "utf-8");
        const sourceFile = ts.createSourceFile(
            "test.tsx",
            code,
            ts.ScriptTarget.Latest,
            false,
            ts.ScriptKind.TSX,
        );
        let defaultTitle = "";
        const stories = sourceFile.statements.map(st => {
            if (ts.isExportAssignment(st)) {
                visitLoop(st.expression, node => {
                    if (ts.isPropertyAssignment(node) && node.name.escapedText === "title") {
                        const { pos, end } = node.initializer;

                        defaultTitle = code.slice(pos, end).replace(/\s*"([^"]+)"\s*/g, "$1");
                        return false;
                    }
                });
            }
            if (!ts.isVariableStatement(st) || !st.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
                return;
            }
            const declaration = st.declarationList.declarations[0];
            const storyName = declaration.name.escapedText;
            let appName = "";
            visitLoop(declaration.initializer, node => {
                if (ts.isPropertyAssignment(node) && node.name.escapedText === "appName") {
                    const { pos, end } = node.initializer;

                    appName = code.slice(pos, end).replace(/\s*"([^"]+)"\s*/g, "$1");
                    return false;
                }
            });
            return {
                appName,
                storyName,
            };
        }).filter(Boolean);

        const frameworkFileMap = {
            "angular": "InlineApp.ts",
            "script": "App.js",
            "vue3": "App.vue",
            "svelte": "App.svelte",
        };

        ["angular", "script", "vue3", "svelte"].forEach(frameworkName => {
            const frameworkPath = path.resolve(path.resolve(__dirname, "../", storiesPath, "../", fileName.replace("react", frameworkName)));
            fs.writeFileSync(frameworkPath, `
import { convertFrameworkStory } from "../utils/story";
import * as All from "./react-Basic.stories";

export default {
    title: "${frameworkName}/${defaultTitle}",
};

${stories.map(storyInfo => {
                return `export const ${storyInfo.storyName} = convertFrameworkStory(
    "${frameworkName}",
    All.${storyInfo.storyName},
    require("./${frameworkName}/${storyInfo.appName}/${frameworkFileMap[frameworkName]}").default,
);`;
            }).join("\n")}
`, "utf-8");
        });
    });

}
