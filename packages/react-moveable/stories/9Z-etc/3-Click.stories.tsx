import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ClickApp";
import RawApp from "!!raw-loader!./apps/ClickApp";


export const ClickTemplate = App as any;

ClickTemplate.storyName = "Test Click";
ClickTemplate.argTypes = {};
ClickTemplate.args = {
    ...makeArgs(ClickTemplate.argTypes),
};


ClickTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
