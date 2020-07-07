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
import ClippableApp, { CLIPPABLE_FRAME, CLIPPABLE_TEMPLATE_OPTIONS } from "../../template/basic/ables/Clippable.template";

const story = storiesOf("Basic", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Cliappable", () => {
    return <ClippableApp key={Math.random()}
        draggable={boolean("draggable", true)}
        clipRelative={boolean("clipRelative", false)}
        clipArea={boolean("clipArea", false)}
        dragWithClip={boolean("dragWithClip", true)}
        defaultClipPath={radios("defaultClipPath", {
            circle: "circle", inset: "inset",
            ellipse: "ellipse", rect: "rect",
            polygon: "polygon",
        }, "inset")}
        zoom={number("zoom", 1)}
        origin={boolean("origin", true)}
        padding={object("padding", { left: 0, top: 0, right: 0, bottom: 0 })}
    />;
}, {
    preview: previewCollection(
        BASIC_HTML_TEMPLATE,
        BASIC_CSS_TEMPLATE,
        BASIC_VANILLA_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_REACT_TEMPLATE(BASIC_REACT_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_HTML_TEMPLATE(BASIC_ANGULAR_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_ANGULAR_COMPONENT_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_TEMPLATE(CLIPPABLE_TEMPLATE_OPTIONS),
        BASIC_SVELTE_JSX_TEMPLATE(BASIC_SVELTE_MARKUP_TEMPLATE, CLIPPABLE_TEMPLATE_OPTIONS),
        CLIPPABLE_FRAME,
    ),
});
