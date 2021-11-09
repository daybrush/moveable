import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ResizableApp";
import RawApp from "!!raw-loader!./apps/ResizableApp";
import {
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";



export const ResizableTemplate = App as any;

ResizableTemplate.storyName = "Resizable with display: flex";
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
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
