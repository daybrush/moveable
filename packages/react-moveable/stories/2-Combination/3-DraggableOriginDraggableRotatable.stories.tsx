import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableOriginDraggableRotatableApp";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableOriginDraggableRotatableApp";
import {
    DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";


export const DraggableOriginDraggableRotatableTemplate = App as any;

DraggableOriginDraggableRotatableTemplate.storyName = "Draggable & OriginDraggable & Rotatable";
DraggableOriginDraggableRotatableTemplate.argTypes = {
    ...DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
};
DraggableOriginDraggableRotatableTemplate.args = {
    ...makeArgs(DraggableOriginDraggableRotatableTemplate.argTypes),
};


DraggableOriginDraggableRotatableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
