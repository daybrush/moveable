import {
    Renderer,
    SnappableProps,
    SnappableState,
    SnapGuideline,
    SnapInfo,
    BoundInfo,
    ScalableProps,
    SnapPosInfo,
    RotatableProps,
    RectInfo,
    DraggableProps,
    SnapOffsetInfo,
    GapGuideline,
    MoveableManagerInterface,
    SnappableRenderType,
    BoundType,
    SnapBoundInfo,
    MoveableGroupInterface,
} from "../types";
import {
    prefix,
    calculatePoses,
    getRect,
    getAbsolutePosesByState,
    getAbsolutePoses,
    throttle,
    getDistSize,
    groupBy,
    flat,
    maxOffset,
    minOffset,
    triggerEvent,
    calculateInversePosition,
    directionCondition,
    getClientRect,
    getRefTarget,
    getDragDistByState,
} from "../utils";
import { IObject, findIndex, hasClass, getRad, getDist } from "@daybrush/utils";
import {
    getPosByReverseDirection,
    getDragDist,
    scaleMatrix,
    getPosByDirection,
} from "../gesto/GestoUtils";
import { minus, rotate, plus } from "@scena/matrix";
import { dragControlCondition as rotatableDragControlCondtion } from "./Rotatable";
import { FLOAT_POINT_NUM, TINY_NUM } from "../consts";
import {
    getInnerBoundInfo,
    getCheckInnerBoundLines,
    getInnerBoundDragInfo,
    checkRotateInnerBounds,
    checkInnerBoundPoses,
} from "./snappable/innerBounds";
import {
    checkBoundPoses,
    checkRotateBounds,
    checkBoundKeepRatio,
    getBounds,
} from "./snappable/bounds";
import {
    checkSnaps,
    getSnapInfosByDirection,
    checkMoveableSnapPoses,
    getNearestSnapGuidelineInfo,
    getNearOffsetInfo,
    checkSnapKeepRatio,
    checkSnapPoses,
    getElementGuidelines,
    calculateContainerPos,
    getTotalGuidelines,
} from "./snappable/snap";
import {
    renderElementGroups, renderSnapPoses,
    renderGuidelines, renderGapGuidelines,
    filterElementInnerGuidelines,
} from "./snappable/render";

interface DirectionSnapType<T> {
    vertical: T;
    horizontal: T;
}


export function snapStart(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>
) {
    const state = moveable.state;

    if (state.guidelines && state.guidelines.length) {
        return;
    }
    const container = moveable.state.container;
    const snapContainer = moveable.props.snapContainer || container!;

    const containerClientRect = state.containerClientRect;
    const snapOffset = {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    };

    if (container !== snapContainer) {
        const snapContainerTarget = getRefTarget(snapContainer, true);

        if (snapContainerTarget) {
            const snapContainerRect = getClientRect(snapContainerTarget);
            const offset1 = getDragDistByState(state, [
                snapContainerRect.left - containerClientRect.left,
                snapContainerRect.top - containerClientRect.top,
            ]);
            const offset2 = getDragDistByState(state, [
                snapContainerRect.right - containerClientRect.right,
                snapContainerRect.bottom - containerClientRect.bottom,
            ]);
            snapOffset.left = throttle(offset1[0], 0.1);
            snapOffset.top = throttle(offset1[1], 0.1);
            snapOffset.right = throttle(offset2[0], 0.1);
            snapOffset.bottom = throttle(offset2[1], 0.1);
        }
    }

    state.snapOffset = snapOffset;
    state.elementGuidelineValues = [];
    state.staticGuidelines = getElementGuidelines(moveable, false);
    state.guidelines = getTotalGuidelines(moveable);
    state.enableSnap = true;
}

export function hasGuidelines(
    moveable: MoveableManagerInterface<any, any>,
    ableName: string
): moveable is MoveableManagerInterface<SnappableProps, SnappableState> {
    const {
        props: {
            snappable,
            bounds,
            innerBounds,
            verticalGuidelines,
            horizontalGuidelines,
            snapGridWidth,
            snapGridHeight,
        },
        state: { guidelines, enableSnap },
    } = moveable;

    if (
        !snappable ||
        !enableSnap ||
        (ableName && snappable !== true && snappable.indexOf(ableName) < 0)
    ) {
        return false;
    }
    if (
        snapGridWidth ||
        snapGridHeight ||
        bounds ||
        innerBounds ||
        (guidelines && guidelines.length) ||
        (verticalGuidelines && verticalGuidelines.length) ||
        (horizontalGuidelines && horizontalGuidelines.length)
    ) {
        return true;
    }
    return false;
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
function getNextFixedPoses(
    matrix: number[],
    width: number,
    height: number,
    fixedPos: number[],
    direction: number[],
    is3d: boolean
) {
    const nextPoses = calculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);

    return getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
}
function getSnapBoundOffset(boundInfo: BoundInfo, snapInfo: SnapOffsetInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return snapInfo.offset;
    }
    return 0;
}
function getSnapBound(boundInfo: BoundInfo, snapInfo: SnapInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return getNearestSnapGuidelineInfo(snapInfo).offset;
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

    const horizontalDist = Math.abs(horizontalOffset);
    const verticalDist = Math.abs(verticalOffset);

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
export function checkMoveableSnapBounds(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    isRequest: boolean,
    poses: number[][],
    boundPoses: number[][] = poses
): DirectionSnapType<Required<SnapBoundInfo>> {
    const {
        horizontal: horizontalBoundInfos,
        vertical: verticalBoundInfos,
    } = checkBoundPoses(
        getBounds(moveable),
        boundPoses.map((pos) => pos[0]),
        boundPoses.map((pos) => pos[1])
    );
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = isRequest ? {
        horizontal: { isSnap: false, index: -1 } as SnapInfo,
        vertical: { isSnap: false, index: -1 } as SnapInfo,
    } : checkMoveableSnapPoses(
        moveable,
        poses.map((pos) => pos[0]),
        poses.map((pos) => pos[1]),
        moveable.props.snapCenter
    );
    const horizontalOffset = getSnapBound(
        horizontalBoundInfos[0],
        horizontalSnapInfo
    );
    const verticalOffset = getSnapBound(
        verticalBoundInfos[0],
        verticalSnapInfo
    );

    const horizontalDist = Math.abs(horizontalOffset);
    const verticalDist = Math.abs(verticalOffset);

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
    options: {
        isRequest?: boolean;
        snapThreshold?: number;
        snapCenter?: boolean;
        snapElement?: boolean;
    } = {}
): DirectionSnapType<Required<SnapBoundInfo>> {
    const {
        horizontal: horizontalBoundInfos,
        vertical: verticalBoundInfos,
    } = checkBoundPoses(bounds, posesX, posesY);
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = options.isRequest ? {
        horizontal: { isSnap: false, index: -1 } as SnapInfo,
        vertical: { isSnap: false, index: -1 } as SnapInfo,
    } : checkSnapPoses(guideines, posesX, posesY, options);

    const horizontalOffset = getSnapBound(
        horizontalBoundInfos[0],
        horizontalSnapInfo
    );
    const verticalOffset = getSnapBound(
        verticalBoundInfos[0],
        verticalSnapInfo
    );

    const horizontalDist = Math.abs(horizontalOffset);
    const verticalDist = Math.abs(verticalOffset);

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
export function normalized(value: number) {
    return value ? value / Math.abs(value) : 0;
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

                if (Math.abs(deg - 360) < 2 || Math.abs(deg - 180) < 2) {
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
                    maxHeight = height + (isHeightOutside ? 1 : -1) * Math.abs(heightOffset);
                }
            }
            if (isCheckVertical) {
                const nextOtherPos = otherPos.slice();

                if (Math.abs(deg - 90) < 2 || Math.abs(deg - 270) < 2) {
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
                    maxWidth = width + (isWidthOutside ? 1 : -1) * Math.abs(widthOffset);
                }
            }
        });
    }
    return {
        maxWidth,
        maxHeight,
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
function getSnapBoundInfo(
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
            : checkMoveableSnapBounds(moveable, isRequest, [otherEndPos]);

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
        const sizeOffset = solveNextOffset(
            otherStartPos,
            otherEndPos,
            -(isVertical ? otherVerticalOffset : otherHorizontalOffset),
            isVertical,
            datas,
        ).offset.map((size, i) => size * (multiple[i] ? 2 / multiple[i] : 0));

        return {
            sign: multiple,
            isBound: isVertical ? isOtherVerticalBound : isOtherHorizontalBound,
            isSnap: isVertical ? isOtherVerticalSnap : isOtherHorizontalSnap,
            offset: sizeOffset,
        };
    });
}
export function getCheckSnapDirections(
    direction: number[],
    keepRatio: boolean
) {
    const directions: number[][][] = [];
    const fixedDirection = [-direction[0], -direction[1]];

    if (direction[0] && direction[1]) {
        directions.push(
            [fixedDirection, [direction[0], -direction[1]]],
            [fixedDirection, [-direction[0], direction[1]]]
        );
        if (keepRatio) {
            // pass two direction condition
            directions.push([fixedDirection, direction]);
        }
    } else if (direction[0]) {
        // vertcal
        if (keepRatio) {
            directions.push(
                [fixedDirection, [fixedDirection[0], -1]],
                [fixedDirection, [fixedDirection[0], 1]],
                [fixedDirection, [direction[0], -1]],
                [fixedDirection, direction],
                [fixedDirection, [direction[0], 1]]
            );
        } else {
            directions.push(
                [
                    [fixedDirection[0], -1],
                    [direction[0], -1],
                ],
                [
                    [fixedDirection[0], 0],
                    [direction[0], 0],
                ],
                [
                    [fixedDirection[0], 1],
                    [direction[0], 1],
                ]
            );
        }
    } else if (direction[1]) {
        // horizontal
        if (keepRatio) {
            directions.push(
                [fixedDirection, [-1, fixedDirection[1]]],
                [fixedDirection, [1, fixedDirection[1]]],
                [fixedDirection, [-1, direction[1]]],
                [fixedDirection, [1, direction[1]]],
                [fixedDirection, direction]
            );
        } else {
            directions.push(
                [
                    [-1, fixedDirection[1]],
                    [-1, direction[1]],
                ],
                [
                    [0, fixedDirection[1]],
                    [0, direction[1]],
                ],
                [
                    [1, fixedDirection[1]],
                    [1, direction[1]],
                ]
            );
        }
    } else {
        // [0, 0] to all direction
        directions.push(
            [fixedDirection, [1, 0]],
            [fixedDirection, [-1, 0]],
            [fixedDirection, [0, -1]],
            [fixedDirection, [0, 1]],

            [
                [1, 0],
                [1, -1],
            ],
            [
                [1, 0],
                [1, 1],
            ],
            [
                [0, 1],
                [1, 1],
            ],
            [
                [0, 1],
                [-1, 1],
            ],

            [
                [-1, 0],
                [-1, -1],
            ],
            [
                [-1, 0],
                [-1, 1],
            ],
            [
                [0, -1],
                [1, -1],
            ],
            [
                [0, -1],
                [-1, -1],
            ]
        );
    }

    return directions;
}
export function getSizeOffsetInfo(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    poses: number[][],
    direction: number[],
    keepRatio: boolean,
    isRequest: boolean,
    datas: any
) {
    const directions = getCheckSnapDirections(direction, keepRatio);
    const lines = getCheckInnerBoundLines(poses, direction, keepRatio);
    const offsets = [
        ...getSnapBoundInfo(
            moveable,
            poses,
            directions,
            keepRatio,
            isRequest,
            datas
        ),
        ...getInnerBoundInfo(
            moveable,
            lines,
            getPosByDirection(poses, [0, 0]),
            datas
        ),
    ];
    const widthOffsetInfo = getNearOffsetInfo(offsets, 0);
    const heightOffsetInfo = getNearOffsetInfo(offsets, 1);

    return {
        width: {
            isBound: widthOffsetInfo.isBound,
            offset: widthOffsetInfo.offset[0],
        },
        height: {
            isBound: heightOffsetInfo.isBound,
            offset: heightOffsetInfo.offset[1],
        },
    };
}
export function recheckSizeByTwoDirection(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    poses: number[][],
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    direction: number[],
    isRequest: boolean,
    datas: any
) {
    const snapPos = getPosByDirection(poses, direction);

    const {
        horizontal: { offset: horizontalOffset },
        vertical: { offset: verticalOffset },
    } = checkMoveableSnapBounds(moveable, isRequest, [snapPos]);

    if (verticalOffset || horizontalOffset) {
        const [nextWidthOffset, nextHeightOffset] = getDragDist({
            datas,
            distX: -verticalOffset,
            distY: -horizontalOffset,
        });
        const nextWidth = Math.min(
            maxWidth || Infinity,
            width + direction[0] * nextWidthOffset
        );
        const nextHeight = Math.min(
            maxHeight || Infinity,
            height + direction[1] * nextHeightOffset
        );

        return [nextWidth - width, nextHeight - height];
    }
    return [0, 0];
}
export function checkSizeDist(
    moveable: MoveableManagerInterface<any, any>,
    getNextPoses: (widthOffset: number, heightOffset: number) => number[][],
    width: number,
    height: number,
    direction: number[],
    fixedPosition: number[],
    isRequest: boolean,
    datas: any
) {
    const poses = getAbsolutePosesByState(moveable.state);
    const keepRatio = moveable.props.keepRatio;

    let widthOffset = 0;
    let heightOffset = 0;

    for (let i = 0; i < 2; ++i) {
        const nextPoses = getNextPoses(widthOffset, heightOffset);
        const {
            width: widthOffsetInfo,
            height: heightOffsetInfo,
        } = getSizeOffsetInfo(
            moveable,
            nextPoses,
            direction,
            keepRatio,
            isRequest,
            datas
        );

        const isWidthBound = widthOffsetInfo.isBound;
        const isHeightBound = heightOffsetInfo.isBound;
        let nextWidthOffset = widthOffsetInfo.offset;
        let nextHeightOffset = heightOffsetInfo.offset;

        if (i === 1) {
            if (!isWidthBound) {
                nextWidthOffset = 0;
            }
            if (!isHeightBound) {
                nextHeightOffset = 0;
            }
        }
        if (i === 0 && isRequest && !isWidthBound && !isHeightBound) {
            return [0, 0];
        }
        if (keepRatio) {
            const widthDist =
                Math.abs(nextWidthOffset) * (width ? 1 / width : 1);
            const heightDist =
                Math.abs(nextHeightOffset) * (height ? 1 / height : 1);
            const isGetWidthOffset =
                isWidthBound && isHeightBound
                    ? widthDist < heightDist
                    : isHeightBound ||
                    (!isWidthBound && widthDist < heightDist);
            if (isGetWidthOffset) {
                // width : height = ? : heightOffset
                nextWidthOffset = (width * nextHeightOffset) / height;
            } else {
                // width : height = widthOffset : ?
                nextHeightOffset = (height * nextWidthOffset) / width;
            }
        }
        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    if (direction[0] && direction[1]) {
        const { maxWidth, maxHeight } = checkMaxBounds(
            moveable,
            poses,
            direction,
            fixedPosition,
            datas
        );

        const [nextWidthOffset, nextHeightOffset] = recheckSizeByTwoDirection(
            moveable,
            getNextPoses(widthOffset, heightOffset).map(pos => pos.map(p => throttle(p, FLOAT_POINT_NUM))),
            width + widthOffset,
            height + heightOffset,
            maxWidth,
            maxHeight,
            direction,
            isRequest,
            datas
        );
        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    return [widthOffset, heightOffset];
}

export function checkSnapRotate(
    moveable: MoveableManagerInterface<SnappableProps & RotatableProps, any>,
    rect: RectInfo,
    origin: number[],
    rotation: number
) {
    if (!hasGuidelines(moveable, "rotatable")) {
        return rotation;
    }

    const { pos1, pos2, pos3, pos4 } = rect;
    const rad = (rotation * Math.PI) / 180;
    const prevPoses = [pos1, pos2, pos3, pos4].map((pos) => minus(pos, origin));
    const nextPoses = prevPoses.map((pos) => rotate(pos, rad));

    const result = [
        ...checkRotateBounds(moveable, prevPoses, nextPoses, origin, rotation),
        ...checkRotateInnerBounds(
            moveable,
            prevPoses,
            nextPoses,
            origin,
            rotation
        ),
    ];
    result.sort((a, b) => Math.abs(a - rotation) - Math.abs(b - rotation));

    if (result.length) {
        return result[0];
    } else {
        return rotation;
    }
}
export function checkSnapResize(
    moveable: MoveableManagerInterface<{}, {}>,
    width: number,
    height: number,
    direction: number[],
    fixedPosition: number[],
    isRequest: boolean,
    datas: any
) {
    if (!hasGuidelines(moveable, "resizable")) {
        return [0, 0];
    }
    const { allMatrix, is3d } = moveable.state;
    return checkSizeDist(
        moveable,
        (widthOffset: number, heightOffset: number) => {
            return getNextFixedPoses(
                allMatrix,
                width + widthOffset,
                height + heightOffset,
                fixedPosition,
                direction,
                is3d
            );
        },
        width,
        height,
        direction,
        fixedPosition,
        isRequest,
        datas
    );
}
export function checkSnapScale(
    moveable: MoveableManagerInterface<ScalableProps, any>,
    scale: number[],
    direction: number[],
    isRequest: boolean,
    datas: any
) {
    const { width, height, fixedPosition } = datas;
    if (!hasGuidelines(moveable, "scalable")) {
        return [0, 0];
    }
    const is3d = datas.is3d;
    const sizeDist = checkSizeDist(
        moveable,
        (widthOffset: number, heightOffset: number) => {
            return getNextFixedPoses(
                scaleMatrix(
                    datas,
                    plus(scale, [widthOffset / width, heightOffset / height]),
                ),
                width,
                height,
                fixedPosition,
                direction,
                is3d
            );
        },
        width,
        height,
        direction,
        fixedPosition,
        isRequest,
        datas
    );

    return [sizeDist[0] / width, sizeDist[1] / height];
}
export function solveEquation(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean
) {
    let dx = pos2[0] - pos1[0];
    let dy = pos2[1] - pos1[1];

    if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (Math.abs(dy) < TINY_NUM) {
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

export function startCheckSnapDrag(
    moveable: MoveableManagerInterface<any, any>,
    datas: any
) {
    datas.absolutePoses = getAbsolutePosesByState(moveable.state);
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

            if (adjustPos[0] && Math.abs(distX) > TINY_NUM) {
                offsetX = -adjustPos[0];
                offsetY =
                    (distY * Math.abs(distX + offsetX)) / Math.abs(distX) -
                    distY;
            } else if (adjustPos[1] && Math.abs(distY) > TINY_NUM) {
                const prevDistY = distY;
                offsetY = -adjustPos[1];
                offsetX =
                    (distX * Math.abs(distY + offsetY)) / Math.abs(prevDistY) -
                    distX;
            }
            if (throttleDragRotate && isHorizontalBound && isVerticalBound) {
                if (
                    Math.abs(offsetX) > TINY_NUM &&
                    Math.abs(offsetX) < Math.abs(verticalOffset)
                ) {
                    const scale = Math.abs(verticalOffset) / Math.abs(offsetX);

                    offsetX *= scale;
                    offsetY *= scale;
                } else if (
                    Math.abs(offsetY) > TINY_NUM &&
                    Math.abs(offsetY) < Math.abs(horizontalOffset)
                ) {
                    const scale =
                        Math.abs(horizontalOffset) / Math.abs(offsetY);

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
export function checkSnapDrag(
    moveable: MoveableManagerInterface<SnappableProps & DraggableProps, any>,
    distX: number,
    distY: number,
    throttleDragRotate: number,
    isRequest: boolean,
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
    const snapCenter = moveable.props.snapCenter;
    const snapPoses = [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom],
    ];

    if (snapCenter) {
        snapPoses.push([(left + right) / 2, (top + bottom) / 2]);
    }
    const {
        vertical: verticalSnapBoundInfo,
        horizontal: horizontalSnapBoundInfo,
    } = checkMoveableSnapBounds(moveable, isRequest, snapPoses, poses);
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

function getSnapGuidelines(posInfos: SnapPosInfo[]) {
    const guidelines: SnapGuideline[] = [];

    posInfos.forEach((posInfo) => {
        posInfo.guidelineInfos.forEach(({ guideline }) => {
            if (guidelines.indexOf(guideline) > -1) {
                return;
            }
            guidelines.push(guideline);
        });
    });

    return guidelines;
}


function getGapGuidelinesToStart(
    guidelines: SnapGuideline[],
    index: number,
    targetPos: number[],
    targetSizes: number[],
    guidelinePos: number[],
    gap: number,
    otherPos: number
): GapGuideline[] {
    const absGap = Math.abs(gap);
    let start = guidelinePos[index] + (gap > 0 ? targetSizes[0] : 0);

    return guidelines
        .filter(({ pos: gapPos }) => gapPos[index] <= targetPos[index])
        .sort(({ pos: aPos }, { pos: bPos }) => bPos[index] - aPos[index])
        .filter(({ pos: gapPos, sizes: gapSizes }) => {
            const nextPos = gapPos[index];

            if (
                throttle(nextPos + gapSizes![index], FLOAT_POINT_NUM) ===
                throttle(start - absGap, FLOAT_POINT_NUM)
            ) {
                start = nextPos;
                return true;
            }
            return false;
        })
        .map((gapGuideline) => {
            const renderPos =
                -targetPos[index] +
                gapGuideline.pos[index] +
                gapGuideline.sizes![index];

            return {
                ...gapGuideline,
                gap,
                renderPos: index
                    ? [otherPos, renderPos]
                    : [renderPos, otherPos],
            };
        });
}
function getGapGuidelinesToEnd(
    guidelines: SnapGuideline[],
    index: number,
    targetPos: number[],
    targetSizes: number[],
    guidelinePos: number[],
    gap: number,
    otherPos: number
): GapGuideline[] {
    const absGap = Math.abs(gap);
    let start = guidelinePos[index] + (gap < 0 ? targetSizes[index] : 0);

    return guidelines
        .filter(({ pos: gapPos }) => gapPos[index] > targetPos[index])
        .sort(({ pos: aPos }, { pos: bPos }) => aPos[index] - bPos[index])
        .filter(({ pos: gapPos, sizes: gapSizes }) => {
            const nextPos = gapPos[index];

            if (
                throttle(nextPos, FLOAT_POINT_NUM) === throttle(start + absGap, FLOAT_POINT_NUM)
            ) {
                start = nextPos + gapSizes![index];
                return true;
            }
            return false;
        })
        .map((gapGuideline) => {
            const renderPos =
                -targetPos[index] + gapGuideline.pos[index] - absGap;

            return {
                ...gapGuideline,
                gap,
                renderPos: index
                    ? [otherPos, renderPos]
                    : [renderPos, otherPos],
            };
        });
}
function getGapGuidelines(
    guidelines: SnapGuideline[],
    type: "vertical" | "horizontal",
    targetPos: number[],
    targetSizes: number[]
): GapGuideline[] {
    const elementGuidelines = guidelines.filter(
        ({ element, gap, type: guidelineType }) =>
            element && gap && guidelineType === type
    );
    const [index, otherIndex] = type === "vertical" ? [0, 1] : [1, 0];

    return flat(
        elementGuidelines.map((guideline) => {
            const pos = guideline.pos;
            const gap = guideline.gap!;
            const gapGuidelines = guideline.gapGuidelines!;
            const sizes = guideline.sizes!;

            let offset = minOffset(
                pos[otherIndex] + sizes[otherIndex] - targetPos[otherIndex],
                pos[otherIndex] -
                targetPos[otherIndex] -
                targetSizes[otherIndex]
            );
            const minSize = Math.min(
                sizes[otherIndex],
                targetSizes[otherIndex]
            );

            if (offset > 0 && offset > minSize) {
                offset = (offset - minSize / 2) * 2;
            } else if (offset < 0 && offset < -minSize) {
                offset = (offset + minSize / 2) * 2;
            }
            if (offset === 0) {
                return [];
            }

            const otherPos =
                (offset > 0 ? 0 : targetSizes[otherIndex]) + offset / 2;

            return [
                ...getGapGuidelinesToStart(
                    gapGuidelines,
                    index,
                    targetPos,
                    targetSizes,
                    pos,
                    gap,
                    otherPos
                ),
                ...getGapGuidelinesToEnd(
                    gapGuidelines,
                    index,
                    targetPos,
                    targetSizes,
                    pos,
                    gap,
                    otherPos
                ),
            ];
        })
    );
}

function addBoundGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    verticalPoses: number[],
    horizontalPoses: number[],
    verticalSnapPoses: SnappableRenderType[],
    horizontalSnapPoses: SnappableRenderType[],
    externalBounds?: BoundType | false | null
) {
    const {
        vertical: verticalBoundInfos,
        horizontal: horizontalBoundInfos,
    } = checkBoundPoses(
        getBounds(moveable, externalBounds),
        verticalPoses,
        horizontalPoses
    );
    verticalBoundInfos.forEach((info) => {
        if (info.isBound) {
            verticalSnapPoses.push({
                type: "bounds",
                pos: info.pos,
            });
        }
    });
    horizontalBoundInfos.forEach((info) => {
        if (info.isBound) {
            horizontalSnapPoses.push({
                type: "bounds",
                pos: info.pos,
            });
        }
    });
    const {
        vertical: verticalInnerBoundPoses,
        horizontal: horizontalInnerBoundPoses,
    } = checkInnerBoundPoses(moveable);

    verticalInnerBoundPoses.forEach((innerPos) => {
        if (
            findIndex(
                verticalSnapPoses,
                ({ type, pos }) => type === "bounds" && pos === innerPos
            ) >= 0
        ) {
            return;
        }
        verticalSnapPoses.push({
            type: "bounds",
            pos: innerPos,
        });
    });

    horizontalInnerBoundPoses.forEach((innerPos) => {
        if (
            findIndex(
                horizontalSnapPoses,
                ({ type, pos }) => type === "bounds" && pos === innerPos
            ) >= 0
        ) {
            return;
        }
        horizontalSnapPoses.push({
            type: "bounds",
            pos: innerPos,
        });
    });
}
/**
 * @namespace Moveable.Snappable
 * @description Whether or not target can be snapped to the guideline. (default: false)
 * @sort 2
 */
export default {
    name: "snappable",
    props: {
        snappable: [Boolean, Array],
        snapContainer: Object,
        snapCenter: Boolean,
        snapHorizontal: Boolean,
        snapVertical: Boolean,
        snapElement: Boolean,
        snapGap: Boolean,
        snapGridWidth: Number,
        snapGridHeight: Number,
        isDisplaySnapDigit: Boolean,
        isDisplayInnerSnapDigit: Boolean,
        snapDigit: Number,
        snapThreshold: Number,
        horizontalGuidelines: Array,
        verticalGuidelines: Array,
        elementGuidelines: Array,
        bounds: Object,
        innerBounds: Object,
        snapDistFormat: Function,
    } as const,
    events: {
        onSnap: "snap",
    } as const,
    css: [
        `:host {
    --bounds-color: #d66;
}
.guideline {
    pointer-events: none;
    z-index: 2;
}
.guideline.bounds {
    background: #d66;
    background: var(--bounds-color);
}
.guideline-group {
    position: absolute;
    top: 0;
    left: 0;
}
.guideline-group .size-value {
    position: absolute;
    color: #f55;
    font-size: 12px;
    font-weight: bold;
}
.guideline-group.horizontal .size-value {
    transform-origin: 50% 100%;
    transform: translateX(-50%);
    left: 50%;
    bottom: 5px;
}
.guideline-group.vertical .size-value {
    transform-origin: 0% 50%;
    top: 50%;
    transform: translateY(-50%);
    left: 5px;
}
.guideline.gap {
    background: #f55;
}
.size-value.gap {
    color: #f55;
}
`,
    ],
    render(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
        React: Renderer
    ): any[] {
        const state = moveable.state;
        const {
            top: targetTop,
            left: targetLeft,
            pos1,
            pos2,
            pos3,
            pos4,
            snapRenderInfo,
            targetClientRect,
            containerClientRect,
            is3d,
            rootMatrix,
        } = state;

        if (!snapRenderInfo || !hasGuidelines(moveable, "")) {
            return [];
        }
        state.staticGuidelines = getElementGuidelines(moveable, false, state.staticGuidelines);
        state.guidelines = getTotalGuidelines(moveable);

        const n = is3d ? 4 : 3;
        const minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const containerPos = calculateContainerPos(
            rootMatrix,
            containerClientRect,
            n
        );
        const [clientLeft, clientTop] = calculateInversePosition(
            rootMatrix,
            [
                targetClientRect.left - containerPos[0],
                targetClientRect.top - containerPos[1],
            ],
            n
        );

        const {
            snapThreshold = 5,
            snapDigit = 0,
            snapDistFormat = (v: number) => v,
        } = moveable.props;
        const externalPoses = snapRenderInfo.externalPoses || [];
        const poses = getAbsolutePosesByState(moveable.state);
        const verticalSnapPoses: SnappableRenderType[] = [];
        const horizontalSnapPoses: SnappableRenderType[] = [];
        const verticalGuidelines: SnapGuideline[] = [];
        const horizontalGuidelines: SnapGuideline[] = [];
        const snapInfos: Array<{
            vertical: SnapInfo;
            horizontal: SnapInfo;
        }> = [];
        const { width, height, top, left, bottom, right } = getRect(poses);
        const hasExternalPoses = externalPoses.length > 0;
        const externalRect = hasExternalPoses
            ? getRect(externalPoses)
            : ({} as ReturnType<typeof getRect>);

        if (!snapRenderInfo.request) {
            if (snapRenderInfo.direction) {
                snapInfos.push(
                    getSnapInfosByDirection(
                        moveable,
                        poses,
                        snapRenderInfo.direction
                    )
                );
            }
            if (snapRenderInfo.snap) {
                const rect = getRect(poses);

                if (snapRenderInfo.center) {
                    (rect as any).middle = (rect.top + rect.bottom) / 2;
                    (rect as any).center = (rect.left + rect.right) / 2;
                }
                snapInfos.push(checkSnaps(moveable, rect, true, 1));
            }
            if (hasExternalPoses) {
                if (snapRenderInfo.center) {
                    (externalRect as any).middle =
                        (externalRect.top + externalRect.bottom) / 2;
                    (externalRect as any).center =
                        (externalRect.left + externalRect.right) / 2;
                }
                snapInfos.push(checkSnaps(moveable, externalRect, true, 1));
            }
            snapInfos.forEach((snapInfo) => {
                const {
                    vertical: { posInfos: verticalPosInfos },
                    horizontal: { posInfos: horizontalPosInfos },
                } = snapInfo;
                verticalSnapPoses.push(
                    ...verticalPosInfos.filter(({ guidelineInfos }) => {
                        return guidelineInfos.some(({ guideline }) => !guideline.hide);
                    }).map(
                        (posInfo) => ({
                            type: "snap",
                            pos: posInfo.pos,
                        } as const)
                    )
                );
                horizontalSnapPoses.push(
                    ...horizontalPosInfos.filter(({ guidelineInfos }) => {
                        return guidelineInfos.some(({ guideline }) => !guideline.hide);
                    }).map(
                        (posInfo) => ({
                            type: "snap",
                            pos: posInfo.pos,
                        } as const)
                    )
                );
                verticalGuidelines.push(...getSnapGuidelines(verticalPosInfos));
                horizontalGuidelines.push(...getSnapGuidelines(horizontalPosInfos));
            });
        }

        addBoundGuidelines(
            moveable,
            [left, right],
            [top, bottom],
            verticalSnapPoses,
            horizontalSnapPoses
        );
        if (hasExternalPoses) {
            addBoundGuidelines(
                moveable,
                [externalRect.left, externalRect.right],
                [externalRect.top, externalRect.bottom],
                verticalSnapPoses,
                horizontalSnapPoses,
                snapRenderInfo.externalBounds
            );
        }


        const gapHorizontalGuidelines = getGapGuidelines(
            verticalGuidelines,
            "vertical",
            [targetLeft, targetTop],
            [width, height]
        );
        const gapVerticalGuidelines = getGapGuidelines(
            horizontalGuidelines,
            "horizontal",
            [targetLeft, targetTop],
            [width, height]
        );

        const allGuidelines = [...verticalGuidelines, ...horizontalGuidelines];
        triggerEvent(
            moveable,
            "onSnap",
            {
                guidelines: allGuidelines.filter(({ element }) => !element),
                elements: groupBy(
                    allGuidelines.filter(({ element }) => element),
                    ({ element }) => element
                ),
                gaps: [...gapVerticalGuidelines, ...gapHorizontalGuidelines],
            },
            true
        );
        const {
            guidelines: nextHorizontalGuidelines,
            groups: elementHorizontalGroups,
            gapGuidelines: innerGapHorizontalGuidelines,
        } = filterElementInnerGuidelines(
            moveable,
            horizontalGuidelines,
            0,
            [targetLeft, targetTop],
            [clientLeft, clientTop],
            [width, height],
        );
        const {
            guidelines: nextVerticalGuidelines,
            groups: elementVerticalGroups,
            gapGuidelines: innerGapVerticalGuidelines,
        } = filterElementInnerGuidelines(
            moveable,
            verticalGuidelines,
            1,
            [targetLeft, targetTop],
            [clientLeft, clientTop],
            [width, height],
        );

        return [
            ...renderGapGuidelines(
                moveable,
                "vertical",
                [...gapVerticalGuidelines, ...innerGapVerticalGuidelines],
                snapDistFormat,
                React
            ),
            ...renderGapGuidelines(
                moveable,
                "horizontal",
                [...gapHorizontalGuidelines, ...innerGapHorizontalGuidelines],
                snapDistFormat,
                React
            ),
            ...renderElementGroups(
                moveable,
                "horizontal",
                elementHorizontalGroups,
                minLeft,
                clientLeft,
                width,
                targetTop,
                snapThreshold,
                snapDigit,
                0,
                snapDistFormat,
                React
            ),
            ...renderElementGroups(
                moveable,
                "vertical",
                elementVerticalGroups,
                minTop,
                clientTop,
                height,
                targetLeft,
                snapThreshold,
                snapDigit,
                1,
                snapDistFormat,
                React
            ),
            ...renderGuidelines(
                moveable,
                "horizontal",
                nextHorizontalGuidelines,
                [targetLeft, targetTop],
                React
            ),
            ...renderGuidelines(
                moveable,
                "vertical",
                nextVerticalGuidelines,
                [targetLeft, targetTop],
                React
            ),
            ...renderSnapPoses(
                moveable,
                "horizontal",
                horizontalSnapPoses,
                minLeft,
                targetTop,
                width,
                0,
                React
            ),
            ...renderSnapPoses(
                moveable,
                "vertical",
                verticalSnapPoses,
                minTop,
                targetLeft,
                height,
                1,
                React
            ),
        ];
    },
    dragStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
        e: any
    ) {
        moveable.state.snapRenderInfo = {
            request: e.isRequest,
            snap: true,
            center: true,
        };
        snapStart(moveable);
    },
    drag(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        const state = moveable.state;
        state.staticGuidelines = getElementGuidelines(moveable, false, state.staticGuidelines);
        state.guidelines = getTotalGuidelines(moveable);
    },
    pinchStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragEnd(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragControlCondition(moveable: MoveableManagerInterface, e: any) {
        if (directionCondition(moveable, e) || rotatableDragControlCondtion(moveable, e)) {
            return true;
        }
        if (!e.isRequest && e.inputEvent) {
            return hasClass(e.inputEvent.target, prefix("snap-control"));
        }
    },
    dragControlStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragControl(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragControlEnd(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroup(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragGroupEnd(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragGroupControlStart(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragGroupControl(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragGroupControlEnd(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    unset(moveable: any) {
        const state = moveable.state;

        state.enableSnap = false;
        state.staticGuidelines = [];
        state.guidelines = [];
        state.snapRenderInfo = null;
    },
};


/**
 * Whether or not target can be snapped to the guideline. (default: false)
 * @name Moveable.Snappable#snappable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snappable = true;
 */
/**
 *  A snap container that is the basis for snap, bounds, and innerBounds. (default: null = container)
 * @name Moveable.Snappable#snapContainer
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.querySelector(".container"));
 *
 * moveable.snapContainer = document.body;
 */
/**
 * When you drag, make the snap in the center of the target. (default: false)
 * @name Moveable.Snappable#snapCenter
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 * });
 *
 * moveable.snapCenter = true;
 */

/**
 * When you drag, make the snap in the vertical guidelines. (default: true)
 * @name Moveable.Snappable#snapVertical
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapVertical = false;
 */
/**
 * When you drag, make the snap in the horizontal guidelines. (default: true)
 * @name Moveable.Snappable#snapHorizontal
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapHorizontal = false;
 */
/**
 * When you drag, make the gap snap in the element guidelines. (default: true)
 * @name Moveable.Snappable#snapGap
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 *   snapGap: true,
 * });
 *
 * moveable.snapGap = false;
 */
/**
 * When you drag, make the snap in the element guidelines. (default: true)
 * @name Moveable.Snappable#snapElement
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapElement = false;
 */
/**
 * Distance value that can snap to guidelines. (default: 5)
 * @name Moveable.Snappable#snapThreshold
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapThreshold = 5;
 */

/**
 * Add guidelines in the horizontal direction. (default: [])
 * @name Moveable.Snappable#horizontalGuidelines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.horizontalGuidelines = [100, 200, 500];
 */

/**
 * Add guidelines in the vertical direction. (default: [])
 * @name Moveable.Snappable#verticalGuidelines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.verticalGuidelines = [100, 200, 500];
 */
/**
 * Add guidelines for the element. (default: [])
 * @name Moveable.Snappable#elementGuidelines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.elementGuidelines = [
 *   document.querySelector(".element"),
 * ];
 */
/**
 * You can set up boundaries. (default: null)
 * @name Moveable.Snappable#bounds
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.bounds = { left: 0, right: 1000, top: 0, bottom: 1000};
 */
/**
 * You can set up inner boundaries. (default: null)
 * @name Moveable.Snappable#innerBounds
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.innerBounds = { left: 500, top: 500, width: 100, height: 100};
 */
/**
 * snap distance digits (default: 0)
 * @name Moveable.Snappable#snapDigit
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapDigit = 0
 */

/**
 * If width size is greater than 0, you can vertical snap to the grid. (default: 0)
 * @name Moveable.Snappable#snapGridWidth
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapGridWidth = 5;
 */

/**
 * If height size is greater than 0, you can horizontal snap to the grid. (default: 0)
 * @name Moveable.Snappable#snapGridHeight
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapGridHeight = 5;
 */
/**
 * Whether to show snap distance (default: true)
 * @name Moveable.Snappable#isDisplaySnapDigit
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.isDisplaySnapDigit = true;
 */

/**
 * Whether to show element inner snap distance (default: false)
 * @name Moveable.Snappable#isDisplayInnerSnapDigit
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.isDisplayInnerSnapDigit = true;
 */


/**
 * You can set the text format of the distance shown in the guidelines. (default: self)
 * @name Moveable.Snappable#snapDistFormat
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  snappable: true,
 *  snapDistFormat: v => v,
 * });
 * moveable.snapDistFormat = v => `${v}px`;
 */

/**
 * When you drag or dragControl, the `snap` event is called.
 * @memberof Moveable.Snappable
 * @event snap
 * @param {Moveable.Snappable.OnSnap} - Parameters for the `snap` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     snappable: true
 * });
 * moveable.on("snap", e => {
 *     console.log("onSnap", e);
 * });
 */
