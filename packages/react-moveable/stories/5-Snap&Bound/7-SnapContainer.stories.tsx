import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSnapContainerApp";
import RawReactApp from "!!raw-loader!./apps/ReactSnapContainerApp";
import {
    DEFAULT_BOUNDS_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SNAPPABLE_CONTROLS,
    DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
} from "../controls/default";

export const SnapContainerTemplate = App as any;

SnapContainerTemplate.storyName = "Use snapContainer";
SnapContainerTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SNAPPABLE_CONTROLS,
    ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
    ...DEFAULT_BOUNDS_CONTROLS,
};
SnapContainerTemplate.args = {
    ...makeArgs(SnapContainerTemplate.argTypes),
};


SnapContainerTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
