import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, object, optionsKnob, radios } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/basic/basic.css";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import ClippableApp, { CLIPPABLE_FRAME, CLIPPABLE_TEMPLATE_OPTIONS, CLIPPABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Clippable.template";
import {
    NESTED_JSX, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_HTML_TEMPLATE,
    NESTED_CSS_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE, NESTED_ANGULAR_MARKUP_TEMPLATE
} from "../../template/nested/template";
import { DRAGGABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Draggable.template";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Cliappable", () => {
    return <ClippableApp key={Math.random()}
        description={<p className="description">No matter how many transforms are layered, you can clip the target properly. (<a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Clippable.html" target="_blank">See Clippable API</a>)</p>}
        children={NESTED_JSX}
        {...CLIPPABLE_PROPS_TEMPLATE()}
        {...DRAGGABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        CLIPPABLE_FRAME,
    ),
});
