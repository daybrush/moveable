import * as React from "react";
import Moveable from "@/react-moveable";
import { DEFAULT_REACT_CODESANDBOX, previewTemplate } from "storybook-addon-preview";
import "../common.css";
import "../templates/default.css";
import { convertPath, convertTemplate, makeArgs, makeArgType } from "../utils";
import App from "./apps/DraggableApp";
import RawApp from "!!raw-loader!./apps/DraggableApp";
import { DEFAULT_DRAGGABLE_CONTROLS } from "../controls/default";



export const DraggableTemplate = App as any;

DraggableTemplate.storyName = "Draggable";
DraggableTemplate.argTypes = {
    containerScale: makeArgType({
        type: "number",
        description: `<a href="#" target="_blank">Container's scale</a>`,
        defaultValue: 1,
    }),
    ...DEFAULT_DRAGGABLE_CONTROLS,
};
DraggableTemplate.args = {
    ...makeArgs(DraggableTemplate.argTypes),
};


DraggableTemplate.parameters = {
    preview: [
        {
            tab: "React",
            template: convertTemplate(convertPath(RawApp)),
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            language: "tsx",
        },
    ],
};
