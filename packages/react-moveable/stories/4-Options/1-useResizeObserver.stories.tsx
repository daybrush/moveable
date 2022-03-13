import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate } from "../utils";
import App from "./apps/ReactUseResizeObserverApp";
import RawApp from "!!raw-loader!./apps/ReactUseResizeObserverApp";

import { DEFAULT_CSS_TEMPLATE } from "../templates/default";


export const ResizeObserverTemplate = App as any;

ResizeObserverTemplate.storyName = "useResizeObserver";


ResizeObserverTemplate.parameters = {
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
