import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { invert3x2, caculate3x2, prefix } from "./utils";
import { hasClass } from "@daybrush/utils";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";

export function getMoveableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    let type: "rotate" | "resize" | "" = "";

    return drag(target, {
        container: window,
        dragstart: ({ datas, inputEvent, clientX, clientY }) => {
            const target: HTMLElement = inputEvent.target;

            type = "";
            if (hasClass(target, prefix("control"))) {
                if (hasClass(target, prefix("rotation"))) {
                    type = "rotate";
                    return rotateStart(moveable, { datas, clientX, clientY });
                } else {
                    type = "resize";
                    // return resizeStart
                }
            } else {
                return false;
            }
        },
        drag: ({ datas, clientX, clientY }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotate(moveable, { datas, clientX, clientY });
            }
        },
        dragend: ({ isDrag }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotateEnd(moveable, { isDrag });
            }
        },
    });
}
