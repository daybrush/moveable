import { SCALABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Scalable.template";
import { LAST_EVENT_SCALE_TEMPLATE, LAST_EVENT_SCALE_END_TEMPLATE } from "../events.template";
import { SCALE_START_TEMPLATE } from "../../basic/events.template";

export const LAST_EVENT_SCALABLE_TEMPLATE_OPTIONS = {
    ...SCALABLE_TEMPLATE_OPTIONS,
    events: {
        scaleStart: SCALE_START_TEMPLATE,
        scale: LAST_EVENT_SCALE_TEMPLATE,
        scaleEnd: LAST_EVENT_SCALE_END_TEMPLATE,
    },
};
