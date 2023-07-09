import { TINY_NUM } from "@daybrush/utils";
import { throttle } from "@daybrush/utils";
import {
    MoveableClientRect, MoveableManagerInterface,
    SnapDirectionPoses,
    SnapDirections, SnappableProps,
    SnappableState,
} from "../../types";
import {
    calculatePosition,
} from "../../utils";
export const VERTICAL_NAMES = ["left", "right", "center"] as const;
export const HORIZONTAL_NAMES = ["top", "bottom", "middle"] as const;
export const SNAP_SKIP_NAMES_MAP = {
    "left": "start",
    "right": "end",
    "center": "center",
    "top": "start",
    "bottom": "end",
    "middle": "center",
};

export const VERTICAL_NAMES_MAP = {
    start: "left",
    end: "right",
    center: "center",
} as const;
export const HORIZONTAL_NAMES_MAP = {
    start: "top",
    end: "bottom",
    center: "middle",
} as const;



export function getInitialBounds() {
    return {
        left: false,
        top: false,
        right: false,
        bottom: false,
    };
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

export function getSnapDirections(snapDirections: SnapDirections | boolean | undefined): SnapDirections {
    if (snapDirections === false) {
        return {};
    } else if (snapDirections === true || !snapDirections) {
        return { left: true, right: true, top: true, bottom: true };
    }
    return snapDirections;
}

export function mapSnapDirectionPoses(
    snapDirections: SnapDirections | boolean | undefined,
    snapPoses: SnapDirectionPoses,
) {
    const nextSnapDirections = getSnapDirections(snapDirections);
    const nextSnapPoses: SnapDirectionPoses = {};

    for (const name in nextSnapDirections) {
        if (name in snapPoses && (nextSnapDirections as any)[name]) {
            (nextSnapPoses as any)[name] = (snapPoses as any)[name];
        }
    }
    return nextSnapPoses;
}

export function splitSnapDirectionPoses(
    snapDirections: SnapDirections | boolean | undefined,
    snapPoses: SnapDirectionPoses,
) {
    const nextSnapPoses = mapSnapDirectionPoses(snapDirections, snapPoses);
    const horizontalNames = HORIZONTAL_NAMES.filter(name => name in nextSnapPoses);
    const verticalNames = VERTICAL_NAMES.filter(name => name in nextSnapPoses);

    return {
        horizontalNames,
        verticalNames,
        horizontal: horizontalNames.map(name => nextSnapPoses[name]!),
        vertical: verticalNames.map(name => nextSnapPoses[name]!),
    };
}

export function calculateContainerPos(
    rootMatrix: number[],
    containerRect: MoveableClientRect,
    n: number,
) {
    const clientPos = calculatePosition(
        rootMatrix, [containerRect.clientLeft!, containerRect.clientTop!], n);

    return [
        containerRect.left + clientPos[0],
        containerRect.top + clientPos[1],
    ];
}

export function solveLineConstants([point1, point2]: number[][]): [number, number, number] {
    let dx = point2[0] - point1[0];
    let dy = point2[1] - point1[1];

    if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (Math.abs(dy) < TINY_NUM) {
        dy = 0;
    }

    // b > 0
    // ax + by + c = 0
    let a = 0;
    let b = 0;
    let c = 0;

    if (!dx) {
        // -x + 1 = 0
        a = -1;
        c = point1[0];
    } else if (!dy) {
        // y - 1 = 0
        b = 1;
        c = -point1[1];
    } else {
        // y = -a(x - x1) + y1
        // ax + y + a * x1 - y1 = 0
        a = -dy / dx;
        b = 1;
        c = a * point1[0] - point1[1];
    }

    return [a, b, c].map(v => throttle(v, TINY_NUM)) as [number, number, number];
}
