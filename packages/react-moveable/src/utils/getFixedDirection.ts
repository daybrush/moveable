import { calculatePosition } from "../utils";
import { getDirectionByPos, getPosByDirection } from "../gesto/GestoUtils";


export function getFixedDirectionInfo(
    startPositions: number[][],
    fixedDirection: number[],
) {
    const fixedPosition = getPosByDirection(startPositions, fixedDirection);
    const fixedOffset = [0, 0];

    return {
        fixedPosition,
        fixedDirection,
        fixedOffset,
    };
}

export function getOffsetFixedDirectionInfo(
    state: {
        allMatrix: number[];
        is3d: boolean;
        width: number;
        height: number;
    },
    fixedDirection: number[],
) {
    // for start
    const {
        allMatrix,
        is3d,
        width,
        height,
    } = state;
    const n = is3d ? 4 : 3;
    const nextFixedOffset = [
        width / 2 * (1 + fixedDirection[0]),
        height / 2 * (1 + fixedDirection[1]),
    ];
    const fixedPosition = calculatePosition(allMatrix, nextFixedOffset, n);
    const fixedOffset = [0, 0];

    return {
        fixedPosition,
        fixedDirection,
        fixedOffset,
    };
}


export function getOffsetFixedPositionInfo(
    state: {
        allMatrix: number[];
        is3d: boolean;
        width: number;
        height: number;
    },
    offsetFixedPosition: number[],
) {
    // for start
    const {
        allMatrix,
        is3d,
        width,
        height,
    } = state;
    const n = is3d ? 4 : 3;
    const fixedDirection = getDirectionByPos(offsetFixedPosition, width, height);
    const nextFixedPosition = calculatePosition(allMatrix, offsetFixedPosition, n);
    const fixedOffset = [
        width ? 0 : offsetFixedPosition[0],
        height ? 0 : offsetFixedPosition[1],
    ];

    return {
        fixedPosition: nextFixedPosition,
        fixedDirection,
        fixedOffset,
    };
}
