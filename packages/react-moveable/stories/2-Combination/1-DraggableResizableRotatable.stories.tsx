import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableResizableRotatableApp";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableResizableRotatableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";


export const DraggableResizableRotatableTemplate = App as any;

DraggableResizableRotatableTemplate.storyName = "Draggable & Resizable & Rotatable";
DraggableResizableRotatableTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_RESIZABLE_CONTROLS,
};
DraggableResizableRotatableTemplate.args = {
    ...makeArgs(DraggableResizableRotatableTemplate.argTypes),
};


DraggableResizableRotatableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
