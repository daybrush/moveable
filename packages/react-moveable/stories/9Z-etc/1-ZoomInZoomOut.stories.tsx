import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactZoomInZoomOutApp";
import RawReactApp from "!!raw-loader!./apps/ReactZoomInZoomOutApp";
import {
    DEFAULT_DRAGGABLE_CONTROLS, SCALE_CONTROLS,
} from "../controls/default";


export const ZoomInZoomOutTemplate = App as any;

ZoomInZoomOutTemplate.storyName = "Zoom with Moveable";
ZoomInZoomOutTemplate.argTypes = {
    ...SCALE_CONTROLS,
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
ZoomInZoomOutTemplate.args = {
    ...makeArgs(ZoomInZoomOutTemplate.argTypes),
};


ZoomInZoomOutTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
