import { LAST_EVENT_ROTATE_END_TEMPLATE, LAST_EVENT_ROTATE_TEMPLATE } from "../events.template";
import { ROTATABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Rotatable.template";
import { ROTATE_START_TEMPLATE } from "../../basic/events.template";

export const LAST_EVENT_ROTATABLE_TEMPLATE_OPTIONS = {
    ...ROTATABLE_TEMPLATE_OPTIONS,
    events: {
        rotateStart: ROTATE_START_TEMPLATE,
        rotate: LAST_EVENT_ROTATE_TEMPLATE,
        rotateEnd: LAST_EVENT_ROTATE_END_TEMPLATE,
    },
};
