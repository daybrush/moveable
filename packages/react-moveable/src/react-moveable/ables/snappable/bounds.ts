import MoveableManager from "../../MoveableManager";
import { BoundInfo, SnappableProps, BoundType } from "../../types";

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
