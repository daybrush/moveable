import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactRotatableApp";
import RawReactApp from "!!raw-loader!./apps/ReactRotatableApp";
import {
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";


export const RotatableTemplate = App as any;

RotatableTemplate.storyName = "Rotatable";
RotatableTemplate.argTypes = {
    ...DEFAULT_ROTATABLE_CONTROLS,
};
RotatableTemplate.args = {
    ...makeArgs(RotatableTemplate.argTypes),
};


RotatableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
