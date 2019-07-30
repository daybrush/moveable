import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { throttleArray } from "./utils";
import { minus } from "./matrix";
import { dragStart, getDragDist } from "./Draggable";

export function getDraggableDragger(
    moveable: Moveable,
    target: HTMLElement | SVGElement,
) {
    return drag(target, {
        container: window,
        dragstart: ({ datas, clientX, clientY }) => {
            const style = window.getComputedStyle(target!);
            const {
                targetTransform,
            } = moveable.state;

            datas.datas = {};
            datas.left = parseFloat(style.left || "") || 0;
            datas.top = parseFloat(style.top || "") || 0;
            datas.bottom = parseFloat(style.bottom || "") || 0;
            datas.right = parseFloat(style.right || "") || 0;
            datas.transform = targetTransform;

            dragStart(moveable, { datas });

            datas.prevDist = [0, 0];
            datas.prevBeforeDist = [0, 0];
            return moveable.props.onDragStart!({
                datas: datas.datas,
                target,
                clientX,
                clientY,
            });
        },
        drag: ({ datas, distX, distY, clientX, clientY }) => {
            const throttleDrag = moveable.props.throttleDrag!;
            const { prevDist, prevBeforeDist, transform } = datas;

            const beforeDist = getDragDist({ datas, distX, distY }, true);
            const dist = getDragDist({ datas, distX, distY }, false);

            throttleArray(dist, throttleDrag);
            throttleArray(beforeDist, throttleDrag);

            const delta = minus(dist, prevDist);
            const beforeDelta = minus(beforeDist, prevBeforeDist);

            datas.prevDist = dist;
            datas.prevBeforeDist = beforeDist;

            const left = datas.left + beforeDist[0];
            const top = datas.top + beforeDist[1];
            const right = datas.right - beforeDist[0];
            const bottom = datas.bottom - beforeDist[1];
            const nextTransform = `${transform} translate(${dist[0]}px, ${dist[1]}px)`;

            if (delta.every(num => !num) && beforeDelta.some(num => !num)) {
                return;
            }
            moveable.props.onDrag!({
                datas: datas.datas,
                target,
                transform: nextTransform,
                dist,
                delta,
                beforeDist,
                beforeDelta,
                left,
                top,
                right,
                bottom,
                clientX,
                clientY,
            });
            moveable.updateTarget();
        },
        dragend: ({ datas, isDrag, clientX, clientY }) => {
            moveable.props.onDragEnd!({
                target,
                isDrag,
                clientX,
                clientY,
                datas: datas.datas,
            });
            if (isDrag) {
                moveable.updateRect();
            }
        },
    });
}
