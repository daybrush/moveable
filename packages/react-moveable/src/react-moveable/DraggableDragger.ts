import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { throttleArray } from "./utils";
import { invert, caculate, ignoreTranslate } from "./matrix";

export function getDraggableDragger(
    moveable: Moveable,
    target: HTMLElement | SVGElement,
) {
    return drag(target, {
        container: window,
        dragstart: ({ datas, clientX, clientY }) => {
            const style = window.getComputedStyle(target!);
            const { matrix, beforeMatrix, is3d} = moveable.state;
            const n = is3d ? 4 : 3;
            datas.is3d = is3d;
            datas.matrix = invert(ignoreTranslate(matrix, n), n);
            datas.beforeMatrix = invert(ignoreTranslate(beforeMatrix, n), n);
            datas.left = parseFloat(style.left || "") || 0;
            datas.top = parseFloat(style.top || "") || 0;
            datas.bottom = parseFloat(style.bottom || "") || 0;
            datas.right = parseFloat(style.right || "") || 0;
            datas.transform = style.transform;
            datas.prevDist = [0, 0];
            datas.prevBeforeDist = [0, 0];

            if (datas.transform === "none") {
                datas.transform = "";
            }
            return moveable.props.onDragStart!({
                target,
                clientX,
                clientY,
            });
        },
        drag: ({ datas, distX, distY, clientX, clientY }) => {
            const throttleDrag = moveable.props.throttleDrag!;
            const { beforeMatrix, matrix, prevDist, prevBeforeDist, is3d } = datas;
            const beforeDist = caculate(beforeMatrix, is3d ? [distX, distY, 0, 1] : [distX, distY, 1], is3d ? 4 : 3);
            const dist = caculate(matrix, is3d ? [distX, distY, 0, 1] : [distX, distY, 1], is3d ? 4 : 3);

            throttleArray(dist, throttleDrag);
            throttleArray(beforeDist, throttleDrag);

            const delta = [dist[0] - prevDist[0], dist[1] - prevDist[1]];
            const beforeDelta = [beforeDist[0] - prevBeforeDist[0], beforeDist[1] - prevBeforeDist[1]];

            datas.prevDist = dist;
            datas.prevBeforeDist = beforeDist;

            const left = datas.left + beforeDist[0];
            const top = datas.top + beforeDist[1];
            const right = datas.right - beforeDist[0];
            const bottom = datas.bottom - beforeDist[1];
            const transform = `${datas.transform} translate(${dist[0]}px, ${dist[1]}px)`;

            if (delta.every(num => !num) && beforeDelta.some(num => !num)) {
                return;
            }
            moveable.props.onDrag!({
                target,
                transform,
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
            if (throttleDrag) {
                moveable.updatePosition();
            } else {
                moveable.setState({
                    transform: `translate(${distX}px, ${distY}px)`,
                });
            }
        },
        dragend: ({ isDrag, clientX, clientY }) => {
            moveable.props.onDragEnd!({
                target,
                isDrag,
                clientX,
                clientY,
            });
            if (isDrag) {
                moveable.updateRect();
            }
        },
    });
}
