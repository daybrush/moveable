import { BoundInfo, SnappableProps, BoundType, RotatableProps, MoveableManagerInterface } from "../../types";
import { rotate, getRad, minus } from "../../matrix";
import { getDistSize, throttle } from "../../utils";
import { TINY_NUM } from "../../consts";

export function checkBoundPoses(
    moveable: MoveableManagerInterface<SnappableProps>,
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

export function checkBoundKeepRatio(
    moveable: MoveableManagerInterface<SnappableProps>,
    startPos: number[],
    endPos: number[],
) {
    const {
        left = -Infinity,
        top = -Infinity,
        right = Infinity,
        bottom = Infinity,
    } = moveable.props.bounds || {};

    const [endX, endY] = endPos;
    let [dx, dy] = minus(endPos, startPos);

    if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (Math.abs(dy) < TINY_NUM) {
        dy = 0;
    }
    const isBottom = dy > 0;
    const isRight = dx > 0;

    const verticalInfo = {
        isBound: false,
        offset: 0,
        pos: 0,
    };
    const horizontalInfo = {
        isBound: false,
        offset: 0,
        pos: 0,
    };
    if (dx === 0 && dy === 0) {
        return {
            vertical: verticalInfo,
            horizontal: horizontalInfo,
        };
    } else if (dx === 0) {
        if (isBottom) {
            if (bottom < endY) {
                horizontalInfo.pos = bottom;
                horizontalInfo.offset = endY - bottom;
            }
        } else {
            if (top > endY) {
                horizontalInfo.pos = top;
                horizontalInfo.offset = endY - top;
            }
        }
    } else if (dy === 0) {
        if (isRight) {
            if (right < endX) {
                verticalInfo.pos = right;
                verticalInfo.offset = endX - right;
            }
        } else {
            if (left > endX) {
                verticalInfo.pos = left;
                verticalInfo.offset = endX - left;
            }
        }
    } else {
        // y - y1 = a * (x - x1)
        const a = dy / dx;
        const b = endPos[1] - a * endX;
        let y = 0;
        let x = 0;
        let isBound = false;

        if (isRight && right <= endX) {
            y = a * right + b;
            x = right;
            isBound = true;
        } else if (!isRight && endX <= left) {
            y = a * left + b;
            x = left;
            isBound = true;
        }
        if (isBound) {
            if (y < top || y > bottom) {
                isBound = false;
            }
        }
        if (!isBound) {
            if (isBottom && bottom <= endY) {
                y = bottom;
                x = (y - b) / a;
                isBound = true;
            } else if (!isBottom &&  endY <= top) {
                y = top;
                x = (y - b) / a;
                isBound = true;
            }
        }
        if (isBound) {
            verticalInfo.isBound = true;
            verticalInfo.pos = x;
            verticalInfo.offset = endX - x;

            horizontalInfo.isBound = true;
            horizontalInfo.pos = y;
            horizontalInfo.offset = endY - y;
        }
    }

    return {
        vertical: verticalInfo,
        horizontal: horizontalInfo,
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

export function checkRotateBounds(
    moveable: MoveableManagerInterface<SnappableProps & RotatableProps, any>,
    prevPoses: number[][],
    nextPoses: number[][],
    origin: number[],
    rotation: number,
) {
    const bounds = moveable.props.bounds;
    const rad = rotation * Math.PI / 180;

    if (!bounds) {
        return [];
    }
    const {
        left = -Infinity,
        top = -Infinity,
        right = Infinity,
        bottom = Infinity,
    } = bounds;

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

    if (!isBoundRotate(nextPoses, boundRect, 0)) {
        return [];
    }
    const result: number[] = [];
    [
        [relativeLeft, 0],
        [relativeRight, 0],
        [relativeTop, 1],
        [relativeBottom, 1],
    ].forEach(([boundPos, index], i) => {
        nextPoses.forEach(nextPos => {
            const relativeRad1 = getRad([0, 0], nextPos);

            result.push(...boundRotate(nextPos, boundPos, index)
                .map(relativeRad2 => rad + relativeRad2 - relativeRad1)
                .filter(nextRad => !isBoundRotate(prevPoses, boundRect, nextRad))
                .map(nextRad => throttle(nextRad * 180 / Math.PI, TINY_NUM)));
        });
    });

    return result;
}
