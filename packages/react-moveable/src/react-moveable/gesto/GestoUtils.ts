
import {
    invert, calculate, minus, plus,
    convertPositionMatrix,
    createScaleMatrix, multiply, fromTranslation, convertDimension,
} from "@scena/matrix";
import {
    calculatePoses, getAbsoluteMatrix, getAbsolutePosesByState,
    calculatePosition, calculateInversePosition, getTransform, calculateMoveablePosition,
} from "../utils";
import { splitUnit, isArray, splitSpace, average, findIndex } from "@daybrush/utils";
import {
    MoveableManagerState, ResizableProps, MoveableManagerInterface,
    OnTransformEvent, OnTransformStartEvent, DraggableProps, OnDrag,
} from "../types";
import Draggable from "../ables/Draggable";
import { setCustomDrag } from "./CustomGesto";
import { parse, parseMat } from "css-to-mat";

export function calculatePointerDist(moveable: MoveableManagerInterface, e: any) {
    const { clientX, clientY, datas } = e;
    const {
        moveableClientRect,
        rootMatrix,
        is3d,
        pos1,
    } = moveable.state;
    const { left, top } = moveableClientRect;
    const n = is3d ? 4 : 3;
    const [posX, posY] = minus(calculateInversePosition(rootMatrix, [clientX - left, clientY - top], n), pos1);
    const [distX, distY] = getDragDist({ datas, distX: posX, distY: posY });

    return [distX, distY];
}

export function setDragStart(moveable: MoveableManagerInterface<any>, { datas }: any) {
    const {
        allMatrix,
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
    datas.matrix = allMatrix;
    datas.targetMatrix = targetMatrix;
    datas.beforeMatrix = beforeMatrix;
    datas.offsetMatrix = offsetMatrix;
    datas.transformOrigin = transformOrigin;
    datas.inverseMatrix = invert(allMatrix, n);
    datas.inverseBeforeMatrix = invert(beforeMatrix, n);
    datas.absoluteOrigin = convertPositionMatrix(plus([left, top], origin), n);
    datas.startDragBeforeDist = calculate(datas.inverseBeforeMatrix, datas.absoluteOrigin, n);
    datas.startDragDist = calculate(datas.inverseMatrix, datas.absoluteOrigin, n);
}
export function getTransformDirection(e: any) {
    return calculateMoveablePosition(e.datas.beforeTransform, [50, 50], 100, 100).direction;
}
export function resolveTransformEvent(event: any, functionName: string) {
    const {
        datas,
        originalDatas: {
            beforeRenderable: originalDatas,
        },
    } = event;

    const index = datas.transformIndex;
    const nextTransforms = originalDatas.nextTransforms;
    const nextTransformAppendedIndexes = originalDatas.nextTransformAppendedIndexes;
    const nextIndex = index === -1 ? nextTransforms.length
        : index + nextTransformAppendedIndexes.filter((i: number) => i < index).length;

    const result = getTransform(nextTransforms, nextIndex);
    const targetFunction = result.targetFunction;
    const matFunctionName = functionName === "rotate" ? "rotateZ" : functionName;

    datas.beforeFunctionTexts = result.beforeFunctionTexts;
    datas.afterFunctionTexts = result.afterFunctionTexts;
    datas.beforeTransform = result.beforeFunctionMatrix;
    datas.beforeTransform2 = result.beforeFunctionMatrix2;
    datas.targetTansform = result.targetFunctionMatrix;
    datas.afterTransform = result.afterFunctionMatrix;
    datas.afterTransform2 = result.afterFunctionMatrix2;
    datas.targetAllTransform = result.allFunctionMatrix;

    if (targetFunction.functionName === matFunctionName) {
        datas.afterFunctionTexts.splice(0, 1);
        datas.isAppendTransform = false;
    } else {
        datas.isAppendTransform = true;
        originalDatas.nextTransformAppendedIndexes = [...nextTransformAppendedIndexes, nextIndex];
    }
}

export function convertTransformFormat(datas: any, value: any, dist: any) {
    return `${datas.beforeFunctionTexts.join(" ")} ${datas.isAppendTransform ? dist : value} ${datas.afterFunctionTexts.join(" ")}`;
}
export function getTransformDist({ datas, distX, distY }: any) {
    const [bx, by] = getBeforeDragDist({ datas, distX, distY });
    // B * [tx, ty] * A = [bx, by] * targetMatrix;
    // [tx, ty] = B-1 * [bx, by] * targetMatrix * A-1 * [0, 0];

    const res = getTransfromMatrix(datas, fromTranslation([bx, by], 4));

    return calculate(res, convertPositionMatrix([0, 0, 0], 4), 4);
}
export function getTransfromMatrix(datas: any, targetMatrix: number[], isAfter?: boolean) {
    const {
        beforeTransform,
        afterTransform,
        beforeTransform2,
        afterTransform2,
        targetAllTransform,
    } = datas;

    // B * afterTargetMatrix * A = (targetMatrix * targetAllTransform)
    // afterTargetMatrix = B-1 * targetMatrix * targetAllTransform * A-1
    // nextTargetMatrix = (targetMatrix * targetAllTransform)
    const nextTargetMatrix
        = isAfter
            ? multiply(targetAllTransform, targetMatrix, 4)
            : multiply(targetMatrix, targetAllTransform, 4);

    // res1 = B-1 * nextTargetMatrix
    const res1 = multiply(invert(isAfter ? beforeTransform2 : beforeTransform, 4), nextTargetMatrix, 4);

    // res3 = res2 * A-1
    const afterTargetMatrix = multiply(res1, invert(isAfter ? afterTransform2 : afterTransform, 4), 4);

    return afterTargetMatrix;
}
export function getBeforeDragDist({ datas, distX, distY }: any) {
    // TT = BT
    const {
        inverseBeforeMatrix,
        is3d,
        startDragBeforeDist,
        absoluteOrigin,
    } = datas;
    const n = is3d ? 4 : 3;

    // ABS_ORIGIN * [distX, distY] = BM * (ORIGIN + [tx, ty])
    // BM -1 * ABS_ORIGIN * [distX, distY] - ORIGIN = [tx, ty]
    return minus(
        calculate(
            inverseBeforeMatrix,
            plus(absoluteOrigin, [distX, distY]),
            n,
        ),
        startDragBeforeDist,
    );
}
export function getDragDist({ datas, distX, distY }: any, isBefore?: boolean) {
    const {
        inverseBeforeMatrix,
        inverseMatrix,
        is3d,
        startDragBeforeDist,
        startDragDist,
        absoluteOrigin,
    } = datas;
    const n = is3d ? 4 : 3;

    return minus(
        calculate(
            isBefore ? inverseBeforeMatrix : inverseMatrix,
            plus(absoluteOrigin, [distX, distY]),
            n,
        ),
        isBefore ? startDragBeforeDist : startDragDist,
    );
}
export function getInverseDragDist({ datas, distX, distY }: any, isBefore?: boolean) {
    const {
        beforeMatrix,
        matrix,
        is3d,
        startDragBeforeDist,
        startDragDist,
        absoluteOrigin,
    } = datas;
    const n = is3d ? 4 : 3;

    return minus(
        calculate(
            isBefore ? beforeMatrix : matrix,
            plus(isBefore ? startDragBeforeDist : startDragDist, [distX, distY]),
            n,
        ),
        absoluteOrigin,
    );
}

export function calculateTransformOrigin(
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
export function getPosIndexesByDirection(direction: number[]) {
    const indexes: number[] = [];

    if (direction[1] >= 0) {
        if (direction[0] >= 0) {
            indexes.push(3);
        }
        if (direction[0] <= 0) {
            indexes.push(2);
        }
    }
    if (direction[1] <= 0) {
        if (direction[0] >= 0) {
            indexes.push(1);
        }
        if (direction[0] <= 0) {
            indexes.push(0);
        }
    }
    return indexes;
}
export function getPosesByDirection(
    poses: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
    [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
    [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
    */
    return getPosIndexesByDirection(direction).map(index => poses[index]);
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
        average(nextPoses.map(pos => pos[0])),
        average(nextPoses.map(pos => pos[1])),
    ];
}
export function getPosByReverseDirection(
    poses: number[][],
    direction: number[],
) {
    /*
    [-1, -1](pos4)       [0, -1](pos3,pos4)       [1, -1](pos3)
    [-1, 0](pos2, pos4)                           [1, 0](pos3, pos1)
    [-1, 1](pos2)        [0, 1](pos1, pos2)       [1, 1](pos1)
    */

    return getPosByDirection(poses, direction.map(dir => -dir));
}

function getDist(
    startPos: number[],
    matrix: number[],
    width: number,
    height: number,
    n: number,
    fixedDirection: number[],
) {
    const poses = calculatePoses(matrix, width, height, n);
    const fixedPos = getPosByDirection(poses, fixedDirection);
    const distX = startPos[0] - fixedPos[0];
    const distY = startPos[1] - fixedPos[1];

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
export function getNextTransformMatrix(
    state: MoveableManagerState<any>,
    datas: any,
    transform: string,
) {
    const {
        transformOrigin,
        offsetMatrix,
        is3d,
    } = state;
    const {
        beforeTransform,
        afterTransform,
    } = datas;
    const n = is3d ? 4 : 3;
    const targetTransform = parseMat([transform]);

    return getNextMatrix(
        offsetMatrix,
        convertDimension(multiply(multiply(beforeTransform, targetTransform as any, 4), afterTransform, 4), 4, n),
        transformOrigin,
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

export function fillTransformStartEvent(e: any): OnTransformStartEvent {
    const originalDatas = e.originalDatas.beforeRenderable;
    return {
        setTransform: (transform: string | string[], index = -1) => {
            originalDatas.startTransforms = isArray(transform) ? transform : splitSpace(transform);
            setTransformIndex(e, index);
        },
        setTransformIndex: (index: number) => {
            setTransformIndex(e, index);
        },
    };
}
export function setDefaultTransformIndex(e: any, property: string) {
    const originalDatas = e.originalDatas.beforeRenderable;
    const startTransforms = originalDatas.startTransforms;

    setTransformIndex(e, findIndex<string>(startTransforms, func => func.indexOf(`${property}(`) === 0));
}
export function setTransformIndex(e: any, index: number) {
    const originalDatas = e.originalDatas.beforeRenderable;
    const datas = e.datas;

    datas.transformIndex = index;
    if (index === -1) {
        return;
    }
    const transform = originalDatas.startTransforms[index];

    if (!transform) {
        return;
    }
    const info = parse([transform]);

    datas.startValue = info[0].functionValue;
}
export function fillOriginalTransform(
    e: any,
    transform: string,
) {
    const originalDatas = e.originalDatas.beforeRenderable;

    originalDatas.nextTransforms = splitSpace(transform);
}

export function getNextTransformText(e: any) {
    const {
        originalDatas: {
            beforeRenderable: originalDatas,
        },
    } = e;

    return originalDatas.nextTransforms.join(" ");
}
export function fillTransformEvent(
    moveable: MoveableManagerInterface<DraggableProps>,
    nextTransform: string,
    delta: number[],
    isPinch: boolean,
    e: any,
): OnTransformEvent {
    fillOriginalTransform(e, nextTransform);
    return {
        transform: nextTransform,
        drag: Draggable.drag(
            moveable,
            setCustomDrag(e, moveable.state, delta, isPinch, false),
        ) as OnDrag,
    };
}
export function getTranslateDist(
    moveable: MoveableManagerInterface<any>,
    transform: string,
    fixedDirection: number[],
    fixedPosition: number[],
    datas: any,
) {
    const state = moveable.state;
    const {
        left,
        top,
    } = state;

    const groupable = moveable.props.groupable;
    const nextMatrix = getNextTransformMatrix(moveable.state, datas, transform);
    const groupLeft = groupable ? left : 0;
    const groupTop = groupable ? top : 0;
    const nextFixedPosition = getDirectionOffset(moveable, fixedDirection, nextMatrix);
    const dist = minus(fixedPosition, nextFixedPosition);
    return minus(dist, [groupLeft, groupTop]);
}
export function getScaleDist(
    moveable: MoveableManagerInterface<any>,
    scaleDist: number[],
    fixedDirection: number[],
    fixedPosition: number[],
    datas: any,
) {
    return getTranslateDist(
        moveable,
        `scale(${scaleDist.join(", ")})`,
        fixedDirection,
        fixedPosition,
        datas,
    );
}
export function getOriginDirection(moveable: MoveableManagerInterface<any>) {
    const {
        width,
        height,
        transformOrigin,
    } = moveable.state;
    return [
        -1 + transformOrigin[0] / (width / 2),
        -1 + transformOrigin[1] / (height / 2),
    ];
}
export function getDirectionOffset(
    moveable: MoveableManagerInterface, direction: number[],
    nextMatrix: number[] = moveable.state.allMatrix,
) {
    const {
        width,
        height,
        is3d,
    } = moveable.state;
    const n = is3d ? 4 : 3;
    const nextFixedOffset = [
        width / 2 * (1 + direction[0]),
        height / 2 * (1 + direction[1]),
    ];
    return calculatePosition(nextMatrix, nextFixedOffset, n);
}
export function getRotateDist(
    moveable: MoveableManagerInterface<any>,
    rotateDist: number,
    fixedPosition: number[],
    datas: any,
) {
    const fixedDirection = getOriginDirection(moveable);

    return getTranslateDist(
        moveable,
        `rotate(${rotateDist}deg)`,
        fixedDirection,
        fixedPosition,
        datas,
    );
}
export function getResizeDist(
    moveable: MoveableManagerInterface<any>,
    width: number,
    height: number,
    fixedDirection: number[],
    fixedPosition: number[],
    transformOrigin: string[],
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
        height: prevHeight,
        left,
        top,
    } = moveable.state;

    const n = is3d ? 4 : 3;
    const nextOrigin = calculateTransformOrigin(
        transformOrigin!,
        width,
        height,
        prevWidth,
        prevHeight,
        prevOrigin,
    );
    const groupLeft = groupable ? left : 0;
    const groupTop = groupable ? top : 0;
    const nextMatrix = getNextMatrix(offsetMatrix, targetMatrix, nextOrigin, n);
    const dist = getDist(fixedPosition, nextMatrix, width, height, n, fixedDirection);

    return minus(dist, [groupLeft, groupTop]);
}
export function getAbsolutePosition(
    moveable: MoveableManagerInterface<ResizableProps>,
    direction: number[],
) {
    return getPosByDirection(getAbsolutePosesByState(moveable.state), direction);
}
