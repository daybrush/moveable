import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, object, optionsKnob, radios } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import {
    BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE, BASIC_REACT_MARKUP_TEMPLATE,
    BASIC_ANGULAR_MARKUP_TEMPLATE, BASIC_SVELTE_MARKUP_TEMPLATE,
} from "../../template/basic/template";
import "../../template/basic/basic.css";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import OriginDraggableApp, {
    ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS, ORIGIN_DRAGGABLE_FRAME,
    ORIGIN_DRAGGABLE_PROPS_TEMPLATE
} from "../../template/basic/ables/OriginDraggable.template";
import { DRAGGABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Draggable.template";
import { ROTATABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Rotatable.template";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("OriginDraggable", () => {
    return <OriginDraggableApp key={Math.random()}
        description={<p className="description">You can only move the origin without moving the target.<br />
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.OriginDraggable.html" target="_blank">See OriginDraggable API</a> ,
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html" target="_blank">See Draggable API</a> ,
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html" target="_blank">See Rotatable API</a>
        </p>
        }
        {...ORIGIN_DRAGGABLE_PROPS_TEMPLATE()}
        {...DRAGGABLE_PROPS_TEMPLATE()}
        {...ROTATABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        BASIC_HTML_TEMPLATE,
        BASIC_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(BASIC_REACT_MARKUP_TEMPLATE, ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(BASIC_ANGULAR_MARKUP_TEMPLATE, ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(BASIC_SVELTE_MARKUP_TEMPLATE, ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS),
        ORIGIN_DRAGGABLE_FRAME,
    ),
});
