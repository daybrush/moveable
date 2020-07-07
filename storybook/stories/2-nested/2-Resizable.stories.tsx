import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/nested/nested.css";
import ResizableApp, { RESIZABLE_FRAME, RESIZABLE_TEMPLATE_OPTIONS, RESIZABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Resizable.template";
import {
    NESTED_JSX, NESTED_HTML_TEMPLATE, NESTED_CSS_TEMPLATE,
    NESTED_ANGULAR_MARKUP_TEMPLATE, NESTED_SVELTE_MARKUP_TEMPLATE, NESTED_REACT_MARKUP_TEMPLATE
} from "../../template/nested/template";
import { previewCollection } from "../../template/utils";
import { BASIC_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ANGULAR_HTML_TEMPLATE, BASIC_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_SVELTE_TEMPLATE, BASIC_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Nested Transform", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Resizable", () => {
    return <ResizableApp
        children={NESTED_JSX}
        {...RESIZABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        NESTED_HTML_TEMPLATE,
        NESTED_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(NESTED_REACT_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(NESTED_ANGULAR_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(RESIZABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(NESTED_SVELTE_MARKUP_TEMPLATE, RESIZABLE_TEMPLATE_OPTIONS),
        RESIZABLE_FRAME,
    ),
});
