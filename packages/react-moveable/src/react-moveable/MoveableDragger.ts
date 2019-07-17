import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { prefix, getPosition } from "./utils";
import { hasClass } from "@daybrush/utils";
import { scaleStart, scale, scaleEnd } from "./Scalable";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";
import { resizeStart, resize, resizeEnd } from "./Resizable";

export function getMoveableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    let type: "rotate" | "scale" | "resize" | "";

    return drag(target, {
        container: window,
        dragstart: ({ datas, inputEvent, clientX, clientY }) => {
            const inputTarget: HTMLElement = inputEvent.target;

            type = "";
            if (!hasClass(inputTarget, prefix("control"))) {
                return false;
            }
            if (hasClass(inputTarget, prefix("rotation"))) {
                type = "rotate";
                return rotateStart(moveable, { datas, clientX, clientY });
            } else if (moveable.props.scalable) {
                const position = getPosition(inputTarget);
                type = "scale";
                return scaleStart(moveable, position, { datas, clientX, clientY });
            } else if (moveable.props.resizable) {
                const position = getPosition(inputTarget);
                type = "resize";
                return resizeStart(moveable, position, { datas, clientX, clientY });
            } else {
                return false;
            }
        },
        drag: ({ datas, clientX, clientY, distX, distY }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotate(moveable, { datas, clientX, clientY });
            } else if (type === "scale") {
                return scale(moveable, { datas, clientX, clientY, distX, distY });
            } else if (type === "resize") {
                return resize(moveable, { datas, clientX, clientY, distX, distY });
            }
        },
        dragend: ({ isDrag, clientX, clientY }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotateEnd(moveable, { isDrag, clientX, clientY });
            } else if (type === "scale") {
                return scaleEnd(moveable, { isDrag, clientX, clientY });
            } else if (type === "resize") {
                return resizeEnd(moveable, { isDrag, clientX, clientY });
            }
        },
    });
}
