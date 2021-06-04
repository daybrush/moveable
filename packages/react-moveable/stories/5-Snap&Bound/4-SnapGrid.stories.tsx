import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactSnapGridApp";
import RawReactApp from "!!raw-loader!./apps/ReactSnapGridApp";
import {
    DEFAULT_SNAP_GRID_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";

export const SnapGridTemplate = App as any;

SnapGridTemplate.storyName = "Snap Grid";
SnapGridTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,
    ...DEFAULT_SNAP_GRID_CONTROLS,
};
SnapGridTemplate.args = {
    ...makeArgs(SnapGridTemplate.argTypes),
};


SnapGridTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
