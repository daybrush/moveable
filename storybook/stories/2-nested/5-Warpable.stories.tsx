import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/nested/nested.css";
import WarpableApp, { WARPABLE_FRAME } from "../../template/basic/ables/Warpable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_WARPABLE_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_WARPABLE_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_WARPABLE_ANGULAR_HTML_TEMPLATE, BASIC_WARPABLE_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_WARPABLE_SVELTE_TEMPLATE, BASIC_WARPABLE_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import {
    NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE,
    NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE
} from "../../template/nested/template";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Warpable", () => {
    return <WarpableApp
        renderDirections={array("renderDirections", [
            "nw", "n", "ne", "w", "e", "sw", "s", "se",
        ])}
        edge={boolean("edge", false)}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_WARPABLE_VANILLA_TEMPLATE,
        BASIC_WARPABLE_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE),
        BASIC_WARPABLE_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE),
        BASIC_WARPABLE_ANGULAR_COMPONENT_TEMPLATE,
        BASIC_WARPABLE_SVELTE_TEMPLATE(NESTED_CSS_TEMPLATE),
        BASIC_WARPABLE_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE),
        WARPABLE_FRAME,
    ),
});
