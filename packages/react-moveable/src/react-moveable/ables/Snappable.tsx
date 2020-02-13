import MoveableManager from "../MoveableManager";
import {
    Renderer,
    SnappableProps,
    SnappableState, Guideline,
    SnapInfo, BoundInfo,
    ScalableProps, ResizableProps, SnapPosInfo, RotatableProps, RectInfo, BoundType,
} from "../types";
import {
    prefix, caculatePoses, getRect,
    getAbsolutePosesByState, getAbsolutePoses, selectValue, throttle, roundSign, getDistSize, groupBy, flat, maxOffset,
} from "../utils";
import { IObject, find } from "@daybrush/utils";
import {
    getPosByReverseDirection, getPosesByDirection,
    getDragDist, scaleMatrix, getPosByDirection,
} from "../DraggerUtils";
import { minus, rotate, getRad, average } from "@moveable/matrix";
import {
    dragControlCondition as rotatableDragControlCondtion,
} from "./Rotatable";
import { TINY_NUM } from "../consts";
import { directionCondition } from "./utils";

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
function checkBounds(
    moveable: MoveableManager<SnappableProps>,
    verticalPoses: number[],
    horizontalPoses: number[],
) {
    const {
        left = -Infinity,
        top = -Infinity,
        right = Infinity,
        bottom = Infinity,
    } = moveable.props.bounds || {};
    const bounds = { left, top, right, bottom };

    return {
        vertical: checkBound(bounds, verticalPoses, true),
        horizontal: checkBound(bounds, horizontalPoses, false),
    };
}
function checkBound(
    bounds: Required<BoundType>,
    poses: number[],
    isVertical: boolean,
): BoundInfo {
    // 0   [100 - 200]  300
    const startBoundPos = bounds[isVertical ? "left" : "top"];
    const endBoundPos = bounds[isVertical ? "right" : "bottom"];

    // 450
    const minPos = Math.min(...poses);
    const maxPos = Math.max(...poses);

    if (startBoundPos + 1 > minPos) {
        return {
            isBound: true,
            offset: minPos - startBoundPos,
            pos: startBoundPos,
        };
    }
    if (endBoundPos - 1 < maxPos) {
        return {
            isBound: true,
            offset: maxPos - endBoundPos,
            pos: endBoundPos,
        };
    }

    return {
        isBound: false,
        offset: 0,
        pos: 0,
    };
}
function isStartLine(dot: number[], line: number[][]) {
    // l    o     => true
    // o    l    => false
    const cx = average(line[0][0], line[1][0]);
    const cy = average(line[0][1], line[1][1]);

    return {
        vertical: cx <= dot[0],
        horizontal: cy <= dot[1],
    };
}
function checkInnerBoundDot(pos: number, start: number, end: number, isStart: boolean) {
    if ((isStart && start <= pos) || (!isStart && pos <= end)) {
        // false 402 565 602 => 37 ([0, 37])
        // true 400 524.9712603540036 600 => 124 ([124, 0])
        // true 400 410 600 => 10 ([10, 0])
        return {
            isBound: true,
            offset: isStart ? start - pos : end - pos,
        };
    }
    return {
        isBound: false,
        offset: 0,
    };
}
function checkLineBoundCollision(line: number[][], boundLine: number[][], isStart: boolean) {
    const dot1 = line[0];
    const dot2 = line[1];
    const boundDot1 = boundLine[0];
    const boundDot2 = boundLine[1];
    const dy1 = dot2[1] - dot1[1];
    const dx1 = dot2[0] - dot1[0];

    const dy2 = boundDot2[1] - boundDot1[1];
    const dx2 = boundDot2[0] - boundDot1[0];

    // dx2 or dy2 is zero
    if (!dx2) {
        // vertical
        if (dx1) {
            const y = dy1 ? dy1 / dx1 * (boundDot1[0] - dot1[0]) + dot1[1] : dot1[1];

            // boundDot1[1] <= y  <= boundDot2[1]
            return checkInnerBoundDot(y, boundDot1[1], boundDot2[1], isStart);
        }
    } else if (!dy2) {
        // horizontal

        if (dy1) {
            // y = a * (x - x1) + y1
            // x = (y - y1) / a + x1
            const a = dy1 / dx1;
            const x = dx1 ? (boundDot1[1] - dot1[1]) / a + dot1[0] : dot1[0];

            // boundDot1[0] <= x && x <= boundDot2[0]
            return checkInnerBoundDot(x, boundDot1[0], boundDot2[0], isStart);
        }
    }
    return {
        isBound: false,
        offset: 0,
    };
}
function checkInnerBounds(
    moveable: MoveableManager<SnappableProps>,
    lines: number[][][],
    center: number[],
) {

    const bounds = moveable.props.innerBounds;

    if (!bounds) {
        return {
            isBound: false,
            offset: [0, 0],
        };
    }
    const { left, top, width, height } = bounds;
    const leftLine = [[left, top], [left, top + height]];
    const topLine = [[left, top], [left + width, top]];
    const rightLine = [[left + width, top], [left + width, top + height]];
    const bottomLine = [[left, top + height], [left + width, top + height]];
    const boundInfos = lines.map(line => {
        const {
            horizontal: isHorizontalStart,
            vertical: isVerticalStart,
        } = isStartLine(center, line);

        // test vertical
        const topBoundInfo = checkLineBoundCollision(line, topLine, isVerticalStart);
        const bottomBoundInfo = checkLineBoundCollision(line, bottomLine, isVerticalStart);

        // test horizontal
        const leftBoundInfo = checkLineBoundCollision(line, leftLine, isHorizontalStart);
        const rightBoundInfo = checkLineBoundCollision(line, rightLine, isHorizontalStart);

        return {
            vertical: {
                isBound: topBoundInfo.isBound || bottomBoundInfo.isBound,
                offset: maxOffset(topBoundInfo.offset, bottomBoundInfo.offset),
            },
            horizontal: {
                isBound: leftBoundInfo.isBound || rightBoundInfo.isBound,
                offset: maxOffset(leftBoundInfo.offset, rightBoundInfo.offset),
            },
        };
    });
    const isVerticalBound = boundInfos.some(({ vertical }) => vertical.isBound);
    const isHorizontalBound = boundInfos.some(({ horizontal }) => horizontal.isBound);
    const horizontalOffset = maxOffset(...boundInfos.map(({ horizontal }) => horizontal.offset));
    const verticalOffset = maxOffset(...boundInfos.map(({ vertical }) => vertical.offset));

    let offset = [0, 0];
    let isBound = false;

    if (Math.abs(horizontalOffset) < Math.abs(verticalOffset)) {
        offset = [verticalOffset, 0];
        isBound = isVerticalBound;
    } else {
        offset = [0, horizontalOffset];
        isBound = isHorizontalBound;
    }

    return {
        isBound,
        offset,
    };
}

function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    snapCenter: boolean,
    snapElement: boolean,
): SnapInfo {
    if (!guidelines || !guidelines.length) {
        return {
            isSnap: false,
            posInfos: [],
        };
    }
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPosInfos = targetPoses.map(targetPos => {
        const guidelineInfos = guidelines.map(guideline => {
            const { pos } = guideline;
            const offset = targetPos - pos[posType];

            return {
                offset,
                dist: Math.abs(offset),
                guideline,
            };
        }).filter(({ guideline, dist }) => {
            const { type, center, element } = guideline;
            if (
                (!snapElement && element)
                || (!snapCenter && center)
                || type !== targetType
                || dist > snapThreshold
            ) {
                return false;
            }
            return true;
        }).sort(
            (a, b) => a.dist - b.dist,
        );

        return {
            pos: targetPos,
            guidelineInfos,
        };
    }).filter(snapPosInfo => {
        return snapPosInfo.guidelineInfos.length > 0;
    }).sort((a, b) => {
        return a.guidelineInfos[0].dist - b.guidelineInfos[0].dist;
    });

    return {
        isSnap: snapPosInfos.length > 0,
        posInfos: snapPosInfos,
    };
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

export function checkSnapPoses(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    snapCenter?: boolean,
    customSnapThreshold?: number,
) {
    const {
        guidelines,
        containerClientRect: {
            height: containerHeight,
            width: containerWidth,
        },
    } = moveable.state;
    const props = moveable.props;
    const snapThreshold = selectValue<number>(customSnapThreshold, props.snapThreshold, 5);
    const {
        snapElement = true,
        snapHorizontal = true,
        snapVertical = true,
        verticalGuidelines,
        horizontalGuidelines,
    } = props;

    const totalGuidelines = [...guidelines];

    if (snapHorizontal && horizontalGuidelines) {
        horizontalGuidelines!.forEach(pos => {
            totalGuidelines.push({ type: "horizontal", pos: [0, throttle(pos, 0.1)], size: containerWidth });
        });
    }
    if (snapVertical && verticalGuidelines) {
        verticalGuidelines!.forEach(pos => {
            totalGuidelines.push({ type: "vertical", pos: [throttle(pos, 0.1), 0], size: containerHeight });
        });
    }
    return {
        vertical: checkSnap(
            totalGuidelines,
            "vertical", posesX, snapThreshold,
            snapCenter!,
            snapElement,
        ),
        horizontal: checkSnap(
            totalGuidelines,
            "horizontal", posesY, snapThreshold,
            snapCenter!,
            snapElement,
        ),
    };
}
export function checkSnaps(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    rect: {
        left?: number,
        top?: number,
        bottom?: number,
        right?: number,
        center?: number,
        middle?: number,
    },
    isCenter: boolean,
    customSnapThreshold?: number,
) {
    const snapCenter = moveable.props.snapCenter;
    const isSnapCenter = snapCenter! && isCenter;

    let verticalNames: Array<"left" | "center" | "right"> = ["left", "right"];
    let horizontalNames: Array<"top" | "middle" | "bottom"> = ["top", "bottom"];

    if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
    }
    verticalNames = verticalNames.filter(name => name in rect);
    horizontalNames = horizontalNames.filter(name => name in rect);

    return checkSnapPoses(
        moveable,
        verticalNames.map(name => rect[name]!),
        horizontalNames.map(name => rect[name]!),
        isSnapCenter,
        customSnapThreshold,
    );
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
function getFixedPoses(
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
export function getNearestSnapGuidelineInfo(
    snapInfo: SnapInfo,
) {
    const isSnap = snapInfo.isSnap;

    if (!isSnap) {
        return {
            isSnap: false,
            offset: 0,
            dist: -1,
            pos: 0,
            guideline: null,
        };
    }
    const posInfo = snapInfo.posInfos[0];
    const guidelineInfo = posInfo!.guidelineInfos[0];
    const offset = guidelineInfo!.offset;
    const dist = guidelineInfo!.dist;
    const guideline = guidelineInfo!.guideline;

    return {
        isSnap,
        offset,
        dist,
        pos: posInfo!.pos,
        guideline,
    };
}
function getSnapOffset(boundInfo: BoundInfo, snapInfo: SnapInfo) {
    if (boundInfo.isBound) {
        return boundInfo.offset;
    } else if (snapInfo.isSnap) {
        return getNearestSnapGuidelineInfo(snapInfo).offset;
    }
    return 0;
}
export function checkSnapBounds(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    pos: number[],
) {
    const {
        horizontal: horizontalBoundInfo,
        vertical: verticalBoundInfo,
    } = checkBounds(
        moveable,
        [pos[0]],
        [pos[1]],
    );
    const {
        horizontal: horizontalSnapInfo,
        vertical: verticalSnapInfo,
    } = checkSnapPoses(
        moveable,
        [pos[0]],
        [pos[1]],
    );

    const horizontalOffset = getSnapOffset(horizontalBoundInfo, horizontalSnapInfo);
    const verticalOffset = getSnapOffset(verticalBoundInfo, verticalSnapInfo);

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
        } = checkSnapBounds(moveable, otherEndPos);
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
        ).map((size, i) => size * (multiple[i] ?  2 / multiple[i] : 0));

        return {
            sign: multiple,
            isBound: isVertical ? isOtherVerticalBound : isOtherHorizontalBound,
            isSnap: isVertical ? isOtherVerticalSnap : isOtherHorizontalSnap,
            offset: sizeOffset,
        };
    });
}
function getInnerBoundInfo(
    moveable: MoveableManager<SnappableProps>,
    lines: number[][][],
    center: number[],
    datas: any,
) {
    return lines.map(([multiple, pos1, pos2]) => {
        const {
            isBound,
            offset,
        } = checkInnerBounds(moveable, [[pos1, pos2]], center);

        const sizeOffset = getDragDist({
            datas,
            distX: offset[0],
            distY: offset[1],
        }).map((size, i) => size * (multiple[i] ?  2 / multiple[i] : 0));

        return {
            sign: multiple,
            isBound,
            isSnap: false,
            offset: sizeOffset,
        };
    });
}
export function getNearOffsetInfo(
    offsets: Array<{ offset: number[], isBound: boolean, isSnap: boolean, sign: number[] }>,
    index: number,
) {
    return offsets.slice().sort((a, b) => {
        const aSign = a.sign[index];
        const bSign = b.sign[index];
        const aOffset = a.offset[index];
        const bOffset = b.offset[index];
        const aDist = Math.abs(aOffset);
        const bDist = Math.abs(bOffset);
        // -1 The positions of a and b do not change.
        // 1 The positions of a and b are reversed.
        if (!aSign) {
            return 1;
        } else if (!bSign) {
            return -1;
        } else if (a.isBound && b.isBound) {
            return bDist - aDist;
        } else if (a.isBound) {
            return -1;
        } else if (b.isBound) {
            return 1;
        } else if (a.isSnap && b.isSnap) {
            return aDist - bDist;
        } else if (a.isSnap) {
            return -1;
        } else if (b.isSnap) {
            return 1;
        } else if (aDist < TINY_NUM) {
            return 1;
        } else if (bDist < TINY_NUM) {
            return -1;
        }
        return aDist - bDist;
    })[0];
}
export function getCheckSnapLineDirections(
    direction: number[],
    keepRatio: boolean,
) {
    const lineDirections: number[][][] = [];
    const x = direction[0];
    const y = direction[1];
    if (x && y) {
        lineDirections.push(
            [[0, y * 2], direction, [-x, y]],
            [[x * 2, 0], direction, [x, -y]],
        );
    } else if (x) {
        // vertcal
        lineDirections.push(
            [[x * 2, 0], [x, 1], [x, -1]],
        );
        if (keepRatio) {
            lineDirections.push(
                [[0, -1], [x, -1], [-x, -1]],
                [[0, 1], [x, 1], [-x, 1]],
            );
        }
    } else if (y) {
        // horizontal
        lineDirections.push(
            [[0, y * 2], [1, y], [-1, y]],
        );
        if (keepRatio) {
            lineDirections.push(
                [[-1, 0], [-1, y], [-1, -y]],
                [[1, 0], [1, y], [1, -y]],
            );
        }
    } else {
        // [0, 0] to all direction
        lineDirections.push(
            [[-1, 0], [-1, -1], [-1, 1]],
            [[1, 0], [1, -1], [1, 1]],
            [[0, -1], [-1, -1], [1, -1]],
            [[0, 1], [-1, 1], [1, 1]],
        );
    }

    return lineDirections;
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
    const lines = getCheckSnapLineDirections(direction, keepRatio).map(([sign, dir1, dir2]) => {
        return [
            sign,
            getPosByDirection(poses, dir1),
            getPosByDirection(poses, dir2),
        ];
    });
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
    const poses = getFixedPoses(
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
    } = checkSnapBounds(moveable, snapPos);

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
    isRequest: boolean,
    is3d: boolean,
    datas: any,
) {
    const poses = getAbsolutePosesByState(moveable.state);
    const fixedPos = getPosByReverseDirection(poses, snapDirection);
    const keepRatio = moveable.props.keepRatio;

    let widthOffset = 0;
    let heightOffset = 0;

    for (let i = 0; i < 2; ++i) {
        const nextPoses = getFixedPoses(
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
    const [
        pos1,
        pos2,
        pos3,
        pos4,
    ] = relativePoses;
    const nextPos1 = rotate(pos1, rad);
    const nextPos2 = rotate(pos2, rad);
    const nextPos3 = rotate(pos3, rad);
    const nextPos4 = rotate(pos4, rad);

    return [nextPos1, nextPos2, nextPos3, nextPos4].some(pos => {
        return (pos[0] < boundRect.left && Math.abs(pos[0] - boundRect.left) > TINY_NUM)
            || (pos[0] > boundRect.right && Math.abs(pos[0] - boundRect.right) > TINY_NUM)
            || (pos[1] < boundRect.top && Math.abs(pos[1] - boundRect.top) > TINY_NUM)
            || (pos[1] > boundRect.bottom && Math.abs(pos[1] - boundRect.bottom) > TINY_NUM);
    });
}
export function boundRotate(
    vec: number[],
    boundPos: number,
    index: number,
) {
    const r = getDistSize(vec);
    const nextPos = Math.sqrt(r * r - boundPos * boundPos);

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
    const relativePos1 = minus(pos1, origin);
    const relativePos2 = minus(pos2, origin);
    const relativePos3 = minus(pos3, origin);
    const relativePos4 = minus(pos4, origin);
    const relativePoses = [
        relativePos1,
        relativePos2,
        relativePos3,
        relativePos4,
    ];
    const nextPos1 = rotate(relativePos1, rad);
    const nextPos2 = rotate(relativePos2, rad);
    const nextPos3 = rotate(relativePos3, rad);
    const nextPos4 = rotate(relativePos4, rad);
    const nextPoses = [nextPos1, nextPos2, nextPos3, nextPos4];
    if (!isBoundRotate(nextPoses, boundRect, 0)) {
        return rotation;
    }
    const canBounds: Array<[number[], number, number]> = [];
    nextPoses.forEach(nextPos => {
        if (nextPos[0] < relativeLeft) {
            canBounds.push([nextPos, relativeLeft, 0]);
        }
        if (nextPos[0] > relativeRight) {
            canBounds.push([nextPos, relativeRight, 0]);
        }
        if (nextPos[1] < relativeTop) {
            canBounds.push([nextPos, relativeTop, 1]);
        }
        if (nextPos[1] > relativeBottom) {
            canBounds.push([nextPos, relativeBottom, 1]);
        }
    });
    const length = canBounds.length;

    for (let i = 0; i < length; ++i) {
        const [vec, boundPos, index] = canBounds[i];
        const relativeRad1 = getRad([0, 0], vec);
        const result = boundRotate(vec, boundPos, index).filter(relativeRad2 => {
            return !isBoundRotate(relativePoses, boundRect, rad + relativeRad2 - relativeRad1);
        });

        if (result.length) {
            return throttle((rad + result[0] - relativeRad1) * 180 / Math.PI, TINY_NUM);
        }
    }
    return rotation;
}
export function checkSnapSize(
    moveable: MoveableManager<any, any>,
    width: number,
    height: number,
    direction: number[],
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
    return checkSizeDist(moveable, matrix, width, height, direction, direction, isRequest, is3d, datas);
}
export function checkSnapScale(
    moveable: MoveableManager<ScalableProps, any>,
    scale: number[],
    direction: number[],
    snapDirection: number[],
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

export function getSnapInfosByDirection(
    moveable: MoveableManager<SnappableProps & (ResizableProps | ScalableProps), SnappableState>,
    poses: number[][],
    snapDirection: number[],
) {
    let nextPoses = [];
    if (snapDirection[0] && snapDirection[1]) {
        nextPoses = [
            snapDirection,
            [-snapDirection[0], snapDirection[1]],
            [snapDirection[0], -snapDirection[1]],
        ].map(direction => getPosByDirection(poses, direction));
    } else if (!snapDirection[0] && !snapDirection[1]) {
        const alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];

        for (let i = 0; i < 4; ++i) {
            nextPoses.push(alignPoses[i]);
            nextPoses.push([
                (alignPoses[i][0] + alignPoses[i + 1][0]) / 2,
                (alignPoses[i][1] + alignPoses[i + 1][1]) / 2,
            ]);
        }
    } else {
        if (moveable.props.keepRatio) {
            nextPoses = [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
                snapDirection,
            ].map(dir => getPosByDirection(poses, dir));
        } else {
            nextPoses = getPosesByDirection(poses, snapDirection);

            if (nextPoses.length > 1) {
                nextPoses.push([
                    (nextPoses[0][0] + nextPoses[1][0]) / 2,
                    (nextPoses[0][1] + nextPoses[1][1]) / 2,
                ]);
            }
        }
    }
    return checkSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
}
export function startCheckSnapDrag(
    moveable: MoveableManager<any, any>,
    datas: any,
) {
    datas.absolutePoses = getAbsolutePosesByState(moveable.state);
}
export function checkSnapDrag(
    moveable: MoveableManager<any, any>,
    distX: number,
    distY: number,
    datas: any,
) {
    const snapVerticalInfo = {
        isSnap: false,
        isBound: false,
        offset: 0,
    };
    const snapHorizontalInfo = {
        isSnap: false,
        isBound: false,
        offset: 0,
    };

    if (!hasGuidelines(moveable, "draggable")) {
        return [snapVerticalInfo, snapHorizontalInfo];
    }
    const poses = getAbsolutePoses(
        datas.absolutePoses,
        [distX, distY],
    );
    const { left, right, top, bottom } = getRect(poses);

    const snapInfos = checkSnaps(moveable, {
        left,
        right,
        top,
        bottom,
        center: (left + right) / 2,
        middle: (top + bottom) / 2,
    }, true);
    const boundInfos = checkBounds(moveable, [left, right], [top, bottom]);

    if (boundInfos.vertical.isBound) {
        snapVerticalInfo.offset = boundInfos.vertical.offset;
        snapVerticalInfo.isSnap = true;
        snapVerticalInfo.isBound = true;
    } else if (snapInfos.vertical.isSnap) {
        // has vertical guidelines
        snapVerticalInfo.offset = snapInfos.vertical.posInfos[0].guidelineInfos[0].offset;
        snapVerticalInfo.isSnap = true;
    }
    if (boundInfos.horizontal.isBound) {
        snapHorizontalInfo.offset = boundInfos.horizontal.offset;
        snapHorizontalInfo.isSnap = true;
        snapHorizontalInfo.isBound = true;
    } else if (snapInfos.horizontal.isSnap) {
        // has horizontal guidelines
        snapHorizontalInfo.offset = snapInfos.horizontal.posInfos[0].guidelineInfos[0].offset;
        snapHorizontalInfo.isSnap = true;
    }

    return [
        snapVerticalInfo,
        snapHorizontalInfo,
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
