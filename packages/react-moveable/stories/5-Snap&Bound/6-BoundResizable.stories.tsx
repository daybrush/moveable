import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactBoundResizableApp";
import RawReactApp from "!!raw-loader!./apps/ReactBoundResizableApp";
import {
    DEFAULT_BOUNDS_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";

export const BoundResizableTemplate = App as any;

BoundResizableTemplate.storyName = "Bound (Draggable & Resizable)";
BoundResizableTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_RESIZABLE_CONTROLS,
    ...DEFAULT_BOUNDS_CONTROLS,
};
BoundResizableTemplate.args = {
    ...makeArgs(BoundResizableTemplate.argTypes),
};


BoundResizableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
