import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableResizableRotatableApp";
import RawApp from "!!raw-loader!./apps/ReactDraggableResizableRotatableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";
import { DEFAULT_GROUPPABLE_GROUP_CONTROLS, DEFAULT_RESIZABLE_GROUP_CONTROLS } from "../controls/group";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";


export const DraggableResizableGroupTemplate = App as any;

DraggableResizableGroupTemplate.storyName = "Draggable & Resizable & Rotatable";
DraggableResizableGroupTemplate.argTypes = {
    ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
    ...DEFAULT_RESIZABLE_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_RESIZABLE_GROUP_CONTROLS,
};
DraggableResizableGroupTemplate.args = {
    ...makeArgs(DraggableResizableGroupTemplate.argTypes),
};


DraggableResizableGroupTemplate.parameters = {
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
