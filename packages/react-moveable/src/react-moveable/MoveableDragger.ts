import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { invert3x2, caculate3x2, prefix } from "./utils";
import { hasClass } from "@daybrush/utils";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";
import { resizeStart, resize } from "./resizable";

export function getMoveableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    let type: "rotate" | "resize" | "" = "";

    return drag(target, {
        container: window,
        dragstart: ({ datas, inputEvent, clientX, clientY }) => {
            const inputTarget: HTMLElement = inputEvent.target;

            type = "";
            if (hasClass(inputTarget, prefix("control"))) {
                if (hasClass(inputTarget, prefix("rotation"))) {
                    type = "rotate";
                    return rotateStart(moveable, { datas, clientX, clientY });
                } else {
                    type = "resize";
                    return resizeStart(moveable, inputTarget, { datas });
                }
            } else {
                return false;
            }
        },
        drag: ({ datas, clientX, clientY, distX, distY }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotate(moveable, { datas, clientX, clientY });
            } else if (type === "resize") {
                return resize(moveable, { datas, distX, distY });
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
