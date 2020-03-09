import { previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE } from "storybook-addon-preview";
import {
    DRAG_START_TEMPLATE, DRAG_TEMPLATE, RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE, SCALE_START_TEMPLATE, SCALE_TEMPLATE,
    ROTATE_START_TEMPLATE, ROTATE_TEMPLATE, WARP_TEMPLATE, WARP_START_TEMPLATE,
} from "../events.template";
import { DRAGGABLE_PROPS, DRAGGABLE_FRAME } from "../ables/Draggable.template";
import { RESIZABLE_PROPS, RESIZABLE_FRAME } from "../ables/Resizable.template";
import { SCALABLE_PROPS, SCALABLE_FRAME } from "../ables/Scalable.template";
import { ROTATABLE_FRAME, ROTATABLE_PROPS } from "../ables/Rotatable.template";
import { WARPABLE_PROPS, WARPABLE_FRAME } from "../ables/Warpable.template";

export const BASIC_VANILLA_TEMPLATE = (
    ableName: string,
    props: any[],
    frame: any,
    eventName: any,
    startTemplate: any,
    ingTemplate: any,
) => previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    ${ableName}: true,
${DEFAULT_PROPS_TEMPLATE(props)}
});
const frame = {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame))}
};
moveable.on("${eventName}Start", ${startTemplate(CODE_TYPE.ARROW)}).on("${eventName}", ${ingTemplate(CODE_TYPE.ARROW)});
`;

export const BASIC_DRAGGABLE_VANILLA_TEMPLATE = BASIC_VANILLA_TEMPLATE(
    "draggable",
    DRAGGABLE_PROPS,
    DRAGGABLE_FRAME,
    "drag",
    DRAG_START_TEMPLATE,
    DRAG_TEMPLATE,
);

export const BASIC_RESIZABLE_VANILLA_TEMPLATE = BASIC_VANILLA_TEMPLATE(
    "resizable",
    RESIZABLE_PROPS,
    RESIZABLE_FRAME,
    "resize",
    RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE,
);

export const BASIC_SCALABLE_VANILLA_TEMPLATE = BASIC_VANILLA_TEMPLATE(
    "scalable",
    SCALABLE_PROPS,
    SCALABLE_FRAME,
    "scale",
    SCALE_START_TEMPLATE,
    SCALE_TEMPLATE,
);

export const BASIC_ROTATABLE_VANILLA_TEMPLATE = BASIC_VANILLA_TEMPLATE(
    "rotatable",
    ROTATABLE_PROPS,
    ROTATABLE_FRAME,
    "rotate",
    ROTATE_START_TEMPLATE,
    ROTATE_TEMPLATE,
);

export const BASIC_WARPABLE_VANILLA_TEMPLATE = BASIC_VANILLA_TEMPLATE(
    "warpable",
    WARPABLE_PROPS,
    WARPABLE_FRAME,
    "warp",
    WARP_START_TEMPLATE,
    WARP_TEMPLATE,
);
