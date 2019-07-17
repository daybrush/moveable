import Moveable from "./Moveable";
import { invert3x2, caculate3x2, getRad, throttle } from "./utils";
import { MIN_SCALE } from "./consts";

export function scaleStart(moveable: Moveable, position: number[] | undefined, { datas }: any) {
    const target = moveable.props.target;
    if (!position || !target) {
        return false;
    }
    const style = window.getComputedStyle(target);
    const {
        matrix,
        beforeMatrix,
        width,
        height,
        left, top,
        transformOrigin,
        origin,
    } = moveable.state;

    datas.matrix = invert3x2(matrix.slice());
    datas.beforeMatrix = beforeMatrix;
    datas.transform = style.transform;
    datas.prevDist = [1, 1];
    datas.position = position;
    datas.width = width;
    datas.height = height;
    datas.transformOrigin = transformOrigin;
    datas.originalOrigin = origin;
    datas.left = left;
    datas.top = top;

    if (datas.transform === "none") {
        datas.transform = "";
    }

    moveable.props.onScaleStart!({
        target,
    });
}
export function scale(moveable: Moveable, { datas, distX, distY }: any) {
    const {
        matrix,
        beforeMatrix,
        prevDist,
        position,
        width,
        height,
        left,
        top,
        transformOrigin,
        originalOrigin,
        transform,
    } = datas;
    const dist = caculate3x2(matrix, [distX, distY, 1]);
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
    const target = moveable.props.target!
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
    });

    moveable.updateTargetRect(target, {
        beforeMatrix,
        transformOrigin,
        origin: originalOrigin,
        width,
        height,
        left,
        top,
    })
}
export function scaleEnd(moveable: Moveable, { isDrag }: any) {
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
