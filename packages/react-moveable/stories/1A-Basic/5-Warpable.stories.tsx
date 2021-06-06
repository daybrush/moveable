import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactWarpableApp";
import RawReactApp from "!!raw-loader!./apps/ReactWarpableApp";
import {
    DEFAULT_WARPABLE_CONTROLS,
} from "../controls/default";


export default {
    title: "Basic",
};

export const WarpableTemplate = App as any;

WarpableTemplate.storyName = "Warpable";
WarpableTemplate.argTypes = {
    ...DEFAULT_WARPABLE_CONTROLS,
};
WarpableTemplate.args = {
    ...makeArgs(WarpableTemplate.argTypes),
};


WarpableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
