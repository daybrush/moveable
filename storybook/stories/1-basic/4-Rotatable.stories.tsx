import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, radios, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import {
    BASIC_HTML_TEMPLATE, BASIC_CSS_TEMPLATE, BASIC_REACT_MARKUP_TEMPLATE,
    BASIC_ANGULAR_MARKUP_TEMPLATE, BASIC_SVELTE_MARKUP_TEMPLATE,
} from "../../template/basic/template";
import "../../template/basic/basic.css";
import RotatableApp, { ROTATABLE_FRAME } from "../../template/basic/ables/Rotatable.template";
import { previewCollection } from "../../template/utils";
import { BASIC_ROTATABLE_VANILLA_TEMPLATE } from "../../template/basic/frameworks/Vanilla";
import { BASIC_ROTATABLE_REACT_TEMPLATE } from "../../template/basic/frameworks/React";
import { BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE, BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE } from "../../template/basic/frameworks/Angular";
import { BASIC_ROTATABLE_SVELTE_TEMPLATE, BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE } from "../../template/basic/frameworks/Svelte";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Rotatable", () => {
    return <RotatableApp
        throttleRotate={number("throttleRotate", 0)}
        rotationPosition={radios("rotationPosition", { top: "top", left: "left", right: "right", bottom: "bottom" }, "top")}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
        padding={object("padding", { left: 0, top: 0, right: 0, bottom: 0 })}
    />;
}, {
    preview: previewCollection(
        BASIC_HTML_TEMPLATE,
        BASIC_CSS_TEMPLATE,
        BASIC_ROTATABLE_VANILLA_TEMPLATE,
        BASIC_ROTATABLE_REACT_TEMPLATE(BASIC_REACT_MARKUP_TEMPLATE),
        BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE(BASIC_ANGULAR_MARKUP_TEMPLATE),
        BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE,
        BASIC_ROTATABLE_SVELTE_TEMPLATE(BASIC_CSS_TEMPLATE),
        BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE(BASIC_SVELTE_MARKUP_TEMPLATE),
        ROTATABLE_FRAME,
    ),
});
