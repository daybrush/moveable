import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSVGDraggableApp";
import RawReactApp from "!!raw-loader!./apps/ReactSVGDraggableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";

export const SVGDraggableTemplate = App as any;

SVGDraggableTemplate.storyName = "Draggable(SVGSVGElement)";
SVGDraggableTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
SVGDraggableTemplate.args = {
    ...makeArgs(SVGDraggableTemplate.argTypes),
};


SVGDraggableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
