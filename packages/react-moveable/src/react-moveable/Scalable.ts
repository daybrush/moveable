import Moveable from "./Moveable";
import { caculatePosition, invert3x2, getSize, caculate3x2, multiple3x2 } from "./utils";

export function scaleStart(moveable: Moveable, positionTarget: Element, { datas }: any) {
    const position = positionTarget.getAttribute("data-position")!;

    if (!position) {
        return false;
    }
    const target = moveable.props.target;
    const style = window.getComputedStyle(target!);
    const {
        matrix,
        width,
        height,
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
    datas.transform = style.transform;
    datas.prevDist = [1, 1];
    datas.direction = moveable.getDirection();
    datas.position = pos;
    datas.width = width;
    datas.height = height;
    datas.transformOrigin = transformOrigin;

    datas.originalMatrix = matrix;
    datas.originalOrigin = origin;
    datas.left = left;
    datas.top = top;

    if (datas.transform === "none") {
        datas.transform = "";
    }
}
export function scale(moveable: Moveable, { datas, distX, distY }: any) {
    const {
        originalMatrix,
        matrix,
        prevDist,
        position,
        width,
        height,
        left,
        top,
        transformOrigin,
        originalOrigin,
    } = datas;
    const dist = caculate3x2(matrix, [distX, distY, 1]);
    let distWidth = position[0] * dist[0];
    let distHeight = position[1] * dist[1];

    // diagonal
    if (position[0] && position[1]) {
        const distDiagonal = Math.max(Math.abs(distWidth), Math.abs(distHeight));

        distWidth = (distWidth < 0 ? -1 : 1) * distDiagonal;
        distHeight = (distHeight < 0 ? -1 : 1) * distDiagonal * height / width;
    }
    const nextWidth = width + distWidth;
    const nextHeight = height + distHeight;
    const scaleX = nextWidth / width;
    const scaleY = nextHeight / height;
    const [origin, pos1, pos2, pos3, pos4] = caculatePosition(
        multiple3x2(originalMatrix.slice(), [scaleX, 0, 0, scaleY, 0, 0]),
        transformOrigin, width, height,
    );
    const nextLeft = left + originalOrigin[0] - origin[0];
    const nextTop = top + originalOrigin[1] - origin[1];

    datas.prevDist = [scaleX, scaleY];
    moveable.props.onScale!({
        scale: [scaleX, scaleY],
        dist: [scaleX - 1, scaleY - 1],
        delta: [scaleX - prevDist[0], scaleY - prevDist[1]],
        transform: `${datas.transform} scale(${scaleX}, ${scaleY})`,
    });

    moveable.setState({
        origin, pos1, pos2, pos3, pos4,
        left: nextLeft,
        top: nextTop,
    });
}
export function scaleEnd(moveable: Moveable, { isDrag }: any) {
    moveable.props.onScaleEnd!({ isDrag });
    if (isDrag) {
        moveable.updateRect();
    }
}
