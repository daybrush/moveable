import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate, makeArgs } from "../utils";
import App from "./apps/ReactFormSelectApp";
import RawApp from "!!raw-loader!./apps/ReactFormSelectApp";


export const FormSelectTemplate = App as any;

FormSelectTemplate.storyName = "Test Form Select Element";
FormSelectTemplate.argTypes = {};
FormSelectTemplate.args = {};


FormSelectTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
