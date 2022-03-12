import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactRotateClippableApp";
import RawApp from "!!raw-loader!./apps/ReactRotateClippableApp";


export const RotateClippableTemplate = App as any;

RotateClippableTemplate.storyName = "Test Rotate & Clippable";
RotateClippableTemplate.argTypes = {};
RotateClippableTemplate.args = {
    ...makeArgs(RotateClippableTemplate.argTypes),
};


RotateClippableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
