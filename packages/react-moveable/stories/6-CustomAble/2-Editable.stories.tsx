import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import App from "./apps/EditableApp";
import RawApp from "!!raw-loader!./apps/EditableApp";
import { DEFAULT_CSS_TEMPLATE } from "@/stories/templates/default";
import { convertTemplate, convertPath } from "../utils";


export const EditableTemplate = App as any;

EditableTemplate.storyName = "Editable";
EditableTemplate.argTypes = {};
EditableTemplate.args = {};

EditableTemplate.parameters = {
    preview: [
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper"]),
            language: "tsx",
        },
    ],
};
