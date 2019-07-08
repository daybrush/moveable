import { PREFIX } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket } from "@daybrush/utils";
import { MoveableState } from "./types";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function caculate3x2(a: number[], b: number[]) {
    // 0 2 4
    // 1 3 5

    return [
        a[0] * b[0] + a[2] * b[1] + a[4] * b[2],
        a[1] * b[0] + a[3] * b[1] + a[5] * b[2],
    ];
}
export function multiple3x2(a: number[], b: number[]) {
    // 00 01 02
    // 10 11 12
    const [
        a00,
        a10,
        a01,
        a11,
        a02,
        a12,
    ] = a;
    const [
        b00,
        b10,
        b01,
        b11,
        b02,
        b12,
    ] = b;

    a[0] = a00 * b00 + a01 * b10;
    a[1] = a10 * b00 + a11 * b10;
    a[2] = a00 * b01 + a01 * b11;
    a[3] = a10 * b01 + a11 * b11;
    a[4] = a00 * b02 + a01 * b12 + a02 * 1;
    a[5] = a10 * b02 + a11 * b12 + a12 * 1;
    return a;
}
export function invert3x2(a: number[]) {
    // 00 01 02
    // 10 11 12
    // 20 21 22
    const [
        a00,
        a10,
        a01,
        a11,
        a02,
        a12,
    ] = a;
    const a20 = 0;
    const a21 = 0;
    const a22 = 1;

    const det
        = a00 * a11 * a22
        + a01 * a12 * a20
        + a02 * a10 * a21
        - a02 * a11 * a20
        - a01 * a10 * a22
        - a00 * a12 * a21;

    const b00 = a11 * a22 - a12 * a21;
    const b01 = a02 * a21 - a01 * a22;
    const b02 = a01 * a12 - a02 * a11;

    const b10 = a12 * a20 - a10 * a22;
    const b11 = a22 * a00 - a20 * a02;
    const b12 = a02 * a10 - a00 * a12;

    // const b20 = a11 * a21 - a11 * a20;
    // const b21 = a20 * a01 - a21 * a00;
    // const b22 = a00 * a11 - a01 * a10;

    a[0] = b00 / det;
    a[1] = b10 / det;
    a[2] = b01 / det;
    a[3] = b11 / det;
    a[4] = b02 / det;
    a[5] = b12 / det;

    return a;
}
export function caculateMatrixStack(target: HTMLElement) {
    let el: HTMLElement | null = target;
    const matrixes: Array<"none" | number[]> = [];

    while (el) {
        const transform = window.getComputedStyle(el).transform!;

        if (transform !== "none") {
            const value = splitBracket(transform).value!;
            const matrix = value.split(/s*,\s*/g).map(v => parseFloat(v));
            matrixes.push(matrix);
        } else {
            matrixes.push("none");
        }
        el = el.parentElement;
    }

    matrixes.reverse();

    // 1 0 0
    // 0 1 0
    const mat = [1, 0, 0, 1, 0, 0];
    const length = matrixes.length;
    let beforeMatrix = [1, 0, 0, 1, 0, 0];

    matrixes.forEach((matrix, i) => {
        if (length - 1 === i) {
            beforeMatrix = mat.slice();
        }
        if (matrix !== "none") {
            multiple3x2(mat, matrix);
        }

    });
    beforeMatrix[4] = 0;
    beforeMatrix[5] = 0;
    mat[4] = 0;
    mat[5] = 0;

    return [beforeMatrix, mat];
}
export function caculatePosition(matrix: number[], origin: number[], width: number, height: number) {
    let [x1, y1] = caculate3x2(matrix, [0, 0, 1]);
    let [x2, y2] = caculate3x2(matrix, [width, 0, 1]);
    let [x3, y3] = caculate3x2(matrix, [0, height, 1]);
    let [x4, y4] = caculate3x2(matrix, [width, height, 1]);
    let [originX, originY] = caculate3x2(matrix, [origin[0], origin[1], 1]);

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
export function caculateRotationMatrix(matrix: number[], rad: number) {
    const mat = matrix.slice();
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotationMatrix = [cos, sin, -sin, cos, 0, 0];

    return multiple3x2(mat, rotationMatrix);
}

export function getRad(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const rad = Math.atan2(distY, distX);

    return rad > 0 ? rad : rad + Math.PI * 2;
}
export function getLineTransform(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const width = Math.sqrt(distX * distX + distY * distY);
    const rad = getRad(pos1, pos2);

    return `translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad) scale(${width}, 1.2)`;
}

export function getTargetInfo(target?: HTMLElement): MoveableState {
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

    if (target) {
        const rect = target.getBoundingClientRect();

        left = rect.left;
        top = rect.top;
        width = target.offsetWidth;
        height = target.offsetHeight;
        [beforeMatrix, matrix] = caculateMatrixStack(target);
        transformOrigin = window.getComputedStyle(target).transformOrigin!.split(" ").map(pos => parseFloat(pos));
        [origin, pos1, pos2, pos3, pos4] = caculatePosition(matrix, transformOrigin, width, height);
    }

    return {
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
        origin,
        transformOrigin,
    };
}
