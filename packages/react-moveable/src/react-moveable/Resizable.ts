import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";
import { dragStart, getDragDist } from "./Draggable";

export function resizeStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!target || !position) {
        return false;
    }
    const { width, height } = moveable.state;
    dragStart(moveable, { datas });

    datas.datas = {};
    datas.position = position;
    datas.width = width;
    datas.height = height;
    datas.prevWidth = 0;
    datas.prevHeight = 0;

    moveable.props.onResizeStart!({
        datas: datas.datas,
        target,
        clientX,
        clientY,
    });
}
export function resize(moveable: Moveable, { datas, clientX, clientY, distX, distY }: any) {
    const {
        position,
        width,
        height,
        prevWidth,
        prevHeight,
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

    const throttleResize = moveable.props.throttleResize!;

    distWidth = throttle(distWidth, throttleResize);
    distHeight = throttle(distHeight, throttleResize);

    const nextWidth = width + distWidth;
    const nextHeight = height + distHeight;
    const delta = [distWidth - prevWidth, distHeight - prevHeight];

    datas.prevWidth = distWidth;
    datas.prevHeight = distHeight;

    if (delta.every(num => !num)) {
        return;
    }
    moveable.props.onResize!({
        target: moveable.props.target!,
        width: nextWidth,
        height: nextHeight,
        dist: [distWidth, distHeight],
        datas: datas.datas,
        delta,
        clientX,
        clientY,
    });

    moveable.updateRect();
}
export function resizeEnd(moveable: Moveable, { datas, isDrag, clientX, clientY }: any) {
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        datas: datas.datas,
        clientX,
        clientY,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
