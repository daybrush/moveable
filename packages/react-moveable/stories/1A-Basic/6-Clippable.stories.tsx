import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactClippableApp";
import RawReactApp from "!!raw-loader!./apps/ReactClippableApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_CLIPPABLE_CONTROLS,
} from "../controls/default";


export const ClippableTemplate = App as any;

ClippableTemplate.storyName = "Clippable";
ClippableTemplate.argTypes = {
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_CLIPPABLE_CONTROLS,
};
ClippableTemplate.args = {
    ...makeArgs(ClippableTemplate.argTypes),
};


ClippableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
