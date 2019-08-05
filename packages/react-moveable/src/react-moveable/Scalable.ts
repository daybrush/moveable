import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";
import { MIN_SCALE } from "./consts";
import { setDragStart, getDragDist } from "./Dragger";
import { minus } from "./matrix";

export function scaleStart(
    moveable: Moveable, position: number[] | undefined,
    { datas, clientX, clientY, pinchFlag }: any) {
    const target = moveable.props.target;
    if (!position || !target) {
        return false;
    }
    const {
        width,
        height,
        targetTransform,
    } = moveable.state;

    if (!pinchFlag) {
        setDragStart(moveable, { datas });
    }

    datas.datas = {};
    datas.transform = targetTransform;
    datas.prevDist = [1, 1];
    datas.position = position;
    datas.width = width;
    datas.height = height;

    const result = moveable.props.onScaleStart!({
        target,
        clientX,
        clientY,
        datas: datas.datas,
    });
    if (result !== false) {
        moveable.state.isScale = true;
    }
    return result;
}
export function scale(moveable: Moveable, { datas, clientX, clientY, distX, distY, pinchDistance, pinchFlag }: any) {
    const {
        prevDist,
        position,
        width,
        height,
        transform,
    } = datas;

    const { keepRatio, target, throttleScale, onScale } = moveable.props;

    let scaleX: number;
    let scaleY: number;
    if (pinchFlag) {
        scaleX = (width + pinchDistance) / width;
        scaleY = (height + pinchDistance * height / width) / height;
    } else {
        const dist = getDragDist({ datas, distX, distY });
        let distWidth = position[0] * dist[0];
        let distHeight = position[1] * dist[1];

        // diagonal
        if (
            keepRatio
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
        scaleX = nextWidth / width;
        scaleY = nextHeight / height;
    }
    scaleX = throttle(scaleX, throttleScale!);
    scaleY = throttle(scaleY, throttleScale!);

    if (scaleX === 0) {
        scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
    }
    if (scaleY === 0) {
        scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
    }
    const nowScale = [scaleX, scaleY];
    datas.prevDist = nowScale;

    if (scaleX === prevDist[0] && scaleY === prevDist[1]) {
        return;
    }

    onScale!({
        target: target!,
        scale: nowScale,
        dist: [scaleX / prevDist[0], scaleY / prevDist[1]],
        delta: minus(nowScale, prevDist),
        transform: `${transform} scale(${scaleX}, ${scaleY})`,
        clientX,
        clientY,
        datas: datas.datas,
        isPinch: !!pinchFlag,
    });

    !pinchFlag && moveable.updateTarget();
}
export function scaleEnd(moveable: Moveable, { datas, isDrag, clientX, clientY, pinchFlag }: any) {
    moveable.state.isScale = false;
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        isDrag,
        clientX,
        clientY,
        datas: datas.datas,
    });
    if (isDrag && !pinchFlag) {
        moveable.updateRect();
    }
}
