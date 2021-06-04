import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSnapElementsApp";
import RawReactApp from "!!raw-loader!./apps/ReactSnapElementsApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_SNAPPABLE_CONTROLS,
    DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS,
} from "../controls/default";

export const SnapElementsTemplate = App as any;

SnapElementsTemplate.storyName = "Snap Elements";
SnapElementsTemplate.argTypes = {
    ...DEFAULT_SNAPPABLE_CONTROLS,
    ...DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,

};
SnapElementsTemplate.args = {
    ...makeArgs(SnapElementsTemplate.argTypes),
};


SnapElementsTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
