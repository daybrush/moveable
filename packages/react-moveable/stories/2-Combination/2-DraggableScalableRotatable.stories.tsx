import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableScalableRotatableApp";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableScalableRotatableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";


export const DraggableScalableRotatableTemplate = App as any;

DraggableScalableRotatableTemplate.storyName = "Draggable & Scalable & Rotatable";
DraggableScalableRotatableTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
};
DraggableScalableRotatableTemplate.args = {
    ...makeArgs(DraggableScalableRotatableTemplate.argTypes),
};


DraggableScalableRotatableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
