import MoveableManager from "../../MoveableManager";
import { BoundInfo, SnappableProps, BoundType, RotatableProps } from "../../types";
import { rotate, getRad } from "@moveable/matrix";
import { getDistSize, throttle } from "../../utils";
import { TINY_NUM } from "../../consts";

export function checkBounds(
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
    moveable: MoveableManager<SnappableProps & RotatableProps, any>,
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
