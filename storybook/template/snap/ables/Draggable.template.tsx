import { DRAGGABLE_TEMPLATE_OPTIONS, DRAGGABLE_PROPS } from "../../basic/ables/Draggable.template";
import { SNAP_PROPS, BOUNDS_PROPS, INNER_BOUNDS_PROPS } from "../../basic/ables/Snappable.template";

export const SNAP_DRAGGABLE_TEMPLATE_OPTIONS = {
    ...DRAGGABLE_TEMPLATE_OPTIONS,
    props: [
        ...SNAP_PROPS,
        ...DRAGGABLE_PROPS,
    ],
};
export const BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS = {
    ...DRAGGABLE_TEMPLATE_OPTIONS,
    props: [
        ...BOUNDS_PROPS,
        ...DRAGGABLE_PROPS,
    ],
};
export const INNER_BOUNDS_DRAGGABLE_TEMPLATE_OPTIONS = {
    ...DRAGGABLE_TEMPLATE_OPTIONS,
    props: [
        ...INNER_BOUNDS_PROPS,
        ...DRAGGABLE_PROPS,
    ],
};
