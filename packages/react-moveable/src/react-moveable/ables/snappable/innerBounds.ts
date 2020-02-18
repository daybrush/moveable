import { maxOffset } from "../../utils";
import { average } from "@moveable/matrix";
import MoveableManager from "../../MoveableManager";
import { SnappableProps, DraggableProps } from "../../types";
import { getDragDist, getPosByDirection, getInverseDragDist } from "../../DraggerUtils";
import { getNearOffsetInfo } from "./snap";

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
function isSameStartLine(dots: number[][], line: number[][], ) {
    const cx = average(line[0][0], line[1][0]);
    const cy = average(line[0][1], line[1][1]);

    const vertical = cx <= dots[0][0];
    const horizontal = cy <= dots[0][1];

    return dots.slice(1).every(dot => (cx <= dot[0]) === vertical && (cy <= dot[1]) === horizontal);
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
