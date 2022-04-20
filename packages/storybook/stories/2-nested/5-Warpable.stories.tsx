import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/nested/nested.css";
import WarpableApp, { WARPABLE_FRAME, WARPABLE_TEMPLATE_OPTIONS } from "../../template/basic/ables/Warpable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import {
    NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE,
    NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_JSX
} from "../../template/nested/template";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Warpable", () => {
    return <WarpableApp
    description={<p className="description">No matter how many transforms are layered, you can warp the target properly. (<a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Warpable.html" target="_blank">See Warpable API</a>)</p>}
        children={NESTED_JSX}
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
        BASIC_VANILLA_TEMPLATE(WARPABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, WARPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, WARPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(WARPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(WARPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, WARPABLE_TEMPLATE_OPTIONS),
        WARPABLE_FRAME,
    ),
});
