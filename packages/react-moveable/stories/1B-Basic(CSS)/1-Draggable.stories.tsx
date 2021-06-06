import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableApp";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
} from "../controls/default";


export const DraggableTemplate = App as any;

DraggableTemplate.storyName = "Draggable";
DraggableTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableTemplate.args = {
    ...makeArgs(DraggableTemplate.argTypes),
};


DraggableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
