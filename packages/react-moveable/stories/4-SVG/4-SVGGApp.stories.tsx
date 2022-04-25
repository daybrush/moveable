import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate } from "../utils";
import App from "./apps/ReactSVGGApp";
import RawReactApp from "!!raw-loader!./apps/ReactSVGGApp";

export const SVGGTemplate = App as any;

SVGGTemplate.storyName = "SVGElement (G tag)";


SVGGTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
