import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import App from "./apps/CustomRotatableApp";
import RawApp from "!!raw-loader!./apps/CustomRotatableApp";
import { DEFAULT_CSS_TEMPLATE } from "@/stories/templates/default";
import { convertTemplate, convertPath } from "../utils";


export const CustomRotatable = App as any;

CustomRotatable.storyName = "Custom Rotatable";
CustomRotatable.argTypes = {};
CustomRotatable.args = {};

CustomRotatable.parameters = {
    preview: [
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper"]),
            language: "tsx",
        },
    ],
};
