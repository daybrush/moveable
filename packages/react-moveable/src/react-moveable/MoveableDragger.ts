import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { prefix } from "./utils";
import { hasClass } from "@daybrush/utils";
import { scaleStart, scale, scaleEnd } from "./Scalable";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";

export function getMoveableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    let type: "rotate" | "scale" | "";

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
                    type = "scale";
                    return scaleStart(moveable, inputTarget, { datas });
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
            } else if (type === "scale") {
                return scale(moveable, { datas, distX, distY });
            }
        },
        dragend: ({ isDrag }) => {
            if (!type) {
                return;
            } else if (type === "rotate") {
                return rotateEnd(moveable, { isDrag });
            } else if (type === "scale") {
                return scaleEnd(moveable, { isDrag });
            }
        },
    });
}
