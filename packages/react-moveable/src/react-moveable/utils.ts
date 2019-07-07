import { PREFIX } from "./consts";
import { prefixNames } from "framework-utils";

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
