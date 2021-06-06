import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactPathDraggableApp";
import RawReactApp from "!!raw-loader!./apps/ReactPathDraggableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";

export const PathDraggableTemplate = App as any;

PathDraggableTemplate.storyName = "Draggable(SVGPathElement)";
PathDraggableTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
PathDraggableTemplate.args = {
    ...makeArgs(PathDraggableTemplate.argTypes),
};


PathDraggableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
