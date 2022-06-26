import { throttle } from "@daybrush/utils";
import { TINY_NUM } from "@daybrush/utils";
import { SnappableLine } from "./types";


export function groupBy<T>(arr: T[], func: (el: T, index: number, arr: T[]) => any) {
    const groups: T[][] = [];
    const groupKeys: any[] = [];

    arr.forEach((el, index) => {
        const groupKey = func(el, index, arr);
        const keyIndex = groupKeys.indexOf(groupKey);
        const group = groups[keyIndex] || [];

        if (keyIndex === -1) {
            groupKeys.push(groupKey);
            groups.push(group);
        }
        group.push(el);
    });
    return groups;
}

export function solveLineConstants(line: SnappableLine): [number, number, number] {
    const { point1, point2 } = line;
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

    if (!dx && !dy) {

    }
    if (!dx) {
        if (dy) {
            // -x + 1 = 0
            a = -1;
            c = point1[0];
        }
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
export function solveLineDistance(
    line: SnappableLine,
    pos: number[],
) {
    return solveConstantsDistance(
        solveLineConstants(line),
        pos,
    );
}

export function solveConstantsDistance(
    [a, b, c]: [number, number, number],
    pos: number[],
) {
    return (a * pos[0] + b * pos[1] + c) / (a * a + b * b);
}
export function solveConstantsOffset(
    [a, b, c]: [number, number, number],
    [x, y]: number[],
) {
    let offsetX = 0;
    let offsetY = 0;

    // ax + by + c

    if (!a) {
        // y = -c / b (by + c = 0)
        offsetY = y + c / b;
    } else if (!b) {
        // x = -c / a (ax + c = 0)
        offsetX = x + c / a;
    } else {
        // y = -a/bx - c / b
        offsetY = y + a / b * x + c / b;
        // x = -b/ay - c / a
        offsetX = x + b / a * y + c / a;
    }

    return [offsetX, offsetY];
}
