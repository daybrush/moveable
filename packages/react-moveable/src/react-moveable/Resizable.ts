import Moveable from "./Moveable";
import { getRad, getSize, throttle } from "./utils";
import { invert, multiply } from "./matrix";

export function resizeStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!target || !position) {
        return false;
    }
    const {
        matrix,
        is3d,
    } = moveable.state;

    const [width, height] = getSize(target!);

    datas.is3d = is3d;
    datas.matrix = invert(matrix, is3d ? 4 : 3);
    datas.position = position;
    datas.width = width;
    datas.height = height;
    datas.prevWidth = 0;
    datas.prevHeight = 0;

    moveable.props.onResizeStart!({
        target,
        clientX,
        clientY,
    });
}
export function resize(moveable: Moveable, { datas, clientX, clientY, distX, distY }: any) {
    const {
        matrix,
        position,
        width,
        height,
        prevWidth,
        prevHeight,
        is3d,
    } = datas;
    const dist = multiply(matrix, is3d ? [distX, distY, 0, 1] : [distX, distY, 1], is3d ? 4 : 3);

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
        delta,
        clientX,
        clientY,
    });

    moveable.updateRect();
}
export function resizeEnd(moveable: Moveable, { isDrag, clientX, clientY }: any) {
    moveable.props.onScaleEnd!({
        target: moveable.props.target!,
        clientX,
        clientY,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
