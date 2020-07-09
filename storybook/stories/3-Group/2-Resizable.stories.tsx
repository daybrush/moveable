import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, object, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/group/group.css";
import { previewCollection } from "../../template/utils";
import DraggableApp from "../../template/group/ables/Draggable.template";
import { GROUP_REACT_TEMPLATE } from "../../template/group/frameworks/React";
import {
    GROUP_REACT_MARKUP_TEMPLATE, GROUP_HTML_TEMPLATE, GROUP_CSS_TEMPLATE,
    GROUP_ANGULAR_MARKUP_TEMPLATE, GROUP_SVELTE_MARKUP_TEMPLATE
} from "../../template/group/template";
import { GROUP_VANILLA_TEMPLATE } from "../../template/group/frameworks/Vanilla";
import { GROUP_ANGULAR_HTML_TEMPLATE, GROUP_ANGULAR_COMPONENT_TEMPLATE } from "../../template/group/frameworks/Angular";
import { GROUP_SVELTE_TEMPLATE, GROUP_SVELTE_JSX_TEMPLATE } from "../../template/group/frameworks/Svelte";
import ResizableApp, { GROUP_RESIZABLE_TEMPLATE_OPTIONS } from "../../template/group/ables/Resizable.template";
import { RESIZABLE_FRAME, RESIZABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Resizable.template";
import { GROUP_PROPS_TEMPLATE } from "../../template/group/ables/Groupable.template";

const story = storiesOf("Group", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Resizable", () => {
    return <ResizableApp
        description={<p className="description">You can resize the targets. (
        <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html" target="_blank">See Resizable API</a>, &nbsp;
        <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Group.html" target="_blank">See Group API</a>
    )</p>}
        {...GROUP_PROPS_TEMPLATE()}
        {...RESIZABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        GROUP_HTML_TEMPLATE,
        GROUP_CSS_TEMPLATE,
        GROUP_VANILLA_TEMPLATE(GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        GROUP_REACT_TEMPLATE(GROUP_REACT_MARKUP_TEMPLATE, GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        GROUP_ANGULAR_HTML_TEMPLATE(GROUP_ANGULAR_MARKUP_TEMPLATE, GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        GROUP_ANGULAR_COMPONENT_TEMPLATE(GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        GROUP_SVELTE_TEMPLATE(GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        GROUP_SVELTE_JSX_TEMPLATE(GROUP_SVELTE_MARKUP_TEMPLATE, GROUP_RESIZABLE_TEMPLATE_OPTIONS),
        RESIZABLE_FRAME,
    ),
});
