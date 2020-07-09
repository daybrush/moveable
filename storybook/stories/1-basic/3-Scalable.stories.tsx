import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import {
    BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE,
    BASIC_REACT_MARKUP_TEMPLATE, BASIC_ANGULAR_MARKUP_TEMPLATE,
    BASIC_SVELTE_MARKUP_TEMPLATE
} from "../../template/basic/template";
import "../../template/basic/basic.css";
import ScalableApp, { SCALABLE_FRAME, SCALABLE_TEMPLATE_OPTIONS, SCALABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Scalable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Scalable", () => {
    return <ScalableApp
        description={<p className="description">You can scale the target. (<a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html" target="_blank">See Scalable API</a>)</p>}
        {...SCALABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        BASIC_HTML_TEMPLATE,
        BASIC_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(SCALABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(BASIC_REACT_MARKUP_TEMPLATE, SCALABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(BASIC_ANGULAR_MARKUP_TEMPLATE, SCALABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(SCALABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(SCALABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(BASIC_SVELTE_MARKUP_TEMPLATE, SCALABLE_TEMPLATE_OPTIONS),
        SCALABLE_FRAME,
    ),
});
