import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./apps/ReactFixedBoundApp";
import RawReactApp from "!!raw-loader!./apps/ReactFixedBoundApp";
import {
    DEFAULT_BOUNDS_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
} from "../controls/default";

export const FixedBoundTemplate = App as any;

FixedBoundTemplate.storyName = "Bound (position: fixed)";
FixedBoundTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_BOUNDS_CONTROLS,
};
FixedBoundTemplate.args = {
    ...makeArgs(FixedBoundTemplate.argTypes),
};


FixedBoundTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
