import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import {
    BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE, BASIC_REACT_MARKUP_TEMPLATE,
    BASIC_ANGULAR_MARKUP_TEMPLATE, BASIC_SVELTE_MARKUP_TEMPLATE,
} from "../../template/basic/template";
import "../../template/basic/basic.css";
import ResizableApp, { RESIZABLE_FRAME, RESIZABLE_TEMPLATE_OPTIONS } from "../../template/basic/ables/Resizable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Resizable", () => {
    return <ResizableApp
        description={<p className="description">You can resize the target. (<a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html" target="_blank">See Resizable API</a>)</p>}
        keepRatio={boolean("keepRatio", false)}
        throttleResize={number("throttleResize", 1)}
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
        BASIC_HTML_TEMPLATE,
        BASIC_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(BASIC_REACT_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(BASIC_ANGULAR_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(BASIC_SVELTE_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        RESIZABLE_FRAME,
    ),
});
