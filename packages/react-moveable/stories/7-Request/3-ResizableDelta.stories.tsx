import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ResizableDeltaApp";
import RawApp from "!!raw-loader!./apps/ResizableDeltaApp";
import {
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";


export const ResizableDeltaTemplate = App as any;

ResizableDeltaTemplate.storyName = "Resizable Delta";
ResizableDeltaTemplate.argTypes = {
    ...DEFAULT_RESIZABLE_CONTROLS,
};
ResizableDeltaTemplate.args = {
    ...makeArgs(ResizableDeltaTemplate.argTypes),
};


ResizableDeltaTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
