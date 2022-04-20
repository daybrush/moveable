import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent,
} from "storybook-addon-preview";
import { IObject } from "@daybrush/utils";

export const GROUP_SVELTE_TEMPLATE = ({
    frame,
}) => css => previewTemplate`
<script>
    import Moveable from "svelte-moveable";
    import { onMount } from "svelte";

    let frames = [{
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }];
    let targets = [];

    onMount(() => {
        targets = [].slice.call(document.querySelectorAll(".target));
    });
</script>
<style>
${css}
</style>
`;

export const GROUP_SVELTE_JSX_TEMPLATE = (markup: any, {
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
    target={targets}
${JSX_PROPS_TEMPLATE(props)}
${Object.keys(events).map(name => `    on:${name}={${codeIndent(events[name](CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}`).join("\n")}
/>
`;
