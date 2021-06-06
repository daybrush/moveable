import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import App from "./apps/EditableApp";
import RawApp from "!!raw-loader!./apps/EditableApp";
import { DEFAULT_CSS_TEMPLATE } from "@/stories/templates/default";
import { convertReactTemplate, convertPath } from "../utils";


export const EditableTemplate = App as any;

EditableTemplate.storyName = "Editable";
EditableTemplate.argTypes = {};
EditableTemplate.args = {};

EditableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper"]),
            language: "tsx",
        },
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
    ],
};
