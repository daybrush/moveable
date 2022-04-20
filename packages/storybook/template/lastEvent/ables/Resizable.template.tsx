import { LAST_EVENT_RESIZE_END_TEMPLATE, LAST_EVENT_RESIZE_TEMPLATE } from "../events.template";
import { RESIZABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Resizable.template";
import { RESIZE_START_TEMPLATE } from "../../basic/events.template";

export const LAST_EVENT_RESIZABLE_TEMPLATE_OPTIONS = {
    ...RESIZABLE_TEMPLATE_OPTIONS,
    events: {
        resizeStart: RESIZE_START_TEMPLATE,
        resize: LAST_EVENT_RESIZE_TEMPLATE,
        resizeEnd: LAST_EVENT_RESIZE_END_TEMPLATE,
    },
};
