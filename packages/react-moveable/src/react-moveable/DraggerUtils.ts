import {
    invert, caculate, minus, plus,
    convertPositionMatrix, average,
    createScaleMatrix, multiply,
} from "@moveable/matrix";
import MoveableManager from "./MoveableManager";
import { caculatePoses, getAbsoluteMatrix, getRect } from "./utils";
import { splitUnit } from "@daybrush/utils";
import { hasGuidlines, checkSnapPoses } from "./ables/Snappable";

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
export function getSizeInfo(moveable: MoveableManager<any>) {
    const {
        left,
        top,
        pos1,
        pos2,
        pos3,
        pos4,
    } = moveable.state;
    const pos = [left, top];

    return[
        plus(pos, pos1),
        plus(pos, pos2),
        plus(pos, pos3),
        plus(pos, pos4),
    ];
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
export function getScaleDist(
    moveable: MoveableManager<any>,
    scale: number[],
    direction: number[],
    dragClient?: number[],
) {
    const state = moveable.state;
    const {
        transformOrigin,
        offsetMatrix,
        is3d,
        width,
        height,
        left,
        top,
    } = state;

    const n = is3d ? 4 : 3;
    const groupable = moveable.props.groupable;
    const targetMatrix = state.targetMatrix;

    const nextMatrix = getNextMatrix(
        offsetMatrix,
        multiply(targetMatrix, createScaleMatrix(scale, n), n),
        transformOrigin,
        n,
    );
    const groupLeft = groupable ? left : 0;
    const groupTop = groupable ? top : 0;

    const startPos = dragClient ? dragClient : getStartPos(getSizeInfo(moveable), direction);

    const dist = getDist(
        startPos, nextMatrix, width, height, n,
        direction,
    );

    return minus(dist, [groupLeft, groupTop]);
}

export function getSize(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
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
    const startPos = dragClient ? dragClient : getStartPos(getSizeInfo(moveable), direction);
    const dist = getDist(startPos, nextMatrix, width, height, n, direction);

    return minus(dist, [groupLeft, groupTop]);
}

export function predict(
    moveable: MoveableManager<any, any>,
    width: number,
    height: number,
    direction: number[],
    datas: any,
) {
    const nextSizes = [width, height];
    if (!hasGuidlines(moveable)) {
        return nextSizes;
    }
    const {
        is3d,
        matrix,
    } = moveable.state;
    const poses = getSizeInfo(moveable);
    const fixedPos = getPosByReverseDirection(poses, direction);
    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);

    const dist = minus(fixedPos, nextPos);
    const pos1 = plus(nextPoses[0], dist);
    const pos2 = plus(nextPoses[1], dist);
    const pos3 = plus(nextPoses[2], dist);
    const pos4 = plus(nextPoses[3], dist);

    const directionPoses = getPosesByDirection([pos1, pos2, pos3, pos4], direction);

    if (direction[0] && direction[1]) {
        const snapInfo = checkSnapPoses(
            moveable,
            directionPoses.map(pos => pos[0]),
            directionPoses.map(pos => pos[1]),
        );
        const {
            offset: horizontalOffset,
        } = snapInfo.horizontal;
        const {
            offset: verticalOffset,
        } = snapInfo.vertical;

        // share drag event
        const [widthDist, heightDist] = getDragDist({
            datas,
            distX: verticalOffset,
            distY: horizontalOffset,
        });

        nextSizes[0] -= direction[0] * widthDist;
        nextSizes[1] -= direction[1] * heightDist;
    } else {
        const isDirectionHorizontal = direction[0] !== 0;
        const reverseDirectionPoses = getPosesByDirection([pos4, pos3, pos2, pos1], direction);

        directionPoses.push([
            (directionPoses[0][0] + directionPoses[1][0]) / 2,
            (directionPoses[0][1] + directionPoses[1][1]) / 2,
        ]);
        reverseDirectionPoses.reverse();
        reverseDirectionPoses.push([
            (reverseDirectionPoses[0][0] + reverseDirectionPoses[1][0]) / 2,
            (reverseDirectionPoses[0][1] + reverseDirectionPoses[1][1]) / 2,
        ]);
        directionPoses.some((directionPos, i) => {
            const snapInfos = checkSnapPoses(
                moveable,
                [directionPos[0]],
                [directionPos[1]],
            );
            const {
                isSnap: isHorizontalSnap,
                offset: horizontalOffset,
                dist: horizontalDist,
            } = snapInfos.horizontal;
            const {
                isSnap: isVerticalSnap,
                offset: verticalOffset,
                dist: verticalDist,
            } = snapInfos.vertical;

            if (!isHorizontalSnap && !isVerticalSnap) {
                return false;
            }
            let isVertical!: boolean;

            if (isHorizontalSnap && isVerticalSnap) {
                if (horizontalDist === 0 && reverseDirectionPoses[i][1] === directionPos[1]) {
                    isVertical = true;
                } else if (verticalOffset === 0 && reverseDirectionPoses[i][0] === directionPos[0]) {
                    isVertical = false;
                } else {
                    isVertical = horizontalDist > verticalDist ? true : false;
                }
            } else {
                isVertical = isVerticalSnap;
            }

            const sizeOffset = predictOffset(
                reverseDirectionPoses[i],
                directionPos,
                -(isVertical ? verticalOffset : horizontalOffset),
                isVertical,
            );

            if (isNaN(sizeOffset)) {
                return false;
            }
            nextSizes[isDirectionHorizontal ? 0 : 1] += sizeOffset;
            return true;
        });
    }

    return nextSizes;
}
export function predictOffset(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean,
) {
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];

        const sign = isVertical
            ? ((dx > 0 && snapOffset > 0) || (dx < 0 && snapOffset < 0)) ? 1 : -1
            : ((dy > 0 && snapOffset > 0) || (dy < 0 && snapOffset < 0)) ? 1 : -1;
        if (!dx) {
            // y = 0 * x + b
            // only horizontal
            if (!isVertical) {
                return sign * Math.abs(snapOffset);
            }
            return NaN;
        }
        // y = ax + b
        const a = dy / dx;
        const b = pos1[1] - a * pos1[0];

        if (!dy) {
            // only vertical
            if (isVertical) {
                return sign * Math.abs(snapOffset);
            }
            return NaN;
        }

        if (isVertical) {
            // y = a * x + b
            const y = a * (pos2[0] + snapOffset) + b;

            return sign * getSize(snapOffset, y - pos2[1]);
        } else {
            // x = (y - b) / a
            const x = (pos2[1] + snapOffset - b) / a;


            return sign * getSize(x - pos2[0], snapOffset);
        }
}
