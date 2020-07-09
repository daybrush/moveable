import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/basic/basic.css";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";
import RoundableApp, { ROUNDABLE_TEMPLATE_OPTIONS, ROUNDABLE_FRAME, ROUNDABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Roundable.template";
import {
    NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE,
    NESTED_REACT_MARKUP_TEMPLATE, NESTED_ANGULAR_MARKUP_TEMPLATE,
    NESTED_SVELTE_MARKUP_TEMPLATE
} from "../../template/nested/template";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Roundable", () => {
    return <RoundableApp key={Math.random()}
        children={NESTED_JSX}
        description={<p className="description">No matter how many transforms are layered,
            you can adjust the border-radius by dragging or double clicking.<br />
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Roundable.html" target="_blank">See Roundable API</a> ,
        </p>
        }
        {...ROUNDABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(ROUNDABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, ROUNDABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, ROUNDABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(ROUNDABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(ROUNDABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, ROUNDABLE_TEMPLATE_OPTIONS),
        ROUNDABLE_FRAME,
    ),
});
