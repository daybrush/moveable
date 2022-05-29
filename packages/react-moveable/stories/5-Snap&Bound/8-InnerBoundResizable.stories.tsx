import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactInnerBoundResizableApp";
import RawReactApp from "!!raw-loader!./apps/ReactInnerBoundResizableApp";
import {
    DEFAULT_INNER_BOUNDS_CONTROLS,
} from "../controls/default";

export const InnerBoundResizableTemplate = App as any;

InnerBoundResizableTemplate.storyName = "InnerBound (Draggable & Resizable)";
InnerBoundResizableTemplate.argTypes = {
    ...DEFAULT_INNER_BOUNDS_CONTROLS,
};
InnerBoundResizableTemplate.args = {
    ...makeArgs(InnerBoundResizableTemplate.argTypes),
};


InnerBoundResizableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
