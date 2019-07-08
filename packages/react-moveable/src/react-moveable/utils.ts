import { PREFIX } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket } from "@daybrush/utils";

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

export function caculateMatrixStack(target: HTMLElement) {
    let el: HTMLElement | null = target;
    const matrixes: number[][] = [];
    while (el) {
        const transform = window.getComputedStyle(el).transform!;

        if (transform !== "none") {
            const value = splitBracket(transform).value!;

            matrixes.push(value.split(/s*,\s*/g).map(v => parseFloat(v)));
        }
        el = el.parentElement;
    }
    matrixes.reverse();

    // 1 0 0
    // 0 1 0
    const mat = [1, 0, 0, 1, 0, 0];

    matrixes.forEach(matrix => {
        multiple3x2(mat, matrix);
    });
    mat[4] = 0;
    mat[5] = 0;

    return mat;
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
