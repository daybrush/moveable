import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableApp";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";


export default {
    title: "Basic",
};

export const DraggableTemplate = App as any;

DraggableTemplate.storyName = "Draggable";
DraggableTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableTemplate.args = {
    ...makeArgs(DraggableTemplate.argTypes),
};


DraggableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
