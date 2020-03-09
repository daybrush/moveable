import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, radios } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/nested/nested.css";
import RotatableApp, { ROTATABLE_FRAME } from "../../template/basic/ables/Rotatable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_ROTATABLE_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_ROTATABLE_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE, BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_ROTATABLE_SVELTE_TEMPLATE, BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import {
    NESTED_REACT_MARKUP_TEMPLATE, NESTED_HTML_TEMPLATE,
    NESTED_CSS_TEMPLATE, NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE,
} from "../../template/nested/template";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Rotatable", () => {
    return <RotatableApp
        throttleRotate={number("throttleRotate", 0)}
        rotationPosition={radios("rotationPosition", { top: "top", left: "left", right: "right", bottom: "bottom" }, "top")}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_ROTATABLE_VANILLA_TEMPLATE,
        BASIC_ROTATABLE_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE),
        BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE),
        BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE,
        BASIC_ROTATABLE_SVELTE_TEMPLATE(NESTED_CSS_TEMPLATE),
        BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE),
        ROTATABLE_FRAME,
    ),
});
