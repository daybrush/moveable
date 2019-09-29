import {
    invert, caculate, minus, plus,
    convertPositionMatrix, average,
    createScaleMatrix, multiply,
} from "@moveable/matrix";
import MoveableManager from "./MoveableManager";
import { caculatePoses, getAbsoluteMatrix, getAbsolutePosesByState } from "./utils";
import { splitUnit } from "@daybrush/utils";
import { MoveableManagerState } from "./types";

export function setDragStart(moveable: MoveableManager<any>, { datas }: any) {
    const {
        matrix,
        beforeMatrix,
        is3d,
        left,
        top,
        origin,
        offsetMatrix,
        targetMatrix,
        transformOrigin,
    } = moveable.state;
    const n = is3d ? 4 : 3;

    datas.is3d = is3d;
    datas.matrix = matrix;
    datas.targetMatrix = targetMatrix;
    datas.beforeMatrix = beforeMatrix;
    datas.offsetMatrix = offsetMatrix;
    datas.transformOrigin = transformOrigin;
    datas.inverseMatrix = invert(matrix, n);
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
        startDragDist,
        absoluteOrigin,
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
    transformOrigin: string[],
    width: number,
    height: number,
    prevWidth: number = width,
    prevHeight: number = height,
    prevOrigin: number[] = [0, 0],
) {

    if (!transformOrigin) {
        return prevOrigin;
    }
    return transformOrigin.map((pos, i) => {
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
export function getPosesByDirection(
    [pos1, pos2, pos3, pos4]: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
    [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
    [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
    */
   const poses = [];

   if (direction[1] >= 0) {
       if (direction[0] >= 0) {
           poses.push(pos4);
       }
       if (direction[0] <= 0) {
           poses.push(pos3);
       }
   }
   if (direction[1] <= 0) {
       if (direction[0] >= 0) {
           poses.push(pos2);
       }
       if (direction[0] <= 0) {
           poses.push(pos1);
       }
   }
   return poses;
}
export function getPosByDirection(
    poses: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
    [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
    [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
    */
   const nextPoses = getPosesByDirection(poses, direction);

   return [
       average(...nextPoses.map(pos => pos[0])),
       average(...nextPoses.map(pos => pos[1])),
   ];
}
export function getPosByReverseDirection(
    [pos1, pos2, pos3, pos4]: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos4)       [0, -1](pos3,pos4)       [1, -1](pos3)
    [-1, 0](pos2, pos4)                           [1, 0](pos3, pos1)
    [-1, 1](pos2)        [0, 1](pos1, pos2)       [1, 1](pos1)
    */

    return getPosByDirection([pos4, pos3, pos2, pos1], direction);
}
function getStartPos(poses: number[][], direction: number[]) {
    const [
        startPos1,
        startPos2,
        startPos3,
        startPos4,
    ] = poses;
    return getPosByReverseDirection([startPos1, startPos2, startPos3, startPos4], direction);
}
function getDist(
    startPos: number[],
    matrix: number[],
    width: number,
    height: number,
    n: number,
    direction: number[],
) {
    const poses = caculatePoses(matrix, width, height, n);
    const pos = getPosByReverseDirection(poses, direction);
    const distX = startPos[0] - pos[0];
    const distY = startPos[1] - pos[1];

    return [distX, distY];
}
export function getNextMatrix(
    offsetMatrix: number[],
    targetMatrix: number[],
    origin: number[],
    n: number,
) {
    return multiply(
        offsetMatrix,
        getAbsoluteMatrix(targetMatrix, n, origin),
        n,
    );
}
export function scaleMatrix(
    state: MoveableManagerState<any>,
    scale: number[],
) {
    const {
        transformOrigin,
        offsetMatrix,
        is3d,
        targetMatrix,
    } = state;
    const n = is3d ? 4 : 3;

    return getNextMatrix(
        offsetMatrix,
        multiply(targetMatrix, createScaleMatrix(scale, n), n),
        transformOrigin,
        n,
    );
}
export function getScaleDist(
    moveable: MoveableManager<any>,
    scale: number[],
    direction: number[],
    dragClient?: number[],
) {
    const state = moveable.state;
    const {
        is3d,
        left,
        top,
        width,
        height,
    } = state;

    const n = is3d ? 4 : 3;
    const groupable = moveable.props.groupable;
    const nextMatrix = scaleMatrix(moveable.state, scale);
    const groupLeft = groupable ? left : 0;
    const groupTop = groupable ? top : 0;

    const startPos = dragClient ? dragClient : getStartPos(getAbsolutePosesByState(moveable.state), direction);

    const dist = getDist(
        startPos, nextMatrix, width, height, n,
        direction,
    );

    return minus(dist, [groupLeft, groupTop]);
}

export function getResizeDist(
    moveable: MoveableManager<any>,
    width: number,
    height: number,
    direction: number[],
    transformOrigin: string[],
    dragClient?: number[],
) {
    const {
        groupable,
    } = moveable.props;
    const {
        transformOrigin: prevOrigin,
        targetMatrix,
        offsetMatrix,
        is3d,
        width: prevWidth,
        height: prevheight,
        left,
        top,
    } = moveable.state;

    const n = is3d ? 4 : 3;
    const nextOrigin = caculateTransformOrigin(
        transformOrigin!,
        width,
        height,
        prevWidth,
        prevheight,
        prevOrigin,
    );
    const groupLeft = groupable ? left : 0;
    const groupTop = groupable ? top : 0;
    const nextMatrix = getNextMatrix(offsetMatrix, targetMatrix, nextOrigin, n);
    const startPos = dragClient ? dragClient : getStartPos(getAbsolutePosesByState(moveable.state), direction);
    const dist = getDist(startPos, nextMatrix, width, height, n, direction);

    return minus(dist, [groupLeft, groupTop]);
}
