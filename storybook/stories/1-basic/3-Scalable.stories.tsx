import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import { BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE } from "../../template/basic/template";
import "../../template/basic/basic.css";
import { REACT_CODESANDBOX, VANILLA_CODESANDBOX, ANGULAR_CODESANDBOX, SVELTE_CODESANDBOX } from "../../template/codesandbox";
import { DEFAULT_ANGULAR_MODULE_TEMPLATE } from "../../template/default";
import ScalableApp, {
    BASIC_SCALABLE_VANILLA_TEMPLATE, BASIC_SCALABLE_REACT_TEMPLATE, BASIC_SCALABLE_ANGULAR_HTML_TEMPLATE,
    BASIC_SCALABLE_ANGULAR_COMPONENT_TEMPLATE, BASIC_SCALABLE_SVELTE_TEMPLATE, BASIC_SCALABLE_SVELTE_JSX_TEMPLATE,
} from "../../template/basic/Scalable.template";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Scalable", () => {
    return <ScalableApp
        keepRatio={boolean("keepRatio", false)}
        throttleScale={number("throttleScale", 0)}
        renderDirections={array("renderDirections", [
            "nw", "n", "ne", "w", "e", "sw", "s", "se",
        ])}
        edge={boolean("edge", false)}
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
            template: BASIC_SCALABLE_VANILLA_TEMPLATE,
            codesandbox: VANILLA_CODESANDBOX,
        },
        {
            tab: "React",
            template: BASIC_SCALABLE_REACT_TEMPLATE,
            language: "tsx",
            codesandbox: REACT_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: BASIC_SCALABLE_ANGULAR_HTML_TEMPLATE,
            language: "markup",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: BASIC_SCALABLE_ANGULAR_COMPONENT_TEMPLATE,
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
            template: BASIC_SCALABLE_SVELTE_TEMPLATE,
            language: "html",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        },
        {
            tab: "Svelte",
            template: BASIC_SCALABLE_SVELTE_JSX_TEMPLATE,
            language: "tsx",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        },
    ],
});
