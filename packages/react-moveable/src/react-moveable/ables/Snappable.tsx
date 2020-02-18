import MoveableManager from "../MoveableManager";
import {
    Renderer,
    SnappableProps,
    SnappableState, Guideline,
    SnapInfo, BoundInfo,
    ScalableProps, SnapPosInfo, RotatableProps,
    RectInfo, DraggableProps,
} from "../types";
import {
    prefix, caculatePoses, getRect,
    getAbsolutePosesByState, getAbsolutePoses, throttle, roundSign, getDistSize, groupBy, flat, maxOffset,
} from "../utils";
import { IObject, find } from "@daybrush/utils";
import {
    getPosByReverseDirection,
    getDragDist, scaleMatrix, getPosByDirection,
} from "../DraggerUtils";
import { minus, rotate, getRad } from "@moveable/matrix";
import {
    dragControlCondition as rotatableDragControlCondtion,
} from "./Rotatable";
import { TINY_NUM } from "../consts";
import { directionCondition } from "./utils";
import { getInnerBoundInfo, getCheckSnapLines, getInnerBoundDragInfo } from "./snappable/innerBounds";
import { checkBounds } from "./snappable/bounds";
import {
    checkSnaps, getSnapInfosByDirection,
    checkSnapPoses, getNearestSnapGuidelineInfo,
    getNearOffsetInfo,
} from "./snappable/snap";

export function snapStart(moveable: MoveableManager<SnappableProps, SnappableState>) {
    const state = moveable.state;
    if (state.guidelines && state.guidelines.length) {
        return;
    }

    const {
        horizontalGuidelines = [],
        verticalGuidelines = [],
        elementGuidelines = [],
        bounds,
        snapCenter,
    } = moveable.props;

    if (!bounds && !horizontalGuidelines.length && !verticalGuidelines.length && !elementGuidelines.length) {
        return;
    }

    const {
        containerClientRect: {
            top: containerTop,
            left: containerLeft,
        },
        targetClientRect: {
            top: clientTop,
            left: clientLeft,
        },
    } = state;
    const poses = getAbsolutePosesByState(state);
    const targetLeft = Math.min(...poses.map(pos => pos[0]));
    const targetTop = Math.min(...poses.map(pos => pos[1]));
    const distLeft = roundSign(targetLeft - (clientLeft - containerLeft));
    const distTop = roundSign(targetTop - (clientTop - containerTop));
    const guidelines: Guideline[] = [];

    elementGuidelines!.forEach(el => {
        const rect = el.getBoundingClientRect();
        const { top, left, width, height } = rect;
        const elementTop = top - containerTop;
        const elementBottom = elementTop + height;
        const elementLeft = left - containerLeft;
        const elementRight = elementLeft + width;
        guidelines.push({
            type: "vertical", element: el, pos: [
                throttle(elementLeft + distLeft, 0.1),
                elementTop,
            ], size: height,
        });
        guidelines.push({
            type: "vertical", element: el, pos: [
                throttle(elementRight + distLeft, 0.1),
                elementTop,
            ], size: height,
        });
        guidelines.push({
            type: "horizontal", element: el, pos: [
                elementLeft,
                throttle(elementTop + distTop, 0.1),
            ], size: width,
        });
        guidelines.push({
            type: "horizontal", element: el, pos: [
                elementLeft,
                throttle(elementBottom + distTop, 0.1),
            ], size: width,
        });

        if (snapCenter) {
            guidelines.push({
                type: "vertical",
                element: el,
                pos: [
                    throttle((elementLeft + elementRight) / 2 + distLeft, 0.1),
                    elementTop,
                ],
                size: height,
                center: true,
            });
            guidelines.push({
                type: "horizontal",
                element: el,
                pos: [
                    elementLeft,
                    throttle((elementTop + elementBottom) / 2 + distTop, 0.1),
                ],
                size: width,
                center: true,
            });
        }
    });

    state.guidelines = guidelines;
    state.enableSnap = true;
}

export function hasGuidelines(
    moveable: MoveableManager<any, any>,
    ableName: string,
): moveable is MoveableManager<SnappableProps, SnappableState> {
    const {
        props: {
            snappable,
            bounds,
            verticalGuidelines,
            horizontalGuidelines,
        },
        state: {
            guidelines,
            enableSnap,
        },
    } = moveable;

    if (
        !snappable
        || !enableSnap
        || (ableName && snappable !== true && snappable.indexOf(ableName) < 0)
    ) {
        return false;
    }
    if (
        bounds
        || (guidelines && guidelines.length)
        || (verticalGuidelines && verticalGuidelines.length)
        || (horizontalGuidelines && horizontalGuidelines.length)
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
    datas: IObject<any>,
) {
    const sizeOffset = solveEquation(
        pos1,
        pos2,
        -offset,
        isVertical,
    );

    if (!sizeOffset) {
        return [0, 0];
    }
    const [widthOffset, heightOffset] = getDragDist({
        datas,
        distX: sizeOffset[0],
        distY: sizeOffset[1],
    });

    return [widthOffset, heightOffset];
}
function getNextFixedPoses(
    matrix: number[],
    width: number,
    height: number,
    fixedPos: number[],
    direction: number[],
    is3d: boolean,
) {
    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);

    return getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
}

function getSnapBoundOffset(boundInfo: BoundInfo, snapInfo: SnapInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return getNearestSnapGuidelineInfo(snapInfo).offset;
    }
    return 0;
}

export function checkSnapBounds(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    poses: number[][],
    boundPoses: number[][] = poses,
) {
    const {
        horizontal: horizontalBoundInfo,
        vertical: verticalBoundInfo,
    } = checkBounds(
        moveable,
        boundPoses.map(pos => pos[0]),
        boundPoses.map(pos => pos[1]),
    );
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = checkSnapPoses(
        moveable,
        poses.map(pos => pos[0]),
        poses.map(pos => pos[1]),
    );

    const horizontalOffset = getSnapBoundOffset(horizontalBoundInfo, horizontalSnapInfo);
    const verticalOffset = getSnapBoundOffset(verticalBoundInfo, verticalSnapInfo);

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
export function checkMaxBounds(
    moveable: MoveableManager<SnappableProps>,
    width: number,
    height: number,
    poses: number[][],
    direction: number[],
    fixedPos: number[],
    datas: any,
) {
    const fixedDirection = [-direction[0], -direction[1]];
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

        directions.forEach(otherDirection => {
            const isCheckVertical = otherDirection[0] !== fixedDirection[0];
            const isCheckHorizontal = otherDirection[1] !== fixedDirection[1];
            const otherPos = getPosByDirection(poses, otherDirection);

            if (isCheckHorizontal) {
                const [
                    ,
                    heightOffset,
                ] = solveNextOffset(
                    fixedPos, otherPos,
                    (fixedPos[1] < otherPos[1] ? bottom : top) - otherPos[1],
                    false, datas,
                );

                if (!isNaN(heightOffset)) {
                    maxHeight = height + heightOffset;
                }
            }
            if (isCheckVertical) {
                const [
                    widthOffset,
                ] = solveNextOffset(
                    fixedPos, otherPos,
                    (fixedPos[0] < otherPos[0] ? right : left) - otherPos[0],
                    true, datas,
                );
                if (!isNaN(widthOffset)) {
                    maxWidth = width + widthOffset;
                }
            }
        });
    }
    return {
        maxWidth,
        maxHeight,
    };
}
function getSnapBoundInfo(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    poses: number[][],
    directions: number[][][],
    datas: any,
) {
    return directions.map(([startDirection, endDirection]) => {
        const otherStartPos = getPosByDirection(poses, startDirection);
        const otherEndPos = getPosByDirection(poses, endDirection);

        const {
            horizontal: {
                dist: otherHorizontalDist,
                offset: otherHorizontalOffset,
                isBound: isOtherHorizontalBound,
                isSnap: isOtherHorizontalSnap,
            },
            vertical: {
                dist: otherVerticalDist,
                offset: otherVerticalOffset,
                isBound: isOtherVerticalBound,
                isSnap: isOtherVerticalSnap,
            },
        } = checkSnapBounds(moveable, [otherEndPos]);
        const multiple = minus(endDirection, startDirection);

        if (!otherVerticalOffset && !otherHorizontalOffset) {
            return {
                isBound: isOtherVerticalBound || isOtherHorizontalBound,
                isSnap: isOtherVerticalSnap || isOtherHorizontalSnap,
                sign: multiple,
                offset: [0, 0],
            };
        }
        const isVertical = otherHorizontalDist < otherVerticalDist;
        const sizeOffset = solveNextOffset(
            otherStartPos,
            otherEndPos,
            isVertical ? otherVerticalOffset : otherHorizontalOffset,
            isVertical,
            datas,
        ).map((size, i) => size * (multiple[i] ? 2 / multiple[i] : 0));

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
    keepRatio: boolean,
) {
    const directions: number[][][] = [];
    const fixedDirection = [-direction[0], -direction[1]];

    if (direction[0] && direction[1]) {
        directions.push(
            [fixedDirection, [direction[0], -direction[1]]],
            [fixedDirection, [-direction[0], direction[1]]],
        );
        if (keepRatio) {
            // pass two direction condition
            directions.push(
                [fixedDirection, direction],
            );
        }
    } else if (direction[0]) {
        // vertcal
        directions.push(
            [[fixedDirection[0], -1], [direction[0], -1]],
            [[fixedDirection[0], 0], [direction[0], 0]],
            [[fixedDirection[0], 1], [direction[0], 1]],
        );
        if (keepRatio) {
            directions.push(
                [fixedDirection, [fixedDirection[0], -1]],
                [fixedDirection, [fixedDirection[0], 1]],
                [direction, [direction[0], -1]],
                [direction, [direction[0], 1]],
            );
        }
    } else if (direction[1]) {
        // horizontal
        directions.push(
            [[-1, fixedDirection[1]], [-1, direction[1]]],
            [[0, fixedDirection[1]], [0, direction[1]]],
            [[1, fixedDirection[1]], [1, direction[1]]],
        );
        if (keepRatio) {
            directions.push(
                [fixedDirection, [-1, fixedDirection[1]]],
                [fixedDirection, [1, fixedDirection[1]]],
                [direction, [-1, direction[1]]],
                [direction, [1, direction[1]]],
            );
        }
    } else {
        // [0, 0] to all direction
        directions.push(
            [fixedDirection, [1, 0]],
            [fixedDirection, [-1, 0]],
            [fixedDirection, [0, -1]],
            [fixedDirection, [0, 1]],

            [[1, 0], [1, -1]],
            [[1, 0], [1, 1]],
            [[0, 1], [1, 1]],
            [[0, 1], [-1, 1]],

            [[-1, 0], [-1, -1]],
            [[-1, 0], [-1, 1]],
            [[0, -1], [1, -1]],
            [[0, -1], [-1, -1]],
        );
    }

    return directions;
}
export function getSizeOffsetInfo(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    poses: number[][],
    direction: number[],
    keepRatio: boolean,
    datas: any,
) {
    const directions = getCheckSnapDirections(direction, keepRatio);
    const lines = getCheckSnapLines(poses, direction, keepRatio);
    const offsets = [
        ...getSnapBoundInfo(moveable, poses, directions, datas),
        ...getInnerBoundInfo(moveable, lines, getPosByDirection(poses, [0, 0]), datas),
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
    moveable: MoveableManager<SnappableProps, SnappableState>,
    matrix: number[],
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    fixedPos: number[],
    direction: number[],
    is3d: boolean,
    datas: any,
) {
    const poses = getNextFixedPoses(
        matrix,
        width,
        height,
        fixedPos,
        direction,
        is3d,
    );

    const snapPos = getPosByDirection(poses, direction);

    const {
        horizontal: {
            offset: horizontalOffset,
        },
        vertical: {
            offset: verticalOffset,
        },
    } = checkSnapBounds(moveable, [snapPos]);

    if (verticalOffset || horizontalOffset) {
        const [nextWidthOffset, nextHeightOffset] = getDragDist({
            datas,
            distX: -verticalOffset,
            distY: -horizontalOffset,
        });

        const nextWidth
            = Math.min(maxWidth || Infinity, width + direction[0] * nextWidthOffset);
        const nextHeight
            = Math.min(maxHeight || Infinity, height + direction[1] * nextHeightOffset);

        return [
            nextWidth - width,
            nextHeight - height,
        ];
    }
    return [
        0,
        0,
    ];
}
export function checkSizeDist(
    moveable: MoveableManager<any, any>,
    matrix: number[],
    width: number,
    height: number,
    direction: number[],
    snapDirection: number[],
    fixedPos: number[],
    isRequest: boolean,
    is3d: boolean,
    datas: any,
) {
    const poses = getAbsolutePosesByState(moveable.state);
    const keepRatio = moveable.props.keepRatio;

    let widthOffset = 0;
    let heightOffset = 0;

    for (let i = 0; i < 2; ++i) {
        const nextPoses = getNextFixedPoses(
            matrix,
            width + widthOffset,
            height + heightOffset,
            fixedPos,
            direction,
            is3d,
        );
        const {
            width: widthOffsetInfo,
            height: heightOffsetInfo,
        } = getSizeOffsetInfo(
            moveable,
            nextPoses,
            direction,
            keepRatio,
            datas,
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
            const widthDist = Math.abs(nextWidthOffset) * (width ? 1 / width : 1);
            const heightDist = Math.abs(nextHeightOffset) * (height ? 1 / height : 1);
            const isGetWidthOffset
                = isWidthBound && isHeightBound ? widthDist < heightDist
                    : isHeightBound || (!isWidthBound && widthDist < heightDist);

            // height * widthOffset = width * heighOffset
            if (isGetWidthOffset) {
                // width : height = ? : heightOffset
                nextWidthOffset = width * nextHeightOffset / height;
            } else {
                // width : height = widthOffset : ?
                nextHeightOffset = height * nextWidthOffset / width;
            }
        }
        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    if (direction[0] && direction[1]) {
        const {
            maxWidth,
            maxHeight,
        } = checkMaxBounds(moveable, width, height, poses, direction, fixedPos, datas);

        const [nextWidthOffset, nextHeightOffset] = recheckSizeByTwoDirection(
            moveable,
            matrix,
            width + widthOffset,
            height + heightOffset,
            maxWidth,
            maxHeight,
            fixedPos,
            direction,
            is3d,
            datas,
        );

        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    return [
        widthOffset,
        heightOffset,
    ];
}

export function isBoundRotate(
    relativePoses: number[][],
    boundRect: { left: number, top: number, right: number, bottom: number },
    rad: number,
) {
    const nextPoses = rad ? relativePoses.map(pos => rotate(pos, rad)) : relativePoses;

    return nextPoses.some(pos => {
        return (pos[0] < boundRect.left && Math.abs(pos[0] - boundRect.left) > 0.1)
            || (pos[0] > boundRect.right && Math.abs(pos[0] - boundRect.right) > 0.1)
            || (pos[1] < boundRect.top && Math.abs(pos[1] - boundRect.top) > 0.1)
            || (pos[1] > boundRect.bottom && Math.abs(pos[1] - boundRect.bottom) > 0.1);
    });
}
export function boundRotate(
    vec: number[],
    boundPos: number,
    index: number,
) {
    const r = getDistSize(vec);
    const nextPos = Math.sqrt(r * r - boundPos * boundPos) || 0;

    return [nextPos, -nextPos].sort((a, b) => {
        return Math.abs(a - vec[index ? 0 : 1]) - Math.abs(b - vec[index ? 0 : 1]);
    }).map(pos => {
        return getRad([0, 0], index ? [pos, boundPos] : [boundPos, pos]);
    });
}
export function checkSnapRotate(
    moveable: MoveableManager<SnappableProps & RotatableProps, any>,
    rect: RectInfo,
    origin: number[],
    rotation: number,
) {
    const bounds = moveable.props.bounds;

    if (!bounds || !hasGuidelines(moveable, "resizable")) {
        return rotation;
    }
    const {
        left = -Infinity,
        top = -Infinity,
        right = Infinity,
        bottom = Infinity,
    } = bounds;
    const {
        pos1,
        pos2,
        pos3,
        pos4,
    } = rect;

    const rad = rotation * Math.PI / 180;
    const relativeLeft = left - origin[0];
    const relativeRight = right - origin[0];
    const relativeTop = top - origin[1];
    const relativeBottom = bottom - origin[1];
    const boundRect = {
        left: relativeLeft,
        top: relativeTop,
        right: relativeRight,
        bottom: relativeBottom,
    };
    const relativePoses = [pos1, pos2, pos3, pos4].map(pos => minus(pos, origin));
    const nextPoses = relativePoses.map(pos => rotate(pos, rad));

    if (!isBoundRotate(nextPoses, boundRect, 0)) {
        return rotation;
    }
    const canBounds: Array<[number[], number, number]> = [];
    nextPoses.forEach(nextPos => {
        canBounds.push([nextPos, relativeLeft, 0]);
        canBounds.push([nextPos, relativeRight, 0]);
        canBounds.push([nextPos, relativeTop, 1]);
        canBounds.push([nextPos, relativeBottom, 1]);
    });
    const length = canBounds.length;
    const relativeRotation = rotation % 360;

    const result: number[] = [];
    for (let i = 0; i < length; ++i) {
        const [vec, boundPos, index] = canBounds[i];
        const relativeRad1 = getRad([0, 0], vec);

        result.push(...boundRotate(vec, boundPos, index)
            .map(relativeRad2 => rad + relativeRad2 - relativeRad1)
            .filter(nextRad => !isBoundRotate(relativePoses, boundRect, nextRad))
            .map(nextRad => throttle(nextRad * 180 / Math.PI, TINY_NUM)));
    }
    if (result.length) {
        result.sort((a, b) => Math.abs(a - rotation) - Math.abs(b - rotation));

        return result[0];
    }
    return rotation;
}
export function checkSnapSize(
    moveable: MoveableManager<any, any>,
    width: number,
    height: number,
    direction: number[],
    fixedPos: number[],
    isRequest: boolean,
    datas: any,
) {
    if (!hasGuidelines(moveable, "resizable")) {
        return [0, 0];
    }
    const {
        matrix,
        is3d,
    } = moveable.state;
    return checkSizeDist(moveable, matrix, width, height, direction, direction, fixedPos, isRequest, is3d, datas);
}
export function checkSnapScale(
    moveable: MoveableManager<ScalableProps, any>,
    scale: number[],
    direction: number[],
    snapDirection: number[],
    fixedPos: number[],
    isRequest: boolean,
    datas: any,
) {
    const {
        width,
        height,
    } = datas;
    const keepRatio = moveable.props.keepRatio;

    if (keepRatio) {
        const fixedScale = Math.abs(scale[0]) < Math.abs(scale[1]) ? scale[1] : scale[0];

        scale = [fixedScale, fixedScale];
    }

    if (!hasGuidelines(moveable, "scalable")) {
        return [0, 0];
    }

    const sizeDist = checkSizeDist(
        moveable,
        scaleMatrix(datas, scale),
        width, height,
        direction,
        snapDirection,
        fixedPos,
        isRequest,
        datas.is3d,
        datas,
    );

    return [
        sizeDist[0] / width,
        sizeDist[1] / height,
    ];
}
export function solveEquation(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean,
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
    moveable: MoveableManager<any, any>,
    datas: any,
) {
    datas.absolutePoses = getAbsolutePosesByState(moveable.state);
}

export function checkThrottleDragRotate(
    throttleDragRotate: number,
    [distX, distY]: number[],
    [isVerticalBound, isHorizontalBound]: boolean[],
    [isVerticalSnap, isHorizontalSnap]: boolean[],
    [verticalOffset, horizontalOffset]: number[],
) {
    let offsetX = -verticalOffset;
    let offsetY = -horizontalOffset;

    if (throttleDragRotate && distX && distY) {
        offsetX = 0;
        offsetY = 0;
        const adjustPoses = [];
        if (isVerticalBound && isHorizontalBound) {
            adjustPoses.push(
                [0, horizontalOffset],
                [verticalOffset, 0],
            );
        } else if (isVerticalBound) {
            adjustPoses.push(
                [verticalOffset, 0],
            );
        } else if (isHorizontalBound) {
            adjustPoses.push(
                [0, horizontalOffset],
            );
        } else if (isVerticalSnap && isHorizontalSnap) {
            adjustPoses.push(
                [0, horizontalOffset],
                [verticalOffset, 0],
            );
        } else if (isVerticalSnap) {
            adjustPoses.push(
                [verticalOffset, 0],
            );
        } else if (isHorizontalSnap) {
            adjustPoses.push(
                [0, horizontalOffset],
            );
        }
        if (adjustPoses.length) {
            adjustPoses.sort((a, b) => {
                return getDistSize(minus([distX, distY], a)) - getDistSize(minus([distX, distY], b));
            });
            const adjustPos = adjustPoses[0];

            if (adjustPos[0] && Math.abs(distX) > TINY_NUM) {
                offsetX = -adjustPos[0];
                offsetY = distY * Math.abs(distX + offsetX) / Math.abs(distX) - distY;
            } else if (adjustPos[1] && Math.abs(distY) > TINY_NUM) {
                const prevDistY = distY;
                offsetY = -adjustPos[1];
                offsetX = distX * Math.abs(distY + offsetY) / Math.abs(prevDistY) - distX;
            }
            if (throttleDragRotate && isHorizontalBound && isVerticalBound) {
                if (Math.abs(offsetX) > TINY_NUM && Math.abs(offsetX) < Math.abs(verticalOffset)) {
                    const scale = Math.abs(verticalOffset) / Math.abs(offsetX);

                    offsetX *= scale;
                    offsetY *= scale;
                } else if (Math.abs(offsetY) > TINY_NUM && Math.abs(offsetY) < Math.abs(horizontalOffset)) {
                    const scale = Math.abs(horizontalOffset) / Math.abs(offsetY);

                    offsetX *= scale;
                    offsetY *= scale;
                } else {
                    offsetX = maxOffset(-verticalOffset, offsetX);
                    offsetY = maxOffset(-horizontalOffset, offsetY);
                }
            }
        }
    } else {
        offsetX = (distX || isVerticalBound) ? -verticalOffset : 0;
        offsetY = (distY || isHorizontalBound) ? -horizontalOffset : 0;
    }
    return [offsetX, offsetY];
}
export function checkSnapDrag(
    moveable: MoveableManager<SnappableProps & DraggableProps, any>,
    distX: number,
    distY: number,
    throttleDragRotate: number,
    datas: any,
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
    const poses = getAbsolutePoses(
        datas.absolutePoses,
        [distX, distY],
    );
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
    } = checkSnapBounds(moveable, snapPoses, poses);
    const {
        vertical: verticalInnerBoundInfo,
        horizontal: horizontalInnerBoundInfo,
    } = getInnerBoundDragInfo(moveable, poses, datas);

    const isVerticalSnap = verticalSnapBoundInfo.isSnap;
    const isHorizontalSnap = horizontalSnapBoundInfo.isSnap;
    const isVerticalBound
        = verticalSnapBoundInfo.isBound
        || verticalInnerBoundInfo.isBound;
    const isHorizontalBound
        = horizontalSnapBoundInfo.isBound
        || horizontalInnerBoundInfo.isBound;
    const verticalOffset = maxOffset(verticalSnapBoundInfo.offset, verticalInnerBoundInfo.offset);
    const horizontalOffset = maxOffset(horizontalSnapBoundInfo.offset, horizontalInnerBoundInfo.offset);
    const [offsetX, offsetY] = checkThrottleDragRotate(
        throttleDragRotate,
        [distX, distY],
        [isVerticalBound, isHorizontalBound],
        [isVerticalSnap, isHorizontalSnap],
        [verticalOffset, horizontalOffset],
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
    const guidelines: Guideline[] = [];

    posInfos.forEach(posInfo => {
        posInfo.guidelineInfos.forEach(({ guideline }) => {
            if (guidelines.indexOf(guideline) > -1) {
                return;
            }
            guidelines.push(guideline);
        });
    });

    return guidelines;
}

function getElementGuidelineDist(
    elementPos: number,
    elementSize: number,
    targetPos: number,
    targetSize: number,
) {
    // relativePos < 0  => element(l)  ---  (r)target
    // relativePos > 0  => target(l)   ---  (r)element
    const relativePos = elementPos - targetPos;
    const startPos = relativePos < 0 ? relativePos + elementSize : targetSize;
    const endPos = relativePos < 0 ? 0 : relativePos;
    const size = endPos - startPos;

    return {
        size,
        pos: startPos,
    };
}
function groupByElementGuidelines(
    guidelines: Guideline[],
    clientPos: number,
    size: number,
    index: number,
) {
    const groupInfos: Array<[Element, number, any]> = [];

    const group = groupBy(guidelines.filter(({ element }) => element), ({ element, pos, size: size2 }) => {
        const elementPos = pos[index];
        const sign = Math.min(0, elementPos - clientPos) < 0 ? -1 : 1;
        const groupKey = `${sign}_${pos[index ? 0 : 1]}`;
        const groupInfo = find(groupInfos, ([groupElement, groupPos]) => {
            return element === groupElement && elementPos === groupPos;
        });
        if (groupInfo) {
            return groupInfo[2];
        }
        groupInfos.push([element!, elementPos, groupKey]);
        return groupKey;
    });
    group.forEach(elementGuidelines => {
        elementGuidelines.sort((a, b) => {
            const result = getElementGuidelineDist(a.pos[index], a.size, clientPos, size).size
                - getElementGuidelineDist(b.pos[index], a.size, clientPos, size).size;

            return result || a.pos[index ? 0 : 1] - b.pos[index ? 0 : 1];
        });
    });
    return group;
}
function renderElementGroup(
    group: Guideline[][],
    [directionName, posName1, posName2, sizeName]: readonly [string, string, string, string],
    minPos: number,
    clientPos: number,
    clientSize: number,
    targetPos: number,
    snapThreshold: number,
    isDisplaySnapDigit: boolean,
    snapDigit: number,
    index: number,
    React: Renderer,
) {
    return flat(group.map((elementGuidelines, i) => {
        let isFirstRenderSize = true;

        return elementGuidelines.map(({ pos, size }, j) => {
            const {
                pos: linePos,
                size: lineSize,
            } = getElementGuidelineDist(pos[index], size, clientPos, clientSize);

            if (lineSize < snapThreshold) {
                return null;
            }
            const isRenderSize = isFirstRenderSize;

            isFirstRenderSize = false;
            const snapSize = isDisplaySnapDigit && isRenderSize ? parseFloat(lineSize.toFixed(snapDigit)) : 0;

            return <div className={prefix(
                "line",
                directionName,
                "guideline",
                "dashed",
            )}
                data-size={snapSize > 0 ? snapSize : ""}
                key={`${directionName}LinkGuidline${i}-${j}`} style={{
                    [posName1]: `${minPos + linePos}px`,
                    [posName2]: `${-targetPos + pos[index ? 0 : 1]}px`,
                    [sizeName]: `${lineSize}px`,
                }} />;
        });
    }));
}
function renderSnapPoses(
    snapPoses: number[],
    [directionName, posName1, posName2, sizeName]: readonly [string, string, string, string],
    minPos: number,
    targetPos: number,
    size: number,
    React: Renderer,
) {
    return snapPoses.map((pos, i) => {
        return <div className={prefix(
            "line",
            directionName,
            "guideline",
            "target",
            "bold",
        )} key={`${directionName}TargetGuidline${i}`} style={{
            [posName1]: `${minPos}px`,
            [posName2]: `${-targetPos + pos}px`,
            [sizeName]: `${size}px`,
        }} />;
    });
}
function renderGuidelines(
    guidelines: Guideline[],
    [directionName, posName1, posName2, sizeName]: readonly [string, string, string, string],
    minPos: number,
    clientPos: number,
    targetPos: number,
    index: number,
    React: Renderer,
) {
    return guidelines.map((guideline, i) => {
        const { pos, size, element } = guideline;

        return <div className={prefix(
            "line",
            directionName,
            "guideline",
            element ? "bold" : "",
        )} key={`${directionName}Guidline${i}`} style={{
            [posName1]: `${minPos - clientPos + pos[index]}px`,
            [posName2]: `${-targetPos + pos[index ? 0 : 1]}px`,
            [sizeName]: `${size}px`,
        }} />;
    });
}
export default {
    name: "snappable",
    props: {
        snappable: [Boolean, Array],
        snapCenter: Boolean,
        snapHorizontal: Boolean,
        snapVertical: Boolean,
        snapElement: Boolean,
        isDisplaySnapDigit: Boolean,
        snapDigit: Number,
        snapThreshold: Number,
        horizontalGuidelines: Array,
        verticalGuidelines: Array,
        elementGuidelines: Array,
        bounds: Object,
        innerBounds: Object,
    } as const,
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const {
            top: targetTop,
            left: targetLeft,
            pos1, pos2, pos3, pos4,
            snapRenderInfo,
            targetClientRect,
            containerClientRect,
        } = moveable.state;

        const clientLeft = targetClientRect.left - containerClientRect.left;
        const clientTop = targetClientRect.top - containerClientRect.top;
        const minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);

        if (!snapRenderInfo || !hasGuidelines(moveable, "")) {
            return [];
        }
        const {
            snapThreshold = 5,
            snapDigit = 0,
            isDisplaySnapDigit = true,
        } = moveable.props;
        const poses = getAbsolutePosesByState(moveable.state);
        const { width, height, top, left, bottom, right } = getRect(poses);
        const verticalSnapPoses: number[] = [];
        const horizontalSnapPoses: number[] = [];
        const verticalGuildelines: Guideline[] = [];
        const horizontalGuidelines: Guideline[] = [];
        const snapInfos: Array<{ vertical: SnapInfo, horizontal: SnapInfo }> = [];

        if (snapRenderInfo.direction) {
            snapInfos.push(getSnapInfosByDirection(moveable, poses, snapRenderInfo.direction));
        }
        if (snapRenderInfo.snap) {
            const rect = getRect(poses);

            if (snapRenderInfo.center) {
                (rect as any).middle = (rect.top + rect.bottom) / 2;
                (rect as any).center = (rect.left + rect.right) / 2;
            }
            snapInfos.push(checkSnaps(moveable, rect, true, 1));
        }
        snapInfos.forEach(snapInfo => {
            const {
                vertical: {
                    posInfos: verticalPosInfos,
                },
                horizontal: {
                    posInfos: horizontalPosInfos,
                },
            } = snapInfo;
            verticalSnapPoses.push(...verticalPosInfos.map(posInfo => posInfo.pos));
            horizontalSnapPoses.push(...horizontalPosInfos.map(posInfo => posInfo.pos));
            verticalGuildelines.push(...getSnapGuidelines(verticalPosInfos));
            horizontalGuidelines.push(...getSnapGuidelines(horizontalPosInfos));
        });
        const {
            vertical: {
                isBound: isVerticalBound,
                pos: verticalBoundPos,
            },
            horizontal: {
                isBound: isHorizontalBound,
                pos: horizontalBoundPos,
            },
        } = checkBounds(moveable, [left, right], [top, bottom]);

        if (isVerticalBound && verticalSnapPoses.indexOf(verticalBoundPos) < 0) {
            verticalSnapPoses.push(verticalBoundPos);
        }
        if (isHorizontalBound && horizontalSnapPoses.indexOf(horizontalBoundPos) < 0) {
            horizontalSnapPoses.push(horizontalBoundPos);
        }

        const elementHorizontalGroup = groupByElementGuidelines(
            horizontalGuidelines,
            clientLeft,
            width,
            0,
        );
        const elementVerticalGroup = groupByElementGuidelines(
            verticalGuildelines,
            clientTop,
            height,
            1,
        );
        const horizontalNames = ["horizontal", "left", "top", "width"] as const;
        const verticalNames = ["vertical", "top", "left", "height"] as const;
        return [
            ...renderElementGroup(
                elementHorizontalGroup,
                horizontalNames,
                minLeft,
                clientLeft,
                width,
                targetTop,
                snapThreshold,
                isDisplaySnapDigit,
                snapDigit,
                0,
                React,
            ),
            ...renderElementGroup(
                elementVerticalGroup,
                verticalNames,
                minTop,
                clientTop,
                height,
                targetLeft,
                snapThreshold,
                isDisplaySnapDigit,
                snapDigit,
                1,
                React,
            ),
            ...renderSnapPoses(
                horizontalSnapPoses,
                horizontalNames,
                minLeft,
                targetTop,
                width,
                React,
            ),
            ...renderSnapPoses(
                verticalSnapPoses,
                verticalNames,
                minTop,
                targetLeft,
                height,
                React,
            ),
            ...renderGuidelines(
                horizontalGuidelines,
                horizontalNames,
                minLeft,
                clientLeft,
                targetTop,
                0,
                React,
            ),
            ...renderGuidelines(
                verticalGuildelines,
                verticalNames,
                minTop,
                clientTop,
                targetLeft,
                1,
                React,
            ),
        ];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapRenderInfo = {
            snap: true,
            center: true,
        };
        snapStart(moveable);
    },
    pinchStart(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragControlCondition(e: any) {
        return directionCondition(e) || rotatableDragControlCondtion(e);
    },
    dragControlStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroupEnd(moveable: any) {
        this.unset(moveable);
    },
    dragGroupControlStart(moveable: any, e: any) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragGroupControlEnd(moveable: any) {
        this.unset(moveable);
    },
    unset(moveable: any) {
        const state = moveable.state;

        state.enableSnap = false;
        state.guidelines = [];
        state.snapRenderInfo = null;
    },
};
