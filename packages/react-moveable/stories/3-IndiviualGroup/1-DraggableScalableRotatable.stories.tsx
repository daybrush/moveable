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


export const DraggableScalableTemplate = App as any;

DraggableScalableTemplate.storyName = "Draggable & Scalable & Rotatable";
DraggableScalableTemplate.argTypes = {
    ...DEFAULT_SCALABLE_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableScalableTemplate.args = {
    ...makeArgs(DraggableScalableTemplate.argTypes),
};

DraggableScalableTemplate.parameters = {
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
