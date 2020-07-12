import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import DraggableApp, {
    DRAGGABLE_FRAME, DRAGGABLE_PROPS_TEMPLATE,
} from "../../template/basic/ables/Draggable.template";
import "../../template/basic/basic.css";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_COMPONENT_TEMPLATE, BASIC_ANGULAR_HTML_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import "../index.css";
import { BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS } from "../../template/snap/ables/Draggable.template";
import { BOUNDS_PROPS_TEMPLATE } from "../../template/basic/ables/Snappable.template";
import { NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE, NESTED_ANGULAR_MARKUP_TEMPLATE } from "../../template/nested/template";

const story = storiesOf("Use Snap & Bounds with ables", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Bounds Area", () => {
    return <DraggableApp
        children={NESTED_JSX}
        description={<p className="description">You can only move the target within the bounds area with Draggable, Resizable, Rotatable, Warpable, Scalable. (
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html" target="_blank">See Snappable API</a>)
            <br/>
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html" target="_blank">See Draggable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html" target="_blank">See Resizable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html" target="_blank">See Scalable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Warpable.html" target="_blank">See Warpable API</a> &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html" target="_blank">See Rotatable API</a> &nbsp;
        </p>}
        // key={Math.random()}
        {...BOUNDS_PROPS_TEMPLATE()}
        {...DRAGGABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS),
        DRAGGABLE_FRAME,
    ),
});
