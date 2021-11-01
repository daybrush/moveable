import { DEFAULT_REACT_CODESANDBOX, DEFAULT_VANILLA_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, convertTemplate, convertVanillaTemplate, makeArgs } from "../utils";
import App from "./apps/ReactDraggableApp";
import RawHTMLApp from "!!raw-loader!./apps/vanilla/DraggableApp.html";
import RawVanillaApp from "!!raw-loader!./apps/vanilla/DraggableApp.ts_txt";
import RawReactApp from "!!raw-loader!./apps/ReactDraggableApp";
import {
    DEFAULT_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";

export const DraggableTemplate = App as any;

DraggableTemplate.storyName = "Draggable";
DraggableTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableTemplate.args = {
    ...makeArgs(DraggableTemplate.argTypes),
};


DraggableTemplate.parameters = {
    preview: [
        {
            tab: "Vanilla",
            template: convertVanillaTemplate(RawVanillaApp),
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["moveable"]),
            language: "tsx",
        },
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
        {
            tab: "HTML",
            template: convertTemplate(RawHTMLApp),
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["moveable"]),
            language: "html",
        },
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["moveable"]),
            language: "css",
        },
    ],
};
