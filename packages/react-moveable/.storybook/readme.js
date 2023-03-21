const path = require("path");
const fs = require("fs");

const readmeText = fs.readFileSync(path.resolve(__dirname, "../../../README.md"), {
    encoding: "utf-8",
  });

fs.writeFileSync(path.resolve(__dirname, "../stories/0-Introduction/readme.stories.mdx"), `
import { Meta } from "@storybook/addon-docs";

<Meta title="Introduction" />

${readmeText}`, {
  encoding: "utf-8",
});
