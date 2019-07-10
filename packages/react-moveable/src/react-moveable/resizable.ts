import Moveable from "./Moveable";
import { caculateRotationMatrix, caculatePosition, invert3x2, getSize, caculate3x2, multiple3x2 } from "./utils";

export function resizeStart(moveable: Moveable, positionTarget: Element, { datas }: any) {
    const position = positionTarget.getAttribute("data-position")!;

    if (!position) {
        return false;
    }
    const target = moveable.props.target;
    const style = window.getComputedStyle(target!);
    const {
        matrix, beforeMatrix,
        width: offsetWidth, height: offsetHeight,
        left, top,
        transformOrigin,
        origin,
    } = moveable.state;
    const pos = [0, 0];

    (position.indexOf("w") > -1) && (pos[0] = -1);
    (position.indexOf("e") > -1) && (pos[0] = 1);
    (position.indexOf("n") > -1) && (pos[1] = -1);
    (position.indexOf("s") > -1) && (pos[1] = 1);

    datas.matrix = invert3x2(matrix.slice());
    datas.beforeMatrix = invert3x2(beforeMatrix.slice());
    datas.left = parseFloat(style.left || "") || 0;
    datas.top = parseFloat(style.top || "") || 0;
    datas.bottom = parseFloat(style.bottom || "") || 0;
    datas.right = parseFloat(style.right || "") || 0;
    datas.transform = style.transform;
    datas.prevDist = [0, 0];
    datas.prevBeforeDist = [0, 0];
    datas.direction = moveable.getDirection();
    datas.position = pos;
    [datas.width, datas.height] = getSize(target as HTMLElement, style, false);

    datas.originalMatrix = matrix;
    datas.offsetWidth = offsetWidth;
    datas.offsetHeight = offsetHeight;
    datas.transformOrigin = transformOrigin;
    datas.originalOrigin = origin;
    datas.originalLeft = left;
    datas.originalTop = top;

    if (datas.transform === "none") {
        datas.transform = "";
    }
}
export function resize(moveable: Moveable, { datas, distX, distY }: any) {
    const {
        originalMatrix,
        beforeMatrix, matrix, prevDist, prevBeforeDist,
        position, width, height, offsetWidth, offsetHeight,
        transformOrigin,
        originalLeft,
        originalTop,
        originalOrigin,
    } = datas;
    const beforeDist = caculate3x2(beforeMatrix, [distX, distY, 1]);
    const dist = caculate3x2(matrix, [distX, distY, 1]);

    const delta = [dist[0] - prevDist[0], dist[1] - prevDist[1]];
    const beforeDelta = [beforeDist[0] - prevBeforeDist[0], beforeDist[1] - prevBeforeDist[1]];

    datas.prevDist = dist;
    datas.prevBeforeDist = beforeDist;

    // const left = datas.left + beforeDist[0];
    // const top = datas.left + beforeDist[0];
    // const right = datas.left + beforeDist[0];
    // const bottom = datas.left + beforeDist[0];
    // const transform = `${datas.transform} scale(${dist[0]}, ${dist[1]})`;

    moveable.props.onResize!();

    const nextWidth = width + position[0] * dist[0];
    const nextheight = height;
    const nextOffsetWidth = offsetWidth + position[0] * dist[0];
    const nextScale = nextWidth / width;

    const [origin, pos1, pos2, pos3, pos4] = caculatePosition(
        multiple3x2(originalMatrix.slice(), [nextScale, 0, 0, 1, 0, 0]),
        transformOrigin, offsetWidth, offsetHeight,
    );

    const nextLeft = originalLeft + originalOrigin[0] - origin[0];
    const nextTop = originalTop + originalOrigin[1] - origin[1];
    moveable.props.target!.style.width = `${nextWidth}px`;

    moveable.setState({
        origin, pos1, pos2, pos3, pos4,
        left: nextLeft,
        top: nextTop,
    });
}
