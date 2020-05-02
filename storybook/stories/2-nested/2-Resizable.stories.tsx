import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/nested/nested.css";
import ResizableApp, { RESIZABLE_FRAME } from "../../template/basic/ables/Resizable.template";
import {
    NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE,
    NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE
} from "../../template/nested/template";
import { previewCollection } from "../../template/utils";
import { BASIC_RESIZABLE_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_RESIZABLE_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_RESIZABLE_ANGULAR_HTML_TEMPLATE, BASIC_RESIZABLE_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_RESIZABLE_SVELTE_TEMPLATE, BASIC_RESIZABLE_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Resizable", () => {
    return <ResizableApp
        children={NESTED_JSX}
        keepRatio={boolean("keepRatio", false)}
        throttleResize={number("throttleResize", 0)}
        renderDirections={array("renderDirections", [
            "nw", "n", "ne", "w", "e", "sw", "s", "se",
        ])}
        edge={boolean("edge", false)}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
        padding={object("padding", { left: 0, top: 0, right: 0, bottom: 0 })}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_RESIZABLE_VANILLA_TEMPLATE,
        BASIC_RESIZABLE_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE),
        BASIC_RESIZABLE_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE),
        BASIC_RESIZABLE_ANGULAR_COMPONENT_TEMPLATE,
        BASIC_RESIZABLE_SVELTE_TEMPLATE(NESTED_CSS_TEMPLATE),
        BASIC_RESIZABLE_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE),
        RESIZABLE_FRAME,
    ),
});
