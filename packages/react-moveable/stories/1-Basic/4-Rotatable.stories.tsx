import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./apps/RotatableApp";
import RawApp from "!!raw-loader!./apps/RotatableApp";
import {
    DEFAULT_ROTATABLE_CONTROLS,
} from "../controls/default";


export default {
    title: "Basic",
};

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
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
