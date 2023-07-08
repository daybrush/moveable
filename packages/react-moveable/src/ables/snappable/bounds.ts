import { getRad, throttle } from "@daybrush/utils";
import {
    BoundInfo, SnappableProps, BoundType,
    RotatableProps, MoveableManagerInterface, SnappableState,
} from "../../types";
import { rotate, minus } from "@scena/matrix";
import { abs, getDistSize } from "../../utils";
import { TINY_NUM } from "../../consts";

export function checkBoundPoses(
    bounds: BoundType | false | undefined,
    verticalPoses: number[],
    horizontalPoses: number[],
) {
    const {
        position = "client",
        left = -Infinity,
        top = -Infinity,
        right = Infinity,
        bottom = Infinity,
    } = bounds || {};
    const nextBounds = {
        position,
        left,
        top,
        right,
        bottom,
    };

    return {
        vertical: checkBounds(nextBounds, verticalPoses, true),
        horizontal: checkBounds(nextBounds, horizontalPoses, false),
    };
}
export function getBounds(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    externalBounds?: BoundType | false | null,
) {
    const {
        containerClientRect: {
            clientHeight: containerHeight,
            clientWidth: containerWidth,
            clientLeft,
            clientTop,
        },
        snapOffset: {
            left: snapOffsetLeft,
            top: snapOffsetTop,
            right: snapOffsetRight,
            bottom: snapOffsetBottom,
        },
    } = moveable.state;
    const bounds = externalBounds || moveable.props.bounds || {} as BoundType;
    const position = bounds.position || "client";
    const isCSS = position === "css";
    const {
        left = -Infinity,
        top = -Infinity,
    } = bounds;
    let {
        right = isCSS ? -Infinity : Infinity,
        bottom = isCSS ? -Infinity : Infinity,
    } = bounds;

    if (isCSS) {
        right = containerWidth! + snapOffsetRight - snapOffsetLeft - right;
        bottom = containerHeight! + snapOffsetBottom - snapOffsetTop - bottom;
    }

    return {
        left: left + snapOffsetLeft - clientLeft!,
        right: right + snapOffsetLeft - clientLeft!,
        top: top + snapOffsetTop - clientTop!,
        bottom: bottom + snapOffsetTop - clientTop!,
    };
}
export function checkBoundKeepRatio(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    startPos: number[],
    endPos: number[],
) {
    const {
        left,
        top,
        right,
        bottom,
    } = getBounds(moveable);

    const [endX, endY] = endPos;
    let [dx, dy] = minus(endPos, startPos);

    if (abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (abs(dy) < TINY_NUM) {
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
function checkBounds(
    bounds: Required<BoundType>,
    poses: number[],
    isVertical: boolean,
): BoundInfo[] {
    // 0   [100 - 200]  300
    const startBoundPos = bounds[isVertical ? "left" : "top"];
    const endBoundPos = bounds[isVertical ? "right" : "bottom"];

    // 450
    const minPos = Math.min(...poses);
    const maxPos = Math.max(...poses);
    const boundInfos: BoundInfo[] = [];

    if (startBoundPos + 1 > minPos) {
        boundInfos.push({
            direction: "start",
            isBound: true,
            offset: minPos - startBoundPos,
            pos: startBoundPos,
        });
    }
    if (endBoundPos - 1 < maxPos) {
        boundInfos.push({
            direction: "end",
            isBound: true,
            offset: maxPos - endBoundPos,
            pos: endBoundPos,
        });
    }

    if (!boundInfos.length) {
        boundInfos.push({
            isBound: false,
            offset: 0,
            pos: 0,
        });
    }

    return boundInfos.sort((a, b) => abs(b.offset) - abs(a.offset));
}
export function isBoundRotate(
    relativePoses: number[][],
    boundRect: { left: number, top: number, right: number, bottom: number },
    rad: number,
) {
    const nextPoses = rad ? relativePoses.map(pos => rotate(pos, rad)) : relativePoses;

    return nextPoses.some(pos => {
        return (pos[0] < boundRect.left && abs(pos[0] - boundRect.left) > 0.1)
            || (pos[0] > boundRect.right && abs(pos[0] - boundRect.right) > 0.1)
            || (pos[1] < boundRect.top && abs(pos[1] - boundRect.top) > 0.1)
            || (pos[1] > boundRect.bottom && abs(pos[1] - boundRect.bottom) > 0.1);
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
        return abs(a - vec[index ? 0 : 1]) - abs(b - vec[index ? 0 : 1]);
    }).map(pos => {
        return getRad([0, 0], index ? [pos, boundPos] : [boundPos, pos]);
    });
}

export function checkRotateBounds(
    moveable: MoveableManagerInterface<SnappableProps & RotatableProps, SnappableState>,
    prevPoses: number[][],
    nextPoses: number[][],
    origin: number[],
    rotation: number,
) {
    if (!moveable.props.bounds) {
        return [];
    }
    const rad = rotation * Math.PI / 180;

    const {
        left,
        top,
        right,
        bottom,
    } = getBounds(moveable);

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
    ].forEach(([boundPos, index]) => {
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
