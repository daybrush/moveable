import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate } from "../utils";
import App from "./apps/ReactSetRotationApp";
import RawApp from "!!raw-loader!./apps/ReactSetRotationApp";


export const SetRotationTemplate = App as any;

SetRotationTemplate.storyName = "Set rotation before rotate";
SetRotationTemplate.argTypes = {};
SetRotationTemplate.args = {};


SetRotationTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
