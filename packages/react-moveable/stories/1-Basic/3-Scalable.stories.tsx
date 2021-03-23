import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./ScalableApp";
import RawApp from "!!raw-loader!./ScalableApp";
import {
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";


export default {
    title: "Basic",
};

export const ScalableTemplate = App as any;

ScalableTemplate.storyName = "Scalable";
ScalableTemplate.argTypes = {
    ...DEFAULT_SCALABLE_CONTROLS,
};
ScalableTemplate.args = {
    ...makeArgs(ScalableTemplate.argTypes),
};


ScalableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
