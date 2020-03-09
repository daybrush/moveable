import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent, ANGULAR_PROPS_TEMPLATE
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
import { camelize } from "@daybrush/utils";

export const BASIC_REACT_TEMPLATE = (
    ableName: string,
    props: any,
    frame: any,
    eventName: any,
    startTemplate: any,
    ingTemplate: any,
) => markup => previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), 8)}
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={target}
            ${ableName}={true}
${JSX_PROPS_TEMPLATE(props, 12)}
            on${eventName}Start={${codeIndent(startTemplate(CODE_TYPE.ARROW, "react"), { indent: 12 })}}
            on${eventName}={${codeIndent(ingTemplate(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_SVELTE_TEMPLATE = (
    frame: any,
) => css => previewTemplate`
<script>
    import Moveable from "svelte-moveable";

    const frame = {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), 8)}
    };
    let target;
</script>
<style>
${css}
</style>
`;

export const BASIC_SVELTE_JSX_TEMPLATE = (
    ableName: string,
    props: any,
    eventName: string,
    startTemplate: any,
    ingTemplate: any,
) => markup => previewTemplate`
${markup}
<Moveable
    ${ableName}={true}
    target={target}
${JSX_PROPS_TEMPLATE(props, 4)}
    on:${eventName}Start={${codeIndent(startTemplate(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:${eventName}={${codeIndent(ingTemplate(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;

export const BASIC_DRAGGABLE_SVELTE_TEMPLATE = BASIC_SVELTE_TEMPLATE(DRAGGABLE_FRAME);
export const BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE = BASIC_SVELTE_JSX_TEMPLATE(
    "draggable",
    DRAGGABLE_PROPS,
    "drag",
    DRAG_START_TEMPLATE,
    DRAG_TEMPLATE,
);

export const BASIC_RESIZABLE_SVELTE_TEMPLATE = BASIC_SVELTE_TEMPLATE(RESIZABLE_FRAME);
export const BASIC_RESIZABLE_SVELTE_JSX_TEMPLATE = BASIC_SVELTE_JSX_TEMPLATE(
    "resizable",
    RESIZABLE_PROPS,
    "resize",
    RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE,
);
export const BASIC_SCALABLE_SVELTE_TEMPLATE = BASIC_SVELTE_TEMPLATE(SCALABLE_FRAME);
export const BASIC_SCALABLE_SVELTE_JSX_TEMPLATE = BASIC_SVELTE_JSX_TEMPLATE(
    "scalable",
    SCALABLE_PROPS,
    "scale",
    SCALE_START_TEMPLATE,
    SCALE_TEMPLATE,
);

export const BASIC_ROTATABLE_SVELTE_TEMPLATE = BASIC_SVELTE_TEMPLATE(ROTATABLE_FRAME);
export const BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE = BASIC_SVELTE_JSX_TEMPLATE(
    "rotatable",
    ROTATABLE_PROPS,
    "rotate",
    ROTATE_START_TEMPLATE,
    ROTATE_TEMPLATE,
);

export const BASIC_WARPABLE_SVELTE_TEMPLATE = BASIC_SVELTE_TEMPLATE(WARPABLE_FRAME);
export const BASIC_WARPABLE_SVELTE_JSX_TEMPLATE = BASIC_SVELTE_JSX_TEMPLATE(
    "warpable",
    WARPABLE_PROPS,
    "warp",
    WARP_START_TEMPLATE,
    WARP_TEMPLATE,
);
