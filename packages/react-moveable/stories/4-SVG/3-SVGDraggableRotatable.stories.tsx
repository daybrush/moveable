import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSVGDraggableRotatableApp";
import RawReactApp from "!!raw-loader!./apps/ReactSVGDraggableRotatableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";

export const SVGDraggableRotatableTemplate = App as any;

SVGDraggableRotatableTemplate.storyName = "Draggable & Rotatable(Circle)";
// SVGDraggableRotatableTemplate.argTypes = {
//     ...SCALE_CONTROLS,
//     ...DEFAULT_DRAGGABLE_CONTROLS,
// };
// SVGDraggableRotatableTemplate.args = {
//     ...makeArgs(SVGDraggableRotatableTemplate.argTypes),
// };


SVGDraggableRotatableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
