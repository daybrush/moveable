import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSnapGuidelinesApp";
import RawReactApp from "!!raw-loader!./apps/ReactSnapGuidelinesApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_SNAPPABLE_CONTROLS,
    DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
} from "../controls/default";

export const SnapGuidelinesTemplate = App as any;

SnapGuidelinesTemplate.storyName = "Snap Guidelines";
SnapGuidelinesTemplate.argTypes = {
    ...DEFAULT_SNAPPABLE_CONTROLS,
    ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,

};
SnapGuidelinesTemplate.args = {
    ...makeArgs(SnapGuidelinesTemplate.argTypes),
};


SnapGuidelinesTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
