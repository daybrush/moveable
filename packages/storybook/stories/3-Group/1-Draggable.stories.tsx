import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, object } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import "../../template/group/group.css";
import { previewCollection } from "../../template/utils";
import DraggableApp, { GROUP_DRAGGABLE_TEMPLATE_OPTIONS } from "../../template/group/ables/Draggable.template";
import { DRAGGABLE_FRAME, DRAGGABLE_PROPS_TEMPLATE } from "../../template/basic/ables/Draggable.template";
import { GROUP_REACT_TEMPLATE } from "../../template/group/frameworks/React";
import {
    GROUP_REACT_MARKUP_TEMPLATE, GROUP_HTML_TEMPLATE, GROUP_CSS_TEMPLATE,
    GROUP_ANGULAR_MARKUP_TEMPLATE, GROUP_SVELTE_MARKUP_TEMPLATE
} from "../../template/group/template";
import { GROUP_VANILLA_TEMPLATE } from "../../template/group/frameworks/Vanilla";
import { GROUP_ANGULAR_HTML_TEMPLATE, GROUP_ANGULAR_COMPONENT_TEMPLATE } from "../../template/group/frameworks/Angular";
import { GROUP_SVELTE_TEMPLATE, GROUP_SVELTE_JSX_TEMPLATE } from "../../template/group/frameworks/Svelte";
import { GROUP_PROPS_TEMPLATE } from "../../template/group/ables/Groupable.template";

const story = storiesOf("Group", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

story.add("Draggable", () => {
    return <DraggableApp
        key={Math.random()}
        description={<p className="description">You can drag the targets. (
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html" target="_blank">See Draggable API</a>, &nbsp;
            <a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Group.html" target="_blank">See Group API</a>
        )</p>}
        {...GROUP_PROPS_TEMPLATE()}
        {...DRAGGABLE_PROPS_TEMPLATE()}
    />;
}, {
    preview: previewCollection(
        GROUP_HTML_TEMPLATE,
        GROUP_CSS_TEMPLATE,
        GROUP_VANILLA_TEMPLATE(GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        GROUP_REACT_TEMPLATE(GROUP_REACT_MARKUP_TEMPLATE, GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        GROUP_ANGULAR_HTML_TEMPLATE(GROUP_ANGULAR_MARKUP_TEMPLATE, GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        GROUP_ANGULAR_COMPONENT_TEMPLATE(GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        GROUP_SVELTE_TEMPLATE(GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        GROUP_SVELTE_JSX_TEMPLATE(GROUP_SVELTE_MARKUP_TEMPLATE, GROUP_DRAGGABLE_TEMPLATE_OPTIONS),
        DRAGGABLE_FRAME,
    ),
});
