import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs, makeArgType, makeLink } from "../utils";
import App from "./apps/ReactZoomInZoomOutApp";
import RawReactApp from "!!raw-loader!./apps/ReactZoomInZoomOutApp";


export const ZoomInZoomOutTemplate = App as any;

ZoomInZoomOutTemplate.storyName = "Zoom with Moveable";
ZoomInZoomOutTemplate.argTypes = {
    containerScale: makeArgType({
        type: "number",
        description: "Container's transform scale",
        defaultValue: 2,
    }),
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
