import Moveable from "./Moveable";
import Dragger, { DragOptions } from "@daybrush/drag";
import { dragStart, drag, dragEnd } from "./Draggable";
import { pinchStart, pinchEnd, pinch } from "./Pinchable";
import { MoveableProps } from "./types";

export function getDraggableDragger(
    moveable: Moveable,
    target: HTMLElement | SVGElement,
    draggable?: boolean,
    pinchable?: MoveableProps["pinchable"],
) {
    const options: Partial<DragOptions> = {
        container: window,
    };

    if (draggable) {
        options.dragstart = e => dragStart(moveable, e);
        options.drag = e => drag(moveable, e);
        options.dragend = e => dragEnd(moveable, e);
    }
    if (pinchable) {
        options.pinchstart = e => pinchStart(moveable, e);
        options.pinch = e => pinch(moveable, e);
        options.pinchend = e => pinchEnd(moveable, e);
    }
    return new Dragger(target, options);
}
