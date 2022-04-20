import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import DraggableApp, {
    DRAGGABLE_FRAME, DRAGGABLE_PROPS_TEMPLATE,
} from "../../template/basic/ables/Draggable.template";
import "../../template/basic/basic.css";
import { previewCollection } from "../../template/utils";
import "../index.css";
import { SNAP_DRAGGABLE_TEMPLATE_OPTIONS } from "../../template/snap/ables/Draggable.template";
import { SNAP_PROPS_TEMPLATE } from "../../template/basic/ables/Snappable.template";
import {
    NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE,
    NESTED_REACT_MARKUP_TEMPLATE, NESTED_ANGULAR_MARKUP_TEMPLATE
} from "../../template/nested/template";
import { SNAP_REACT_TEMPLATE } from "../../template/snap/frameworks/React";
import { SNAP_ANGULAR_HTML_TEMPLATE, SNAP_ANGULAR_COMPONENT_TEMPLATE } from "../../template/snap/frameworks/Angular";
import { SNAP_VANILLA_TEMPLATE } from "../../template/snap/frameworks/Vanilla";
import { SNAP_SVELTE_TEMPLATE, SNAP_SVELTE_JSX_TEMPLATE } from "../../template/snap/frameworks/Svelte";

const story = storiesOf("Use Snap & Bounds with ables", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Snap Guidelines, Elements", () => {
    return <DraggableApp
        children={NESTED_JSX}
        callback={() => {
            return {
                elementGuidelines: [
                    document.querySelector(".nested.rotate"),
                    document.querySelector(".nested.scale"),
                    document.querySelector(".nested.first"),
                ],
            };
        }}
        description={<p className="description">You can snap the target with Draggable, Resizable, Scalable, Warpable. (
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html" target="_blank">See Snappable API</a>)
            <br/>
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html" target="_blank">See Draggable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html" target="_blank">See Resizable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html" target="_blank">See Scalable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Warpable.html" target="_blank">See Warpable API</a> &nbsp;
        </p>}
        // key={Math.random()}
        {...SNAP_PROPS_TEMPLATE()}
        {...DRAGGABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        SNAP_VANILLA_TEMPLATE(SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        SNAP_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        SNAP_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        SNAP_ANGULAR_COMPONENT_TEMPLATE(SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        SNAP_SVELTE_TEMPLATE(SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        SNAP_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, SNAP_DRAGGABLE_TEMPLATE_OPTIONS),
        DRAGGABLE_FRAME,
    ),
});
