import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactZoomGroupApp";
import RawReactApp from "!!raw-loader!./apps/ReactZoomGroupApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";


export const ZoomGroupTemplate = App as any;

ZoomGroupTemplate.storyName = "Zoom Group";
ZoomGroupTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
ZoomGroupTemplate.args = {
    ...makeArgs(ZoomGroupTemplate.argTypes),
};


ZoomGroupTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
