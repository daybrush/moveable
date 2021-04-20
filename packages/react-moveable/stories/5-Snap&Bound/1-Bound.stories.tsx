import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./apps/ReactBoundApp";
import RawReactApp from "!!raw-loader!./apps/ReactBoundApp";
import {
    DEFAULT_BOUNDS_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
} from "../controls/default";

export const BoundTemplate = App as any;

BoundTemplate.storyName = "Bound";
BoundTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_BOUNDS_CONTROLS,
};
BoundTemplate.args = {
    ...makeArgs(BoundTemplate.argTypes),
};


BoundTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
