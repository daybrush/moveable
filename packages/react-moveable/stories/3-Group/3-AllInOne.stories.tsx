import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactAllInOneApp";
import RawReactApp from "!!raw-loader!./apps/ReactAllInOneApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS, DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { DEFAULT_GROUPPABLE_GROUP_CONTROLS } from "../controls/group";
// import  from "../controls/default";

export const AllInOneTemplate = App as any;

AllInOneTemplate.storyName = "All In One";
AllInOneTemplate.argTypes = {
    ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
    ...DEFAULT_SCALABLE_CONTROLS,
    ...DEFAULT_ROTATABLE_CONTROLS,
};
AllInOneTemplate.args = {
    ...makeArgs(AllInOneTemplate.argTypes),
};


AllInOneTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
