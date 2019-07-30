import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
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

    return drag(target, {
        container: window,
        dragstart: e => {
            const inputTarget: HTMLElement = e.inputEvent.target;

            type = "";
            if (!hasClass(inputTarget, prefix("control"))) {
                return false;
            }
            if (hasClass(inputTarget, prefix("rotation"))) {
                type = "rotate";
                return rotateStart(moveable, e);
            } else if (moveable.props.scalable) {
                const position = getPosition(inputTarget);
                type = "scale";
                return scaleStart(moveable, position, e);
            } else if (moveable.props.resizable) {
                const position = getPosition(inputTarget);
                type = "resize";
                return resizeStart(moveable, position, e);
            } else if (moveable.props.warpable) {
                const position = getPosition(inputTarget);

                type = "warp";
                return warpStart(moveable, position, e);
            } else {
                return false;
            }
        },
        drag: e => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotate(moveable, e);
            } else if (type === "scale") {
                return scale(moveable, e);
            } else if (type === "resize") {
                return resize(moveable, e);
            } else if (type === "warp") {
                return warp(moveable, e);
            }
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
