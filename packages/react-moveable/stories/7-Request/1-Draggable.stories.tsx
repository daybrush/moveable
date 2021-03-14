import * as React from "react";
import Moveable from "../../src/react-moveable";
import { DEFAULT_REACT_CODESANDBOX, previewTemplate } from "storybook-addon-preview";
import "../common.css";
import "../basic.css";
import { convertPath, convertTemplate, makeArgs, makeArgType } from "../utils";
import App from "./DraggableApp";
import RawApp from "!!raw-loader!./DraggableApp";
import { DEFAULT_DRAGGABLE_CONTROLS } from "../controls/default";


export default {
    title: "Request ables through a method",
};

export const Template = App as any;

Template.storyName = "Draggable";
Template.argTypes = {
    containerScale: makeArgType({
        type: "number",
        description: `<a href="#" target="_blank">Container's scale</a>`,
        defaultValue: 1,
    }),
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
Template.args = {
    ...makeArgs(Template.argTypes),
};


Template.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
