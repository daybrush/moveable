import Moveable from "./Moveable";
import Dragger from "@daybrush/drag";
import { prefix, getPosition } from "./utils";
import { hasClass } from "@daybrush/utils";
import { scaleStart, scale, scaleEnd } from "./Scalable";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";
import { resizeStart, resize, resizeEnd } from "./Resizable";
import { warpStart, warp, warpEnd } from "./Warpable";

export function getMoveableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    let type: "rotate" | "scale" | "resize" | "warp" | "";

    return new Dragger(target, {
        container: window,
        dragstart: e => {
            const inputTarget: HTMLElement = e.inputEvent.target;
            const { scalable, resizable, warpable } = moveable.props;
            type = "";
            if (!hasClass(inputTarget, prefix("control"))) {
                return false;
            }
            if (hasClass(inputTarget, prefix("rotation"))) {
                type = "rotate";
                return rotateStart(moveable, e);
            } else {
                const position = getPosition(inputTarget);

                if (scalable) {
                    type = "scale";
                    return scaleStart(moveable, position, e);
                } else if (resizable) {
                    type = "resize";
                    return resizeStart(moveable, position, e);
                } else if (warpable) {
                    type = "warp";
                    return warpStart(moveable, position, e);
                }
            }
            return false;
        },
        drag: e => {
            e.inputEvent.preventDefault();
            e.inputEvent.stopPropagation();

            let result: boolean = false;
            if (!type) {
                return;
            } else if (type === "rotate") {
                result = rotate(moveable, e);
            } else if (type === "scale") {
                result = scale(moveable, e);
            } else if (type === "resize") {
                result = resize(moveable, e);
            } else if (type === "warp") {
                result = warp(moveable, e);
            }
            result && moveable.updateTarget();
            return result;
        },
        dragend: e => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotateEnd(moveable, e);
            } else if (type === "scale") {
                return scaleEnd(moveable, e);
            } else if (type === "resize") {
                return resizeEnd(moveable, e);
            } else if (type === "warp") {
                return warpEnd(moveable, e);
            }
        },
    });
}
