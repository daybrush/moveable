import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertReactTemplate } from "../utils";
import App from "./apps/ReactFixedDirectionApp";
import RawApp from "!!raw-loader!./apps/ReactFixedDirectionApp";


export const FixedDirectionTemplate = App as any;

FixedDirectionTemplate.storyName = "Test Fixed Direction";
FixedDirectionTemplate.argTypes = {};
FixedDirectionTemplate.args = {};


FixedDirectionTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
