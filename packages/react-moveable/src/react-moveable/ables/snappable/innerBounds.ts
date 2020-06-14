import { maxOffset, getDistSize, throttle } from "../../utils";
import { average, rotate, getRad } from "../../matrix";
import MoveableManager from "../../MoveableManager";
import { SnappableProps, DraggableProps, RotatableProps } from "../../types";
import { getDragDist, getPosByDirection, getInverseDragDist } from "../../DraggerUtils";
import { getNearOffsetInfo } from "./snap";
import { TINY_NUM } from "../../consts";

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
function hitTestLine(
    dot: number[],
    [pos1, pos2]: number[][],
) {
    let dx = pos2[0] - pos1[0];
    let dy = pos2[1] - pos1[1];

    if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (Math.abs(dy) < TINY_NUM) {
        dy = 0;
    }
    let test1: number;
    let test2: number;
    if (!dx) {
        test1 = pos1[0];
        test2 = dot[0];
    } else if (!dy) {
        test1 = pos1[1];
        test2 = dot[1];
    } else {
        const a = dy / dx;

        // y = a * (x - pos1) + pos1
        test1 = a * (dot[0] - pos1[0]) + pos1[1];
        test2 = dot[1];
    }
    return test1 - test2;
}
function isSameStartLine(dots: number[][], line: number[][], error: number = TINY_NUM) {
    const centerSign = hitTestLine(dots[0], line) <= 0;

    return dots.slice(1).every(dot => {
        const value = hitTestLine(dot, line);
        const sign = value <= 0;
        return sign === centerSign || Math.abs(value) <= error;
    });
}
function checkInnerBoundDot(
    pos: number,
    start: number,
    end: number,
    isStart: boolean,
    threshold: number = 0,
) {
    if (
        (isStart && start - threshold <= pos)
        || (!isStart && pos <= end + threshold)
    ) {
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

function checkInnerBound(
    moveable: MoveableManager<SnappableProps>,
    line: number[][],
    center: number[],
) {
    const bounds = moveable.props.innerBounds;

    if (!bounds) {
        return {
            isAllBound: false,
            isBound: false,
            isVerticalBound: false,
            isHorizontalBound: false,
            offset: [0, 0],
        };
    }
    const { left, top, width, height } = bounds;
    const leftLine = [[left, top], [left, top + height]];
    const topLine = [[left, top], [left + width, top]];
    const rightLine = [[left + width, top], [left + width, top + height]];
    const bottomLine = [[left, top + height], [left + width, top + height]];
    const {
        horizontal: isHorizontalStart,
        vertical: isVerticalStart,
    } = isStartLine(center, line);

    if (isSameStartLine([
        center,
        [left, top],
        [left + width, top],
        [left, top + height],
        [left + width, top + height],
    ], line)) {
        return {
            isAllBound: false,
            isBound: false,
            isVerticalBound: false,
            isHorizontalBound: false,
            offset: [0, 0],
        };
    }

    // test vertical
    const topBoundInfo = checkLineBoundCollision(line, topLine, isVerticalStart);
    const bottomBoundInfo = checkLineBoundCollision(line, bottomLine, isVerticalStart);

    // test horizontal
    const leftBoundInfo = checkLineBoundCollision(line, leftLine, isHorizontalStart);
    const rightBoundInfo = checkLineBoundCollision(line, rightLine, isHorizontalStart);

    const isAllVerticalBound = topBoundInfo.isBound && bottomBoundInfo.isBound;
    const isVerticalBound = topBoundInfo.isBound || bottomBoundInfo.isBound;
    const isAllHorizontalBound = leftBoundInfo.isBound && rightBoundInfo.isBound;
    const isHorizontalBound = leftBoundInfo.isBound || rightBoundInfo.isBound;
    const verticalOffset = maxOffset(topBoundInfo.offset, bottomBoundInfo.offset);
    const horizontalOffset = maxOffset(leftBoundInfo.offset, rightBoundInfo.offset);

    let offset = [0, 0];
    let isBound = false;
    let isAllBound = false;

    if (Math.abs(horizontalOffset) < Math.abs(verticalOffset)) {
        offset = [verticalOffset, 0];
        isBound = isVerticalBound;
        isAllBound = isAllVerticalBound;
    } else {
        offset = [0, horizontalOffset];
        isBound = isHorizontalBound;
        isAllBound = isAllHorizontalBound;
    }
    return {
        isAllBound,
        isVerticalBound,
        isHorizontalBound,
        isBound,
        offset,
    };
}

function checkLineBoundCollision(
    line: number[][],
    boundLine: number[][],
    isStart: boolean,
    threshold?: number,
) {
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
            return checkInnerBoundDot(y, boundDot1[1], boundDot2[1], isStart, threshold);
        }
    } else if (!dy2) {
        // horizontal

        if (dy1) {
            // y = a * (x - x1) + y1
            // x = (y - y1) / a + x1
            const a = dy1 / dx1;
            const x = dx1 ? (boundDot1[1] - dot1[1]) / a + dot1[0] : dot1[0];

            // boundDot1[0] <= x && x <= boundDot2[0]
            return checkInnerBoundDot(x, boundDot1[0], boundDot2[0], isStart, threshold);
        }
    }
    return {
        isBound: false,
        offset: 0,
    };
}
export function getInnerBoundInfo(
    moveable: MoveableManager<SnappableProps>,
    lines: number[][][],
    center: number[],
    datas: any,
) {
    return lines.map(([multiple, pos1, pos2]) => {
        const {
            isBound,
            offset,
            isVerticalBound,
            isHorizontalBound,
        } = checkInnerBound(moveable, [pos1, pos2], center);

        const sizeOffset = getDragDist({
            datas,
            distX: offset[0],
            distY: offset[1],
        }).map((size, i) => size * (multiple[i] ?  2 / multiple[i] : 0));

        return {
            sign: multiple,
            isBound,
            isVerticalBound,
            isHorizontalBound,
            isSnap: false,
            offset: sizeOffset,
        };
    });
}

export function getInnerBoundDragInfo(
    moveable: MoveableManager<SnappableProps & DraggableProps, any>,
    poses: number[][],
    datas: any,
) {
    const lines = getCheckSnapLines(poses, [0, 0], false).map(([sign, pos1, pos2]) => {
        return [
            sign.map(dir => Math.abs(dir) * 2),
            pos1,
            pos2,
        ];
    });
    const innerBoundInfo = getInnerBoundInfo(moveable, lines, getPosByDirection(poses, [0, 0]), datas);
    const widthOffsetInfo = getNearOffsetInfo(innerBoundInfo, 0);
    const heightOffsetInfo = getNearOffsetInfo(innerBoundInfo, 1);
    let verticalOffset = 0;
    let horizontalOffset = 0;
    const isVerticalBound = widthOffsetInfo.isVerticalBound || heightOffsetInfo.isVerticalBound;
    const isHorizontalBound = widthOffsetInfo.isHorizontalBound || heightOffsetInfo.isHorizontalBound;

    if (isVerticalBound || isHorizontalBound) {
        [verticalOffset, horizontalOffset] = getInverseDragDist({
            datas,
            distX: -widthOffsetInfo.offset[0],
            distY: -heightOffsetInfo.offset[1],
        });
    }

    return {
        vertical: {
            isBound: isVerticalBound,
            offset: verticalOffset,
        },
        horizontal: {
            isBound: isHorizontalBound,
            offset: horizontalOffset,
        },
    };
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
export function getCheckSnapLines(
    poses: number[][],
    direction: number[],
    keepRatio: boolean,
) {
    return getCheckSnapLineDirections(direction, keepRatio).map(([sign, dir1, dir2]) => {
        return [
            sign,
            getPosByDirection(poses, dir1),
            getPosByDirection(poses, dir2),
        ];
    });
}

function isBoundRotate(
    relativePoses: number[][],
    boundDots: number[][],
    center: number[],
    rad: number,
) {
    const nextPoses = rad ? relativePoses.map(pos => rotate(pos, rad)) : relativePoses;
    const dots = [
        center,
        ...boundDots,
    ];
    return [
        [nextPoses[0], nextPoses[1]],
        [nextPoses[1], nextPoses[3]],
        [nextPoses[3], nextPoses[2]],
        [nextPoses[2], nextPoses[0]],
    ].some((line, i) => !isSameStartLine(dots, line));
}
function getDistPointLine([pos1, pos2]: number[][]) {
    // x = 0, y = 0
    // d = (ax + by + c) / root(a2 + b2)

    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];

    if (!dx) {
        return Math.abs(pos1[0]);
    }
    if (!dy) {
        return Math.abs(pos1[1]);
    }
    // y - y1 = a(x - x1)
    // 0 = ax -y + -a * x1 + y1

    const a = dy / dx;

    return Math.abs((-a * pos1[0] + pos1[1]) / Math.sqrt(Math.pow(a, 2) + 1));
}
function solveReverseLine([pos1, pos2]: number[][]) {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];

    if (!dx) {
        return [pos1[0], 0];
    }
    if (!dy) {
        return [0, pos1[1]];
    }
    const a = dy / dx;
    // y - y1 = a (x  - x1)
    // y = ax - a * x1 + y1
    const b = -a * pos1[0] + pos1[1];
    // y = ax + b = -1/a x
    // x = -b / (a + 1 / a)
    // y = b / (1 + 1 / a^2)

    return [
        -b / (a + 1 / a),
        b / ((a * a) + 1),
    ];
}
export function checkRotateInnerBounds(
    moveable: MoveableManager<SnappableProps & RotatableProps, any>,
    prevPoses: number[][],
    nextPoses: number[][],
    origin: number[],
    rotation: number,
) {
    const bounds = moveable.props.innerBounds;
    const rad = rotation * Math.PI / 180;

    if (!bounds) {
        return [];
    }
    const {
        left,
        top,
        width,
        height,
    } = bounds;

    const relativeLeft = left - origin[0];
    const relativeRight = left + width - origin[0];
    const relativeTop = top - origin[1];
    const relativeBottom = top + height - origin[1];
    const dots = [
        [relativeLeft, relativeTop],
        [relativeRight, relativeTop],
        [relativeLeft, relativeBottom],
        [relativeRight, relativeBottom],
    ];
    const center = getPosByDirection(nextPoses, [0, 0]);

    if (!isBoundRotate(nextPoses, dots, center, 0)) {
        return [];
    }
    const result: number[] = [];
    const dotInfos = dots.map(dot => [
        getDistSize(dot),
        getRad([0, 0], dot),
    ]);
    [
        [nextPoses[0], nextPoses[1]],
        [nextPoses[1], nextPoses[3]],
        [nextPoses[3], nextPoses[2]],
        [nextPoses[2], nextPoses[0]],
    ].forEach(line => {
        const lineRad = getRad([0, 0], solveReverseLine(line));
        const lineDist = getDistPointLine(line);

        result.push(...dotInfos
            .filter(([dotDist]) => {
                return dotDist && lineDist <= dotDist;
            })
            .map(([dotDist, dotRad]) => {
                const distRad = Math.acos(dotDist ? lineDist / dotDist : 0);
                const nextRad1 = dotRad + distRad;
                const nextRad2 = dotRad - distRad;

                return [
                    rad + nextRad1 - lineRad,
                    rad + nextRad2 - lineRad,
                ];
            })
            .reduce<number[]>((prev, cur) => {
                prev.push(...cur);
                return prev;
            }, [])
            .filter(nextRad => !isBoundRotate(prevPoses, dots, center, nextRad))
            .map(nextRad => throttle(nextRad * 180 / Math.PI, TINY_NUM)));
    });
    return result;
}

export function checkInnerBoundPoses(
    moveable: MoveableManager<SnappableProps>,
) {
    const innerBounds = moveable.props.innerBounds;

    if (!innerBounds) {
        return {
            vertical: [],
            horizontal: [],
        };
    }
    const {
        pos1,
        pos2,
        pos3,
        pos4,
    } = moveable.getRect();
    const poses = [pos1, pos2, pos3, pos4];
    const center = getPosByDirection(poses, [0, 0]);
    const { left, top, width, height } = innerBounds;
    const leftLine = [[left, top], [left, top + height]];
    const topLine = [[left, top], [left + width, top]];
    const rightLine = [[left + width, top], [left + width, top + height]];
    const bottomLine = [[left, top + height], [left + width, top + height]];

    const lines = [
        [pos1, pos2],
        [pos2, pos4],
        [pos4, pos3],
        [pos3, pos1],
    ];

    const horizontalPoses: number[] = [];
    const verticalPoses: number[] = [];

    const boundMap = {
        top: false,
        bottom: false,
        left: false,
        right: false,
    };

    lines.forEach(line => {
        const {
            horizontal: isHorizontalStart,
            vertical: isVerticalStart,
        } = isStartLine(center, line);

        // test vertical
        const topBoundInfo = checkLineBoundCollision(line, topLine, isVerticalStart, 1);
        const bottomBoundInfo = checkLineBoundCollision(line, bottomLine, isVerticalStart, 1);

        // test horizontal
        const leftBoundInfo = checkLineBoundCollision(line, leftLine, isHorizontalStart, 1);
        const rightBoundInfo = checkLineBoundCollision(line, rightLine, isHorizontalStart, 1);

        if (topBoundInfo.isBound && !boundMap.top) {
            horizontalPoses.push(top);
            boundMap.top = true;
        }
        if (bottomBoundInfo.isBound && !boundMap.bottom) {
            horizontalPoses.push(top + height);
            boundMap.bottom = true;
        }
        if (leftBoundInfo.isBound && !boundMap.left) {
            verticalPoses.push(left);
            boundMap.left = true;
        }
        if (rightBoundInfo.isBound && !boundMap.right) {
            verticalPoses.push(left + width);
            boundMap.right = true;
        }
    });

    return {
        horizontal: horizontalPoses,
        vertical: verticalPoses,
    };
}
