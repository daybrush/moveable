import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../basic.css";
import { convertPath, convertTemplate, makeArgs } from "../utils";
import App from "./apps/ResizableGroupApp";
import RawApp from "!!raw-loader!./apps/ResizableGroupApp";
import {
    DEFAULT_RESIZABLE_CONTROLS,
} from "../controls/default";
import { DEFAULT_RESIZABLE_GROUP_CONTROLS } from "../controls/group";


export const ResizableGroupTemplate = App as any;

ResizableGroupTemplate.storyName = "Resizable";
ResizableGroupTemplate.argTypes = {
    ...DEFAULT_RESIZABLE_CONTROLS,
    ...DEFAULT_RESIZABLE_GROUP_CONTROLS,
};
ResizableGroupTemplate.args = {
    ...makeArgs(ResizableGroupTemplate.argTypes),
};


ResizableGroupTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
