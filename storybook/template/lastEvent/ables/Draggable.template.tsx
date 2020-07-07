import { DRAGGABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Draggable.template";
import { DRAG_START_TEMPLATE } from "../../basic/events.template";
import { LAST_EVENT_DRAG_TEMPLATE, LAST_EVENT_DRAG_END_TEMPLATE } from "../events.template";

export const LAST_EVENT_DRAGGABLE_TEMPLATE_OPTIONS = {
    ...DRAGGABLE_TEMPLATE_OPTIONS,
    events: {
        dragStart: DRAG_START_TEMPLATE,
        drag: LAST_EVENT_DRAG_TEMPLATE,
        dragEnd: LAST_EVENT_DRAG_END_TEMPLATE,
    },
};
