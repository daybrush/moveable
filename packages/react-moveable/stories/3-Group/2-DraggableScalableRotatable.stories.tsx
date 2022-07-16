import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableScalableRotatableApp";
import RawApp from "!!raw-loader!./apps/ReactDraggableScalableRotatableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
import { DEFAULT_GROUPPABLE_GROUP_CONTROLS, DEFAULT_SCALABLE_GROUP_CONTROLS } from "../controls/group";


export const DraggableScalableGroupTemplate = App as any;

DraggableScalableGroupTemplate.storyName = "Draggable & Scalable & Rotatable";
DraggableScalableGroupTemplate.argTypes = {
    ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,
    ...DEFAULT_SCALABLE_GROUP_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableScalableGroupTemplate.args = {
    ...makeArgs(DraggableScalableGroupTemplate.argTypes),
};

DraggableScalableGroupTemplate.parameters = {
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
