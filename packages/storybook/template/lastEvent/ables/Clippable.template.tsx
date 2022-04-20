import { CLIPPABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Clippable.template";
import { DRAG_START_TEMPLATE, CLIP_TEMPLATE } from "../../basic/events.template";
import { LAST_EVENT_DRAG_TEMPLATE, LAST_EVENT_DRAG_END_TEMPLATE, LAST_EVENT_CLIP_END_TEMPLATE } from "../events.template";
export const LAST_EVENT_CLIPPABLE_TEMPLATE_OPTIONS = {
    ...CLIPPABLE_TEMPLATE_OPTIONS,
    events: {
        dragStart: DRAG_START_TEMPLATE,
        drag: LAST_EVENT_DRAG_TEMPLATE,
        dragEnd: LAST_EVENT_DRAG_END_TEMPLATE,
        clip: CLIP_TEMPLATE,
        clipEnd: LAST_EVENT_CLIP_END_TEMPLATE,
    },
};
