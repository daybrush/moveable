import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import App from "./apps/DimensionViewableApp";
import RawApp from "!!raw-loader!./apps/DimensionViewableApp";
import { DEFAULT_CSS_TEMPLATE } from "@/stories/templates/default";
import { convertReactTemplate, convertPath } from "../utils";


export const DimensionViewableTemplate = App as any;

DimensionViewableTemplate.storyName = "DimensionViewable";
DimensionViewableTemplate.argTypes = {};
DimensionViewableTemplate.args = {};

DimensionViewableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
    ],
};
