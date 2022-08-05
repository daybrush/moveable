import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs, makeArgType, makeLink } from "../utils";
import App from "./apps/ReactMaxSnapElementApp";
import RawReactApp from "!!raw-loader!./apps/ReactMaxSnapElementApp";

export const maxSnapElementTemplate = App as any;

maxSnapElementTemplate.storyName = "maxSnapElementGuidelineDistance, maxSnapElementGapDistance";
maxSnapElementTemplate.argTypes = {
    maxSnapElementGuidelineDistance: makeArgType({
        type: "number",
        description: makeLink("Snappable", "maxSnapElementGuidelineDistance"),
        defaultValue: 100,
    }),
    maxSnapElementGapDistance: makeArgType({
        type: "number",
        description: makeLink("Snappable", "maxSnapElementGapDistance"),
        defaultValue: 80,
    }),
};
maxSnapElementTemplate.args = {
    ...makeArgs(maxSnapElementTemplate.argTypes),
};


maxSnapElementTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawReactApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
