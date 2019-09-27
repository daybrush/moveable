import {
    invert, caculate, minus, plus,
    convertPositionMatrix, average,
    createScaleMatrix, multiply,
} from "@moveable/matrix";
import MoveableManager from "./MoveableManager";
import { caculatePoses, getAbsoluteMatrix, getRect } from "./utils";
import { splitUnit } from "@daybrush/utils";
import { checkSnaps } from "./ables/Snappable";

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

export function getPosByDirection(
    [pos1, pos2, pos3, pos4]: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos4)       [0, -1](pos3,pos4)       [1, -1](pos3)
    [-1, 0](pos2, pos4)                           [1, 0](pos3, pos1)
    [-1, 1](pos2)        [0, 1](pos1, pos2)       [1, 1](pos1)
    */
    const poses = [];

    if (direction[1] >= 0) {
        if (direction[0] >= 0) {
            poses.push(pos1);
        }
        if (direction[0] <= 0) {
            poses.push(pos2);
        }
    }
    if (direction[1] <= 0) {
        if (direction[0] >= 0) {
            poses.push(pos3);
        }
        if (direction[0] <= 0) {
            poses.push(pos4);
        }
    }
    return [
        average(...poses.map(pos => pos[0])),
        average(...poses.map(pos => pos[1])),
    ];
}
function getStartPos(poses: number[][], direction: number[]) {
    const [
        startPos1,
        startPos2,
        startPos3,
        startPos4,
    ] = poses;
    return getPosByDirection([startPos1, startPos2, startPos3, startPos4], direction);
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
    const pos = getPosByDirection(poses, direction);
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
    moveable: MoveableManager<any>,
    width: number,
    height: number,
    direction: number[],
) {
    const {
        is3d,
        matrix,
    } = moveable.state;
    const poses = getSizeInfo(moveable);
    const fixedPos = getPosByDirection(poses, direction);
    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByDirection(nextPoses, direction);

    const dist = minus(fixedPos, nextPos);
    const pos1 = plus(nextPoses[0], dist);
    const pos2 = plus(nextPoses[1], dist);
    const pos3 = plus(nextPoses[2], dist);
    const pos4 = plus(nextPoses[3], dist);
    const rect = getRect([pos1, pos2, pos3, pos4]);
    const next = [width, height];
    // let widthDist = predictDist(pos1, pos2, 400, true);

    const snapInfos = checkSnaps(moveable as any, rect, false);

    if (snapInfos) {
        const {
            dist: horizontalDist,
            offset: horizontalOffset,
        } = snapInfos.horizontal;
        const {
            dist: verticalDist,
            offset: verticalOffset,
        } = snapInfos.vertical;
    }
    // console.log(widthDist);

    // if (!isNaN(widthDist)) {
    //     next[0] += widthDist;
    // }

    return next;
}

export function predictDist(
    pos1: number[],
    pos2: number[],
    snapPos: number,
    isVertical: boolean,
) {
        const sign = snapPos > pos2[isVertical ? 0 : 1] ? 1 : -1;
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];

        if (!dx) {
            // only horizontal
            if (!isVertical) {
                return sign * getSize(0, snapPos - pos2[1]);
            }
            return NaN;
        }
        // y = ax + b
        const a = dy / dx;
        const b = pos1[1] - a * pos1[0];

        if (!dy) {
            // only vertical
            if (isVertical) {
                return sign * Math.abs(snapPos - pos2[0]);
            }
            return NaN;
        }

        if (isVertical) {
            const y = a * snapPos + b;

            return sign * getSize(snapPos - pos2[0], y - pos2[1]);
        } else {
            // x = (y - b) / a
            const x = (snapPos - b) / a;

            return sign * getSize(x - pos2[0], snapPos - pos2[1]);
        }
}
