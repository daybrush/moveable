import Moveable from "./Moveable";
import { caculatePosition, invert3x2, caculate3x2, multiple3x2, getRad } from "./utils";

export function scaleStart(moveable: Moveable, position: number[] | undefined, { datas }: any) {
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

    datas.matrix = invert3x2(matrix.slice());
    datas.transform = style.transform;
    datas.prevDist = [1, 1];
    datas.position = position;
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
        transform,
    } = datas;
    const dist = caculate3x2(matrix, [distX, distY, 1]);
    let distWidth = position[0] * dist[0];
    let distHeight = position[1] * dist[1];

    // diagonal
    if (position[0] && position[1]) {
        const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
        const rad = getRad([0, 0], dist);
        const standardRad = getRad([0, 0], position);
        const distDiagonal = Math.cos(rad - standardRad) * size;

        distWidth = distDiagonal;
        distHeight = distDiagonal * height / width;
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
        transform: `${transform} scale(${scaleX}, ${scaleY})`,
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
