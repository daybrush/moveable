import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
import { convertReactTemplate, convertPath } from "../utils";
import App from "./apps/TreeShakingApp";
import RawApp from "!!raw-loader!./apps/TreeShakingApp";



export const TreeShakingTemplate = App as any;

TreeShakingTemplate.storyName = "Use only Draggable, Resizable, Rotatable(30% size reduction)";
TreeShakingTemplate.argTypes = {};
TreeShakingTemplate.args = {};


TreeShakingTemplate.parameters = {
    preview: [
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper"]),
            language: "tsx",
        },
    ],
};
