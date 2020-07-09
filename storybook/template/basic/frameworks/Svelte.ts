import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent,
} from "storybook-addon-preview";
import {
    DRAG_START_TEMPLATE, DRAG_TEMPLATE, RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE, SCALE_START_TEMPLATE, SCALE_TEMPLATE,
    ROTATE_START_TEMPLATE, ROTATE_TEMPLATE, WARP_TEMPLATE, WARP_START_TEMPLATE,
} from "../events.template";
import { DRAGGABLE_PROPS, DRAGGABLE_FRAME } from "../ables/Draggable.template";
import { RESIZABLE_PROPS, RESIZABLE_FRAME } from "../ables/Resizable.template";
import { SCALABLE_PROPS, SCALABLE_FRAME } from "../ables/Scalable.template";
import { ROTATABLE_PROPS, ROTATABLE_FRAME } from "../ables/Rotatable.template";
import { WARPABLE_PROPS, WARPABLE_FRAME } from "../ables/Warpable.template";
import { IObject } from "@daybrush/utils";

export const BASIC_SVELTE_TEMPLATE = ({
    frame,
}) => css => previewTemplate`
<script>
    import Moveable from "svelte-moveable";

    let frame = {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    };
    let target;
</script>
<style>
${css}
</style>
`;

export const BASIC_SVELTE_JSX_TEMPLATE = (markup: any, {
    ableName,
    props,
    frame,
    events,
}: {
    ableName: string,
    props: any[],
    frame: any,
    events: IObject<any>,
}) => previewTemplate`
${markup}
<Moveable
    target={target}
${JSX_PROPS_TEMPLATE(props)}
${Object.keys(events).map(name => `    on:${name}={${codeIndent(events[name](CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}`).join("\n")}
/>
`;
