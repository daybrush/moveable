import { WARPABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Warpable.template";
import { LAST_EVENT_WARP_END_TEMPLATE, LAST_EVENT_WARP_TEMPLATE } from "../events.template";
import { WARP_START_TEMPLATE } from "../../basic/events.template";

export const LAST_EVENT_WARPABLE_TEMPLATE_OPTIONS = {
    ...WARPABLE_TEMPLATE_OPTIONS,
    events: {
        warpStart: WARP_START_TEMPLATE,
        warp: LAST_EVENT_WARP_TEMPLATE,
        warpEnd: LAST_EVENT_WARP_END_TEMPLATE,
    },
};
