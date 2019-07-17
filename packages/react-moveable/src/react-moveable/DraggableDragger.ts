import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { invert3x2, caculate3x2, throttleArray } from "./utils";

export function getDraggableDragger(
    moveable: Moveable,
    target: HTMLElement | SVGElement,
) {
    return drag(target, {
        container: window,
        dragstart: ({ datas }) => {
            const style = window.getComputedStyle(target!);
            const { matrix, beforeMatrix } = moveable.state;

            datas.matrix = invert3x2(matrix.slice());
            datas.beforeMatrix = invert3x2(beforeMatrix.slice());
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
            });
        },
        drag: ({ datas, distX, distY }) => {
            const throttleDrag = moveable.props.throttleDrag!;
            const { beforeMatrix, matrix, prevDist, prevBeforeDist } = datas;
            const beforeDist = caculate3x2(beforeMatrix, [distX, distY, 1]);
            const dist = caculate3x2(matrix, [distX, distY, 1]);

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
            });
            if (throttleDrag) {
                moveable.updatePosition();
            } else {
                moveable.setState({
                    transform: `translate(${distX}px, ${distY}px)`,
                });
            }
        },
        dragend: ({ isDrag }) => {
            moveable.props.onDragEnd!({ target, isDrag });
            if (isDrag) {
                moveable.updateRect();
            }
        },
    });
}
