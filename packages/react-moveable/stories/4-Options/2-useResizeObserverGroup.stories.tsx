import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate } from "../utils";
import App from "./apps/ReactUseResizeObserverGroupApp";
import RawApp from "!!raw-loader!./apps/ReactUseResizeObserverGroupApp";

import { DEFAULT_CSS_TEMPLATE } from "../templates/default";


export const ResizeObserverGroupTemplate = App as any;

ResizeObserverGroupTemplate.storyName = "useResizeObserver (Group)";


ResizeObserverGroupTemplate.parameters = {
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
