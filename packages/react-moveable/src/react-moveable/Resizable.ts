import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";
import { setDragStart, getDragDist } from "./Dragger";

export function resizeStart(
    moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY, pinchFlag }: any) {
    const target = moveable.props.target;

    if (!target || !position) {
        return false;
    }
    const { width, height } = moveable.state;

    !pinchFlag && setDragStart(moveable, { datas });

    datas.datas = {};
    datas.position = position;
    datas.width = width;
    datas.height = height;
    datas.prevWidth = 0;
    datas.prevHeight = 0;

    const result = moveable.props.onResizeStart!({
        datas: datas.datas,
        target,
        clientX,
        clientY,
    });

    if (result !== false) {
        moveable.state.isResize = true;
    }
    return result;
}
export function resize(moveable: Moveable, { datas, clientX, clientY, distX, distY, pinchFlag, pinchDistance }: any) {
    const {
        position,
        width,
        height,
        prevWidth,
        prevHeight,
    } = datas;
    const {
        target,
        keepRatio,
        throttleResize,
        onResize,
    } = moveable.props;
    let distWidth: number;
    let distHeight: number;

    // diagonal
    if (pinchFlag) {
        distWidth = pinchDistance;
        distHeight = pinchDistance * height / width;
    } else {
        const dist = getDragDist({ datas, distX, distY });

        distWidth = position[0] * dist[0];
        distHeight = position[1] * dist[1];
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
    }
    distWidth = throttle(distWidth, throttleResize!);
    distHeight = throttle(distHeight, throttleResize!);

    const nextWidth = width + distWidth;
    const nextHeight = height + distHeight;
    const delta = [distWidth - prevWidth, distHeight - prevHeight];

    datas.prevWidth = distWidth;
    datas.prevHeight = distHeight;

    if (delta.every(num => !num)) {
        return;
    }
    onResize!({
        target: target!,
        width: nextWidth,
        height: nextHeight,
        dist: [distWidth, distHeight],
        datas: datas.datas,
        delta,
        clientX,
        clientY,
    });

    !pinchFlag && moveable.updateRect();
}
export function resizeEnd(moveable: Moveable, { datas, isDrag, clientX, clientY, pinchFlag }: any) {
    moveable.state.isResize = false;
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        datas: datas.datas,
        clientX,
        clientY,
        isDrag,
    });
    if (isDrag && !pinchFlag) {
        moveable.updateRect();
    }
}
