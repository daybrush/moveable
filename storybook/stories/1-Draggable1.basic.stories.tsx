import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import DraggableApp, { BASIC_DRAGGABLE_VANILLA_TEMPLATE, BASIC_DRAGGABLE_REACT_TEMPLATE, BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE, BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE, BASIC_DRAGGABLE_SVELTE_TEMPLATE, BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE } from "../template/basic/Draggable.template";
import { BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE } from "../template/basic/template";
import "../template/basic/basic.css";
import { REACT_CODESANDBOX, VANILLA_CODESANDBOX, ANGULAR_CODESANDBOX, SVELTE_CODESANDBOX } from "../template/codesandbox";
import { DEFAULT_ANGULAR_MODULE_TEMPLATE } from "../template/default";

const story = storiesOf("Draggable", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Drag & Drop", () => {
    return <DraggableApp
        throttleDrag={number("throttleDrag", 0)}
        throttleDragRotate={number("throttleDragRotate", 0)}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
    />;
}, {
    preview: [
        {
            tab: "HTML",
            template: BASIC_HTML_TEMPLATE,
            language: "html",
        },
        {
            tab: "CSS",
            template: BASIC_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "Vanilla",
            template: BASIC_DRAGGABLE_VANILLA_TEMPLATE,
            codesandbox: VANILLA_CODESANDBOX,
        },
        {
            tab: "React",
            template: BASIC_DRAGGABLE_REACT_TEMPLATE,
            language: "tsx",
            codesandbox: REACT_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE,
            language: "markup",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE,
            language: "typescript",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.module.ts",
            template: DEFAULT_ANGULAR_MODULE_TEMPLATE,
            language: "typescript",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Svelte",
            template: BASIC_DRAGGABLE_SVELTE_TEMPLATE,
            language: "html",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        },
        {
            tab: "Svelte",
            template: BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE,
            language: "tsx",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        }
    ],
});
