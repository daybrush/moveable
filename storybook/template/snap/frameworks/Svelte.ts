import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent,
} from "storybook-addon-preview";

import { IObject } from "@daybrush/utils";

export const SNAP_SVELTE_TEMPLATE = ({
    frame,
}) => css => previewTemplate`
<script>
    import { onMount } from "svelte";
    import Moveable from "svelte-moveable";

    let frame = {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    };
    let elementGuidelines = [];
    let target;

    onMount(() => {
        elementGuidelines = [
            document.querySelector(".nested.rotate"),
            document.querySelector(".nested.scale"),
            document.querySelector(".nested.first"),
        ];
    });
</script>
<style>
${css}
</style>
`;

export const SNAP_SVELTE_JSX_TEMPLATE = (markup: any, {
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
    elementGuidelines={elementGuidelines}
${JSX_PROPS_TEMPLATE(props)}
${Object.keys(events).map(name => `    on:${name}={${codeIndent(events[name](CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}`).join("\n")}
/>
`;
