import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";
import { MIN_SCALE } from "./consts";
import { dragStart, getDragDist } from "./Draggable";

export function scaleStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;
    if (!position || !target) {
        return false;
    }
    const {
        width,
        height,
        targetTransform,
    } = moveable.state;

    dragStart(moveable, { datas });

    datas.transform = targetTransform;
    datas.prevDist = [1, 1];
    datas.position = position;
    datas.width = width;
    datas.height = height;

    moveable.props.onScaleStart!({
        target,
        clientX,
        clientY,
    });
}
export function scale(moveable: Moveable, { datas, clientX, clientY, distX, distY }: any) {
    const {
        prevDist,
        position,
        width,
        height,
        transform,
    } = datas;

    const dist = getDragDist({ datas, distX, distY });
    let distWidth = position[0] * dist[0];
    let distHeight = position[1] * dist[1];

    // diagonal
    if (
        moveable.props.keepRatio
        && position[0] && position[1]
        && width && height
    ) {
        const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
        const rad = getRad([0, 0], dist);
        const standardRad = getRad([0, 0], position);
        const distDiagonal = Math.cos(rad - standardRad) * size;

        distWidth = distDiagonal;
        distHeight = distDiagonal * height / width;
    }

    const nextWidth = width + distWidth;
    const nextHeight = height + distHeight;
    let scaleX = nextWidth / width;
    let scaleY = nextHeight / height;
    const target = moveable.props.target!;
    const throttleScale = moveable.props.throttleScale!;

    scaleX = throttle(scaleX, throttleScale);
    scaleY = throttle(scaleY, throttleScale);

    if (scaleX === 0) {
        scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
    }
    if (scaleY === 0) {
        scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
    }

    datas.prevDist = [scaleX, scaleY];

    if (scaleX === prevDist[0] && scaleY === prevDist[1]) {
        return;
    }
    moveable.props.onScale!({
        target,
        scale: [scaleX, scaleY],
        dist: [scaleX / prevDist[0], scaleY / prevDist[1]],
        delta: [scaleX - prevDist[0], scaleY - prevDist[1]],
        transform: `${transform} scale(${scaleX}, ${scaleY})`,
        clientX,
        clientY,
    });

    moveable.updateTarget();
}
export function scaleEnd(moveable: Moveable, { isDrag, clientX, clientY }: any) {
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        isDrag,
        clientX,
        clientY,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
