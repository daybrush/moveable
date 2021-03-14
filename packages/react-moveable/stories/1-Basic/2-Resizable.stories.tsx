import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../basic.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./ResizableApp";
import RawApp from "!!raw-loader!./ResizableApp";
import {
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";


export default {
    title: "Basic",
};

export const ResizableTemplate = App as any;

ResizableTemplate.storyName = "Resizable";
ResizableTemplate.argTypes = {
    ...DEFAULT_RESIZABLE_CONTROLS,
};
ResizableTemplate.args = {
    ...makeArgs(ResizableTemplate.argTypes),
};


ResizableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
