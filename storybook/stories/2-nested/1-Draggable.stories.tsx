import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import DraggableApp, { DRAGGABLE_FRAME } from "../../template/basic/ables/Draggable.template";
import "../../template/nested/nested.css";
import {
    NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE,
    NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE,
} from "../../template/nested/template";
import { previewCollection } from "../../template/utils";
import { BASIC_DRAGGABLE_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_DRAGGABLE_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE, BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_DRAGGABLE_SVELTE_TEMPLATE, BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Draggable", () => {
    return <DraggableApp
        children={NESTED_JSX}
        throttleDrag={number("throttleDrag", 0)}
        throttleDragRotate={number("throttleDragRotate", 0)}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_DRAGGABLE_VANILLA_TEMPLATE,
        BASIC_DRAGGABLE_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE),
        BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE),
        BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE,
        BASIC_DRAGGABLE_SVELTE_TEMPLATE(NESTED_CSS_TEMPLATE),
        BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE),
        DRAGGABLE_FRAME,
    ),
});
