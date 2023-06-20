import { getDist, getRad, IObject, TINY_NUM } from "@daybrush/utils";
import { minus } from "@scena/matrix";
import { abs, getAbsolutePoses, getDistSize, getRect, maxOffset } from "../../utils";
import { getDragDist, getPosByDirection } from "../../gesto/GestoUtils";
import {
    BoundInfo, SnapInfo, MoveableManagerInterface, SnappableProps,
    SnappableState, SnapBoundInfo, SnapGuideline, BoundType, SnapOffsetInfo, DraggableProps,
} from "../../types";
import { checkBoundKeepRatio, checkBoundPoses, getBounds } from "./bounds";
import { getInnerBoundDragInfo } from "./innerBounds";
import {
    getNearestSnapGuidelineInfo, checkMoveableSnapPoses,
    checkSnapPoses, checkSnapKeepRatio,
} from "./snap";
import { hasGuidelines, getSnapDirections, splitSnapDirectionPoses } from "./utils";

interface DirectionSnapType<T> {
    vertical: T;
    horizontal: T;
}

export function solveEquation(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean
) {
    let dx = pos2[0] - pos1[0];
    let dy = pos2[1] - pos1[1];

    if (abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (abs(dy) < TINY_NUM) {
        dy = 0;
    }
    if (!dx) {
        // y = 0 * x + b
        // only horizontal
        if (!isVertical) {
            return [0, snapOffset];
        }
        return [0, 0];
    }
    if (!dy) {
        // only vertical
        if (isVertical) {
            return [snapOffset, 0];
        }
        return [0, 0];
    }
    // y = ax + b
    const a = dy / dx;
    const b = pos1[1] - a * pos1[0];

    if (isVertical) {
        // y = a * x + b
        const y = a * (pos2[0] + snapOffset) + b;

        return [snapOffset, y - pos2[1]];
    } else {
        // x = (y - b) / a
        const x = (pos2[1] + snapOffset - b) / a;

        return [x - pos2[0], snapOffset];
    }
}


function solveNextOffset(
    pos1: number[],
    pos2: number[],
    offset: number,
    isVertical: boolean,
    datas: IObject<any>
) {
    const sizeOffset = solveEquation(pos1, pos2, offset, isVertical);

    if (!sizeOffset) {
        return {
            isOutside: false,
            offset: [0, 0],
        };
    }
    const size = getDist(pos1, pos2);
    const dist1 = getDist(sizeOffset, pos1);
    const dist2 = getDist(sizeOffset, pos2);

    const isOutside = dist1 > size || dist2 > size;
    const [widthOffset, heightOffset] = getDragDist({
        datas,
        distX: sizeOffset[0],
        distY: sizeOffset[1],
    });

    return {
        offset: [widthOffset, heightOffset],
        isOutside,
    };
}

function getSnapBound(boundInfo: BoundInfo, snapInfo: SnapInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return getNearestSnapGuidelineInfo(snapInfo).offset;
    }
    return 0;
}


export function checkThrottleDragRotate(
    throttleDragRotate: number,
    [distX, distY]: number[],
    [isVerticalBound, isHorizontalBound]: boolean[],
    [isVerticalSnap, isHorizontalSnap]: boolean[],
    [verticalOffset, horizontalOffset]: number[]
) {
    let offsetX = -verticalOffset;
    let offsetY = -horizontalOffset;

    if (throttleDragRotate && distX && distY) {
        offsetX = 0;
        offsetY = 0;
        const adjustPoses: number[][] = [];
        if (isVerticalBound && isHorizontalBound) {
            adjustPoses.push([0, horizontalOffset], [verticalOffset, 0]);
        } else if (isVerticalBound) {
            adjustPoses.push([verticalOffset, 0]);
        } else if (isHorizontalBound) {
            adjustPoses.push([0, horizontalOffset]);
        } else if (isVerticalSnap && isHorizontalSnap) {
            adjustPoses.push([0, horizontalOffset], [verticalOffset, 0]);
        } else if (isVerticalSnap) {
            adjustPoses.push([verticalOffset, 0]);
        } else if (isHorizontalSnap) {
            adjustPoses.push([0, horizontalOffset]);
        }
        if (adjustPoses.length) {
            adjustPoses.sort((a, b) => {
                return (
                    getDistSize(minus([distX, distY], a)) -
                    getDistSize(minus([distX, distY], b))
                );
            });
            const adjustPos = adjustPoses[0];

            if (adjustPos[0] && abs(distX) > TINY_NUM) {
                offsetX = -adjustPos[0];
                offsetY =
                    (distY * abs(distX + offsetX)) / abs(distX) -
                    distY;
            } else if (adjustPos[1] && abs(distY) > TINY_NUM) {
                const prevDistY = distY;
                offsetY = -adjustPos[1];
                offsetX =
                    (distX * abs(distY + offsetY)) / abs(prevDistY) -
                    distX;
            }
            if (throttleDragRotate && isHorizontalBound && isVerticalBound) {
                if (
                    abs(offsetX) > TINY_NUM &&
                    abs(offsetX) < abs(verticalOffset)
                ) {
                    const scale = abs(verticalOffset) / abs(offsetX);

                    offsetX *= scale;
                    offsetY *= scale;
                } else if (
                    abs(offsetY) > TINY_NUM &&
                    abs(offsetY) < abs(horizontalOffset)
                ) {
                    const scale =
                        abs(horizontalOffset) / abs(offsetY);

                    offsetX *= scale;
                    offsetY *= scale;
                } else {
                    offsetX = maxOffset(-verticalOffset, offsetX);
                    offsetY = maxOffset(-horizontalOffset, offsetY);
                }
            }
        }
    } else {
        offsetX = distX || isVerticalBound ? -verticalOffset : 0;
        offsetY = distY || isHorizontalBound ? -horizontalOffset : 0;
    }
    return [offsetX, offsetY];
}

export function checkSnapBoundsDrag(
    moveable: MoveableManagerInterface<SnappableProps & DraggableProps, any>,
    distX: number,
    distY: number,
    throttleDragRotate: number,
    ignoreSnap: boolean,
    datas: any
) {
    if (!hasGuidelines(moveable, "draggable")) {
        return [
            {
                isSnap: false,
                isBound: false,
                offset: 0,
            },
            {
                isSnap: false,
                isBound: false,
                offset: 0,
            },
        ];
    }
    const poses = getAbsolutePoses(datas.absolutePoses, [distX, distY]);
    const { left, right, top, bottom } = getRect(poses);
    const boundPoses = {
        horizontal: poses.map((pos) => pos[1]),
        vertical: poses.map((pos) => pos[0]),
    };
    const snapDirections = getSnapDirections(moveable.props.snapDirections);
    const snapPoses = splitSnapDirectionPoses(snapDirections, {
        left,
        right,
        top,
        bottom,
        center: (left + right) / 2,
        middle: (top + bottom) / 2,
    });
    const {
        vertical: verticalSnapBoundInfo,
        horizontal: horizontalSnapBoundInfo,
    } = checkMoveableSnapBounds(moveable, ignoreSnap, snapPoses, boundPoses);
    const {
        vertical: verticalInnerBoundInfo,
        horizontal: horizontalInnerBoundInfo,
    } = getInnerBoundDragInfo(moveable, poses, datas);

    const isVerticalSnap = verticalSnapBoundInfo.isSnap;
    const isHorizontalSnap = horizontalSnapBoundInfo.isSnap;
    const isVerticalBound =
        verticalSnapBoundInfo.isBound || verticalInnerBoundInfo.isBound;
    const isHorizontalBound =
        horizontalSnapBoundInfo.isBound || horizontalInnerBoundInfo.isBound;
    const verticalOffset = maxOffset(
        verticalSnapBoundInfo.offset,
        verticalInnerBoundInfo.offset
    );
    const horizontalOffset = maxOffset(
        horizontalSnapBoundInfo.offset,
        horizontalInnerBoundInfo.offset
    );

    const [offsetX, offsetY] = checkThrottleDragRotate(
        throttleDragRotate,
        [distX, distY],
        [isVerticalBound, isHorizontalBound],
        [isVerticalSnap, isHorizontalSnap],
        [verticalOffset, horizontalOffset]
    );

    return [
        {
            isBound: isVerticalBound,
            isSnap: isVerticalSnap,
            offset: offsetX,
        },
        {
            isBound: isHorizontalBound,
            isSnap: isHorizontalSnap,
            offset: offsetY,
        },
    ];
}

export function checkMoveableSnapBounds(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    ignoreSnap: boolean,
    poses: { vertical: number[]; horizontal: number[]; },
    boundPoses: { vertical: number[]; horizontal: number[]; } = poses,
): DirectionSnapType<Required<SnapBoundInfo>> {
    const {
        horizontal: horizontalBoundInfos,
        vertical: verticalBoundInfos,
    } = checkBoundPoses(
        getBounds(moveable),
        boundPoses.vertical,
        boundPoses.horizontal,
    );
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = ignoreSnap ? {
        horizontal: { isSnap: false, index: -1 } as SnapInfo,
        vertical: { isSnap: false, index: -1 } as SnapInfo,
    } : checkMoveableSnapPoses(
        moveable,
        poses.vertical,
        poses.horizontal,
    );
    const horizontalOffset = getSnapBound(
        horizontalBoundInfos[0],
        horizontalSnapInfo
    );
    const verticalOffset = getSnapBound(
        verticalBoundInfos[0],
        verticalSnapInfo
    );

    const horizontalDist = abs(horizontalOffset);
    const verticalDist = abs(verticalOffset);

    return {
        horizontal: {
            isBound: horizontalBoundInfos[0].isBound,
            isSnap: horizontalSnapInfo.isSnap,
            snapIndex: horizontalSnapInfo.index,
            offset: horizontalOffset,
            dist: horizontalDist,
            bounds: horizontalBoundInfos,
            snap: horizontalSnapInfo,
        },
        vertical: {
            isBound: verticalBoundInfos[0].isBound,
            isSnap: verticalSnapInfo.isSnap,
            snapIndex: verticalSnapInfo.index,
            offset: verticalOffset,
            dist: verticalDist,
            bounds: verticalBoundInfos,
            snap: verticalSnapInfo,
        },
    };
}
export function checkSnapBounds(
    guideines: SnapGuideline[],
    bounds: BoundType | undefined | false,
    posesX: number[],
    posesY: number[],
    snapThreshold: number,
): DirectionSnapType<Required<SnapBoundInfo>> {
    const {
        horizontal: horizontalBoundInfos,
        vertical: verticalBoundInfos,
    } = checkBoundPoses(bounds, posesX, posesY);

    // options.isRequest ? {
    //     horizontal: { isSnap: false, index: -1 } as SnapInfo,
    //     vertical: { isSnap: false, index: -1 } as SnapInfo,
    // } :
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = checkSnapPoses(guideines, posesX, posesY, snapThreshold);

    const horizontalOffset = getSnapBound(
        horizontalBoundInfos[0],
        horizontalSnapInfo
    );
    const verticalOffset = getSnapBound(
        verticalBoundInfos[0],
        verticalSnapInfo
    );

    const horizontalDist = abs(horizontalOffset);
    const verticalDist = abs(verticalOffset);

    return {
        horizontal: {
            isBound: horizontalBoundInfos[0].isBound,
            isSnap: horizontalSnapInfo.isSnap,
            snapIndex: horizontalSnapInfo.index,
            offset: horizontalOffset,
            dist: horizontalDist,
            bounds: horizontalBoundInfos,
            snap: horizontalSnapInfo,
        },
        vertical: {
            isBound: verticalBoundInfos[0].isBound,
            isSnap: verticalSnapInfo.isSnap,
            snapIndex: verticalSnapInfo.index,
            offset: verticalOffset,
            dist: verticalDist,
            bounds: verticalBoundInfos,
            snap: verticalSnapInfo,
        },
    };
}


function checkSnapRightLine(
    startPos: number[],
    endPos: number[],
    snapBoundInfo: { vertical: SnapBoundInfo; horizontal: SnapBoundInfo },
    keepRatio: boolean
) {
    const rad = (getRad(startPos, endPos) / Math.PI) * 180;
    const {
        vertical: {
            isBound: isVerticalBound,
            isSnap: isVerticalSnap,
            dist: verticalDist,
        },
        horizontal: {
            isBound: isHorizontalBound,
            isSnap: isHorizontalSnap,
            dist: horizontalDist,
        },
    } = snapBoundInfo;

    const rad180 = rad % 180;
    const isHorizontalLine = rad180 < 3 || rad180 > 177;
    const isVerticalLine = rad180 > 87 && rad180 < 93;

    if (horizontalDist < verticalDist) {
        if (
            isVerticalBound ||
            (isVerticalSnap &&
                !isVerticalLine &&
                (!keepRatio || !isHorizontalLine))
        ) {
            return "vertical";
        }
    }
    if (
        isHorizontalBound ||
        (isHorizontalSnap &&
            !isHorizontalLine &&
            (!keepRatio || !isVerticalLine))
    ) {
        return "horizontal";
    }
    return "";
}


export function getSnapBoundInfo(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    poses: number[][],
    directions: number[][][],
    keepRatio: boolean,
    isRequest: boolean,
    datas: any
) {
    return directions.map(([startDirection, endDirection]) => {
        const otherStartPos = getPosByDirection(poses, startDirection);
        const otherEndPos = getPosByDirection(poses, endDirection);
        const snapBoundInfo = keepRatio
            ? checkSnapBoundsKeepRatio(
                moveable,
                otherStartPos,
                otherEndPos,
                isRequest
            )
            : checkMoveableSnapBounds(moveable, isRequest, {
                vertical: [otherEndPos[0]],
                horizontal: [otherEndPos[1]],
            });

        const {
            horizontal: {
                // dist: otherHorizontalDist,
                offset: otherHorizontalOffset,
                isBound: isOtherHorizontalBound,
                isSnap: isOtherHorizontalSnap,
            },
            vertical: {
                // dist: otherVerticalDist,
                offset: otherVerticalOffset,
                isBound: isOtherVerticalBound,
                isSnap: isOtherVerticalSnap,
            },
        } = snapBoundInfo;

        const multiple = minus(endDirection, startDirection);

        if (!otherVerticalOffset && !otherHorizontalOffset) {
            return {
                isBound: isOtherVerticalBound || isOtherHorizontalBound,
                isSnap: isOtherVerticalSnap || isOtherHorizontalSnap,
                sign: multiple,
                offset: [0, 0],
            };
        }
        const snapLine = checkSnapRightLine(
            otherStartPos,
            otherEndPos,
            snapBoundInfo,
            keepRatio
        );

        if (!snapLine) {
            return {
                sign: multiple,
                isBound: false,
                isSnap: false,
                offset: [0, 0],
            };
        }

        const isVertical = snapLine === "vertical";
        let sizeOffset = [0, 0];

        if (
            !keepRatio
            && abs(endDirection[0]) === 1
            && abs(endDirection[1]) === 1
            && startDirection[0] !== endDirection[0]
            && startDirection[1] !== endDirection[1]
        ) {
            sizeOffset = getDragDist({
                datas,
                distX: -otherVerticalOffset,
                distY: -otherHorizontalOffset,
            });
        } else {
            sizeOffset = solveNextOffset(
                otherStartPos,
                otherEndPos,
                -(isVertical ? otherVerticalOffset : otherHorizontalOffset),
                isVertical,
                datas,
            ).offset;
        }
        sizeOffset = sizeOffset.map((size, i) => size * (multiple[i] ? 2 / multiple[i] : 0));


        return {
            sign: multiple,
            isBound: isVertical ? isOtherVerticalBound : isOtherHorizontalBound,
            isSnap: isVertical ? isOtherVerticalSnap : isOtherHorizontalSnap,
            offset: sizeOffset,
        };
    });
}


function getSnapBoundOffset(boundInfo: BoundInfo, snapInfo: SnapOffsetInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return snapInfo.offset;
    }
    return 0;
}

export function checkSnapBoundsKeepRatio(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    startPos: number[],
    endPos: number[],
    isRequest: boolean
): DirectionSnapType<SnapBoundInfo> {
    const {
        horizontal: horizontalBoundInfo,
        vertical: verticalBoundInfo,
    } = checkBoundKeepRatio(moveable, startPos, endPos);
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = isRequest ? ({
        horizontal: { isSnap: false },
        vertical: { isSnap: false },
    } as any) : checkSnapKeepRatio(moveable, startPos, endPos);

    const horizontalOffset = getSnapBoundOffset(
        horizontalBoundInfo,
        horizontalSnapInfo
    );
    const verticalOffset = getSnapBoundOffset(
        verticalBoundInfo,
        verticalSnapInfo
    );

    const horizontalDist = abs(horizontalOffset);
    const verticalDist = abs(verticalOffset);

    return {
        horizontal: {
            isBound: horizontalBoundInfo.isBound,
            isSnap: horizontalSnapInfo.isSnap,
            offset: horizontalOffset,
            dist: horizontalDist,
        },
        vertical: {
            isBound: verticalBoundInfo.isBound,
            isSnap: verticalSnapInfo.isSnap,
            offset: verticalOffset,
            dist: verticalDist,
        },
    };
}

export function checkMaxBounds(
    moveable: MoveableManagerInterface<SnappableProps>,
    poses: number[][],
    direction: number[],
    fixedPosition: number[],
    datas: any
) {
    const fixedDirection = [-direction[0], -direction[1]];
    const { width, height } = moveable.state;
    const bounds = moveable.props.bounds;
    let maxWidth = Infinity;
    let maxHeight = Infinity;

    if (bounds) {
        const directions = [
            [direction[0], -direction[1]],
            [-direction[0], direction[1]],
        ];
        const {
            left = -Infinity,
            top = -Infinity,
            right = Infinity,
            bottom = Infinity,
        } = bounds;

        directions.forEach((otherDirection) => {
            const isCheckVertical = otherDirection[0] !== fixedDirection[0];
            const isCheckHorizontal = otherDirection[1] !== fixedDirection[1];
            const otherPos = getPosByDirection(poses, otherDirection);
            const deg = (getRad(fixedPosition, otherPos) * 360) / Math.PI;

            if (isCheckHorizontal) {
                const nextOtherPos = otherPos.slice();

                if (abs(deg - 360) < 2 || abs(deg - 180) < 2) {
                    nextOtherPos[1] = fixedPosition[1];
                }
                const {
                    offset: [, heightOffset],
                    isOutside: isHeightOutside,
                } = solveNextOffset(
                    fixedPosition,
                    nextOtherPos,
                    (fixedPosition[1] < otherPos[1] ? bottom : top) -
                    otherPos[1],
                    false,
                    datas
                );
                if (!isNaN(heightOffset)) {
                    maxHeight = height + (isHeightOutside ? 1 : -1) * abs(heightOffset);
                }
            }
            if (isCheckVertical) {
                const nextOtherPos = otherPos.slice();

                if (abs(deg - 90) < 2 || abs(deg - 270) < 2) {
                    nextOtherPos[0] = fixedPosition[0];
                }
                const {
                    offset: [widthOffset],
                    isOutside: isWidthOutside,
                } = solveNextOffset(
                    fixedPosition,
                    nextOtherPos,
                    (fixedPosition[0] < otherPos[0] ? right : left) - otherPos[0],
                    true,
                    datas
                );
                if (!isNaN(widthOffset)) {
                    maxWidth = width + (isWidthOutside ? 1 : -1) * abs(widthOffset);
                }
            }
        });
    }
    return {
        maxWidth,
        maxHeight,
    };
}
