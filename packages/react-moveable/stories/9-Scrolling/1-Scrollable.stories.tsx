import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "./scroll.css";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
import App from "./apps/ScrollableApp";
import RawApp from "!!raw-loader!./apps/ScrollableApp";
import SCROLL_CSS_TEMPLATE from "!!raw-loader!./scroll.css";
import { convertTemplate, convertPath } from "../utils";

export const TreeShakingTemplate = App as any;

TreeShakingTemplate.storyName = "Use Scrollable";
TreeShakingTemplate.argTypes = {};
TreeShakingTemplate.args = {};


TreeShakingTemplate.parameters = {
    preview: [
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE + "\n" + SCROLL_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper", "react-infinite-viewer"]),
            language: "tsx",
        },
    ],
};

