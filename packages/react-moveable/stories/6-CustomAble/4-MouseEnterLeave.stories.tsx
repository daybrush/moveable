import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import "../templates/default.css";
import App from "./apps/MouseEnterLeaveApp";
import RawApp from "!!raw-loader!./apps/MouseEnterLeaveApp";
import { DEFAULT_CSS_TEMPLATE } from "@/stories/templates/default";
import { convertReactTemplate, convertPath } from "../utils";


export const MouseEnterLeave = App as any;

MouseEnterLeave.storyName = "Mouse Enter & Leave";
MouseEnterLeave.argTypes = {};
MouseEnterLeave.args = {};

MouseEnterLeave.parameters = {
    preview: [
        {
            tab: "React",
            template: convertReactTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            language: "css",
        },
    ],
};
