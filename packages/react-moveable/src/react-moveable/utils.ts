import { PREFIX } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket, isUndefined } from "@daybrush/utils";
import { MoveableState, MoveableProps } from "./types";
import {
    multiply, invert,
    convertCSStoMatrix, convertMatrixtoCSS,
    convertDimension, createIdentityMatrix,
} from "./matrix";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function getTransform(target: SVGElement | HTMLElement, isInit: true): number[];
export function getTransform(target: SVGElement | HTMLElement): "none" | number[];
export function getTransform(target: SVGElement | HTMLElement, isInit?: boolean) {
    const transform = window.getComputedStyle(target).transform!;

    if (transform === "none") {
        if (isInit) {
            return [1, 0, 0, 1, 0, 0];
        }
        return "none";
    } else {
        const value = splitBracket(transform).value!;
        return value.split(/s*,\s*/g).map(v => parseFloat(v));
    }
}
export function caculateMatrixStack(target: SVGElement | HTMLElement) {
    let el: SVGElement | HTMLElement | null = target;
    const matrixes: Array<"none" | number[]> = [];

    while (el) {
        matrixes.push(getTransform(el));
        el = el.parentElement;
    }

    matrixes.reverse();

    // 1 0 0
    // 0 1 0
    const length = matrixes.length;
    let mat = createIdentityMatrix(3);
    let beforeMatrix = createIdentityMatrix(3);
    let is3d = false;

    matrixes.forEach((matrix, i) => {
        if (length - 1 === i) {
            beforeMatrix = mat.slice();
        }
        if (matrix !== "none") {
            const nextMatrix = convertCSStoMatrix(matrix);

            if (!is3d && nextMatrix.length === 16) {
                is3d = true;
                mat = convertDimension(mat, 3, 4);
            }
            mat = multiply(
                mat,
                nextMatrix,
                is3d ? 4 : 3,
            );
        }
    });
    if (is3d && beforeMatrix.length !== 16) {
        beforeMatrix = convertDimension(beforeMatrix, 3, 4);
    }
    if (is3d) {
        beforeMatrix[3] = 0;
        beforeMatrix[7] = 0;
        mat[3] = 0;
        mat[7] = 0;
    } else {
        beforeMatrix[2] = 0;
        beforeMatrix[5] = 0;
        mat[2] = 0;
        mat[5] = 0;
    }

    return [beforeMatrix, mat];
}
export function caculatePosition(matrix: number[], origin: number[], width: number, height: number) {
    const is3d = matrix.length === 16;
    const n = is3d ? 4 : 3;
    let [x1, y1] = multiply(matrix, is3d ? [0, 0, 0, 1] : [0, 0, 1], n);
    let [x2, y2] = multiply(matrix, is3d ? [width, 0, 0, 1] : [width, 0, 1], n);
    let [x3, y3] = multiply(matrix, is3d ? [0, height, 0, 1] : [0, height, 1], n);
    let [x4, y4] = multiply(matrix, is3d ? [width, height, 0, 1] : [width, height, 1], n);
    let [originX, originY] = multiply(matrix, is3d ? [origin[0], origin[1], 0, 1] : [origin[0], origin[1], 1], n);

    const minX = Math.min(x1, x2, x3, x4);
    const minY = Math.min(y1, y2, y3, y4);

    x1 = (x1 - minX) || 0;
    x2 = (x2 - minX) || 0;
    x3 = (x3 - minX) || 0;
    x4 = (x4 - minX) || 0;

    y1 = (y1 - minY) || 0;
    y2 = (y2 - minY) || 0;
    y3 = (y3 - minY) || 0;
    y4 = (y4 - minY) || 0;

    originX = (originX - minX) || 0;
    originY = (originY - minY) || 0;

    return [
        [originX, originY],
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ];
}

export function rotateMatrix(matrix: number[], rad: number) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return multiply([
        cos, -sin, 0,
        sin, cos, 0,
        0, 0, 1,
    ], matrix, 3);
}

export function getRad(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const rad = Math.atan2(distY, distX);

    return rad > 0 ? rad : rad + Math.PI * 2;
}
export function getLineStyle(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const width = Math.sqrt(distX * distX + distY * distY);
    const rad = getRad(pos1, pos2);

    return {
        transform: `translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad)`,
        width: `${width}px`,
    };
}
export function getControlTransform(...poses: number[][]) {
    const length = poses.length;

    const x = poses.reduce((prev, pos) => prev + pos[0], 0) / length;
    const y = poses.reduce((prev, pos) => prev + pos[1], 0) / length;
    return {
        transform: `translate(${x}px, ${y}px)`,
    };
}
export function getSize(
    target: SVGElement | HTMLElement,
    style: CSSStyleDeclaration = window.getComputedStyle(target),
    isOffset?: boolean,
    isBoxSizing: boolean = isOffset || style.boxSizing === "border-box",
) {
    let width = (target as HTMLElement).offsetWidth;
    let height = (target as HTMLElement).offsetHeight;
    const hasOffset = !isUndefined(width);

    if ((isOffset || isBoxSizing) && hasOffset) {
        return [width, height];
    }
    width = target.clientWidth;
    height = target.clientHeight;

    if (isOffset || isBoxSizing) {
        const borderLeft = parseFloat(style.borderLeftWidth!) || 0;
        const borderRight = parseFloat(style.borderRightWidth!) || 0;
        const borderTop = parseFloat(style.borderTopWidth!) || 0;
        const borderBottom = parseFloat(style.borderBottomWidth!) || 0;

        return [
            width + borderLeft + borderRight,
            height + borderTop + borderBottom,
        ];
    } else {
        const paddingLeft = parseFloat(style.paddingLeft!) || 0;
        const paddingRight = parseFloat(style.paddingRight!) || 0;
        const paddingTop = parseFloat(style.paddingTop!) || 0;
        const paddingBottom = parseFloat(style.paddingBottom!) || 0;

        return [
            width - paddingLeft - paddingRight,
            height - paddingTop - paddingBottom,
        ];
    }
}
export function getRotationInfo(origin: number[], pos1: number[], pos2: number[]): [1 | -1, number, number[]] {
    const pos1Rad = getRad(origin, pos1);
    const pos2Rad = getRad(origin, pos2);
    const direction =
        (pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI) || (pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI)
            ? 1 : -1;
    const rotationRad = getRad(direction > 0 ? pos1 : pos2, direction > 0 ? pos2 : pos1);
    const relativeRotationPos = rotateMatrix([0, -40, 0], rotationRad);

    const rotationPos = [
        (pos1[0] + pos2[0]) / 2 + relativeRotationPos[0],
        (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1],
    ];

    return [direction, rotationRad, rotationPos];
}
export function getTargetInfo(
    target?: SVGElement | HTMLElement | null,
    container?: MoveableProps["container"],
): MoveableState {
    let left = 0;
    let top = 0;
    let origin = [0, 0];
    let pos1 = [0, 0];
    let pos2 = [0, 0];
    let pos3 = [0, 0];
    let pos4 = [0, 0];
    let beforeMatrix = [1, 0, 0, 1, 0, 0];
    let matrix = [1, 0, 0, 1, 0, 0];
    let width = 0;
    let height = 0;
    let transformOrigin = [0, 0];
    let direction: 1 | -1 = 1;
    let rotationPos = [0, 0];
    let rotationRad = 0;
    let is3d = false;

    if (target) {
        const rect = target.getBoundingClientRect();
        const style = window.getComputedStyle(target);

        left = rect.left;
        top = rect.top;
        width = (target as HTMLElement).offsetWidth;
        height = (target as HTMLElement).offsetHeight;

        if (isUndefined(width)) {
            [width, height] = getSize(target, style, true);
        }
        [beforeMatrix, matrix] = caculateMatrixStack(target);

        is3d = matrix.length === 16;
        transformOrigin = style.transformOrigin!.split(" ").map(pos => parseFloat(pos));
        [origin, pos1, pos2, pos3, pos4] = caculatePosition(matrix, transformOrigin, width, height);

        if (container) {
            const containerRect = container.getBoundingClientRect();

            left -= containerRect.left;
            top -= containerRect.top;
        }
        // 1 : clockwise
        // -1 : counterclockwise
        [direction, rotationRad, rotationPos] = getRotationInfo(origin, pos1, pos2);
    }

    return {
        direction,
        rotationRad,
        rotationPos,
        transform: "",
        target,
        left,
        top,
        pos1,
        pos2,
        pos3,
        pos4,
        width,
        height,
        beforeMatrix,
        matrix,
        is3d,
        origin,
        transformOrigin,
    };
}

export function getPosition(target: SVGElement | HTMLElement) {
    const position = target.getAttribute("data-position")!;

    if (!position) {
        return;
    }
    const pos = [0, 0];

    (position.indexOf("w") > -1) && (pos[0] = -1);
    (position.indexOf("e") > -1) && (pos[0] = 1);
    (position.indexOf("n") > -1) && (pos[1] = -1);
    (position.indexOf("s") > -1) && (pos[1] = 1);

    return pos;
}

export function throttle(num: number, unit: number) {
    if (!unit) {
        return num;
    }
    return Math.round(num / unit) * unit;
}
export function throttleArray(nums: number[], unit: number) {
    nums.forEach((_, i) => {
        nums[i] = throttle(nums[i], unit);
    });
}

export function warp(
    pos0: number[],
    pos1: number[],
    pos2: number[],
    pos3: number[],
    nextPos0: number[],
    nextPos1: number[],
    nextPos2: number[],
    nextPos3: number[],
) {
    const [x0, y0] = pos0;
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;
    const [x3, y3] = pos3;

    const [u0, v0] = nextPos0;
    const [u1, v1] = nextPos1;
    const [u2, v2] = nextPos2;
    const [u3, v3] = nextPos3;

    const matrix = [
        x0, y0, 1, 0, 0, 0, -u0 * x0, -u0 * y0,
        0, 0, 0, x0, y0, 1, -v0 * x0, -v0 * y0,
        x1, y1, 1, 0, 0, 0, -u1 * x1, -u1 * y1,
        0, 0, 0, x1, y1, 1, -v1 * x1, -v1 * y1,
        x2, y2, 1, 0, 0, 0, -u2 * x2, -u2 * y2,
        0, 0, 0, x2, y2, 1, -v2 * x2, -v2 * y2,
        x3, y3, 1, 0, 0, 0, -u3 * x3, -u3 * y3,
        0, 0, 0, x3, y3, 1, -v3 * x3, -v3 * y3,
    ];
    const inverseMatrix = invert(matrix, 8);

    if (!inverseMatrix.length) {
        return createIdentityMatrix(8);
    }
    const h = multiply(invert(matrix, 8), [u0, v0, u1, v1, u2, v2, u3, v3], 8);

    h[8] = 1;
    return convertMatrixtoCSS(convertDimension(h, 3, 4));
}
