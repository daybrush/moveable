import { invert, caculate, minus, plus, convertPositionMatrix, average } from "@moveable/matrix";
import MoveableManager from "./MoveableManager";
import { caculatePoses, getAbsoluteMatrix } from "./utils";
import { splitUnit } from "@daybrush/utils";

export function setDragStart(moveable: MoveableManager<any>, { datas }: any) {
    const {
        matrix,
        beforeMatrix,
        is3d,
        left,
        top,
        origin,
    } = moveable.state;

    const n = is3d ? 4 : 3;

    datas.is3d = is3d;
    datas.matrix = matrix;
    datas.inverseMatrix = invert(matrix, n);
    datas.beforeMatrix = beforeMatrix;
    datas.inverseBeforeMatrix = invert(beforeMatrix, n);
    datas.absoluteOrigin = convertPositionMatrix(plus([left, top], origin), n);
    datas.startDragBeforeDist = caculate(datas.inverseBeforeMatrix, datas.absoluteOrigin, n);
    datas.startDragDist = caculate(datas.inverseMatrix, datas.absoluteOrigin, n);
}
export function getDragDist({ datas, distX, distY }: any, isBefore?: boolean) {
    const {
        inverseBeforeMatrix,
        inverseMatrix, is3d,
        startDragBeforeDist,
        startDragDist, absoluteOrigin,
    } = datas;
    const n = is3d ? 4 : 3;

    return minus(
        caculate(
            isBefore ? inverseBeforeMatrix : inverseMatrix,
            plus(absoluteOrigin, [distX, distY]),
            n,
        ),
        isBefore ? startDragBeforeDist : startDragDist,
    );
}

export function caculateTransformOrigin(
    transformOrigin: string,
    width: number,
    height: number,
    prevWidth: number = width,
    prevHeight: number = height,
    prevOrigin: number[] = [0, 0],
) {

    if (!transformOrigin) {
        return prevOrigin;
    }
    return transformOrigin.split(" ").map((pos, i) => {
        const { value, unit } = splitUnit(pos);

        const prevSize = (i ? prevHeight : prevWidth);
        const size = (i ? height : width);
        if (pos === "%" || isNaN(value)) {
            // no value but %

            const measureRatio = prevSize ? prevOrigin[i] / prevSize : 0;

            return size * measureRatio;
        } else if (unit !== "%") {
            return value;
        }
        return size * value / 100;
    });
}

export function setSizeInfo(moveable: MoveableManager<any>, { datas }: any) {
    const {
        left,
        top,
        pos1,
        pos2,
        pos3,
        pos4,
    } = moveable.state;

    datas.startLeft = left;
    datas.startTop = top;
    datas.startPos1 = pos1;
    datas.startPos2 = pos2;
    datas.startPos3 = pos3;
    datas.startPos4 = pos4;
}

export function getSizeDist(
    moveable: MoveableManager,
    { datas }: any,
    width: number,
    height: number,
    direction: number[],
) {
    const {
        transformOrigin,
    } = moveable.props;
    const {
        transformOrigin: prevOrigin,
        targetMatrix,
        offsetMatrix,
        is3d,
        width: prevWidth,
        height: prevheight,
    } = moveable.state;
    const {
        startLeft,
        startTop,
        startPos1,
        startPos2,
        startPos3,
        startPos4,
    } = datas;
    const n = is3d ? 4 : 3;

    const nextOrigin = caculateTransformOrigin(
        transformOrigin!,
        width,
        height,
        prevWidth,
        prevheight,
        prevOrigin,
    );

    const nextAbsiluteMatrix = getAbsoluteMatrix(targetMatrix, n, nextOrigin);
    const matrix = caculate(
        offsetMatrix,
        nextAbsiluteMatrix,
        n,
    );
    const [
        pos1,
        pos2,
        pos3,
        pos4,
    ] = caculatePoses(matrix, width, height, n);

    /*
    [-1, -1](pos4)       [0, -1](pos3,pos4)       [1, -1](pos3)
    [-1, 0](pos2, pos4)                           [1, 0](pos3, pos1)
    [-1, 1](pos2)        [0, 1](pos1, pos2)       [1, 1](pos1)
    */
    const startPoses: number[][] = [];
    const poses: number[][] = [];

    if (direction[0] >= 0 && direction[1] >= 0) {
        startPoses.push(startPos1);
        poses.push(pos1);
    }
    if (direction[0] <= 0 && direction[1] >= 0) {
        startPoses.push(startPos2);
        poses.push(pos2);
    }
    if (direction[0] >= 0 && direction[1] <= 0) {
        startPoses.push(startPos3);
        poses.push(pos3);
    }
    if (direction[0] <= 0 && direction[1] <= 0) {
        startPoses.push(startPos4);
        poses.push(pos4);
    }

    const distX = startLeft + average(...startPoses.map(pos => pos[0])) - average(...poses.map(pos => pos[0]));
    const distY = startTop + average(...startPoses.map(pos => pos[1])) - average(...poses.map(pos => pos[1]));

    return [distX, distY];
}
