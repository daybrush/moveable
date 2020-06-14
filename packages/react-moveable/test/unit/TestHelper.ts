import MoveableManager from "../../src/react-moveable/MoveableManager";
import {  createRotateMatrix, caculate, minus, plus, createIdentityMatrix } from "../../src/react-moveable/matrix";
import { RotatableProps } from "../../src/react-moveable";
import { getClientRect } from "../../src/react-moveable/utils";
import Clippable from "../../src/react-moveable/ables/Clippable";

function add(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    endIndex: number,
    fromStart: number,
    k: number,
) {
    for (let i = startIndex; i < endIndex; ++i) {
        matrix[i] += matrix[fromStart + i - startIndex] * k;
        inverseMatrix[i] += inverseMatrix[fromStart + i - startIndex] * k;
    }
}


function swap(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    endIndex: number,
    fromStart: number,
) {
    for (let i = startIndex; i < endIndex; ++i) {
        const v = matrix[i];
        const iv = inverseMatrix[i];

        matrix[i] = matrix[fromStart + i - startIndex];
        matrix[fromStart + i - startIndex] = v;

        inverseMatrix[i] = inverseMatrix[fromStart + i - startIndex];
        inverseMatrix[fromStart + i - startIndex] = iv;
    }
}

function divide(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    endIndex: number,
    k: number,
) {
    for (let i = startIndex; i < endIndex; ++i) {
        matrix[i] /= k;
        inverseMatrix[i] /= k;
    }
}

export async function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function dispatchEvent(target: HTMLElement | SVGElement, type: string, client: number[]) {
    target.dispatchEvent(new MouseEvent(type, {
        clientX: client[0],
        clientY: client[1],
        cancelable: true,
        bubbles: true,
    }));
}
export function mousedown(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mousedown", client);
}
export function mousemove(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mousemove", client);
}
export function mouseup(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mouseup", client);
}

export function rotateStart(moveable: MoveableManager<RotatableProps>) {
    const rotationElement = moveable.controlBox.getElement().querySelector<HTMLElement>(".moveable-rotation")!;

    const { left, top, width, height } = rotationElement.getBoundingClientRect();
    const clientX = left + width / 2;
    const clientY = top + height / 2;
    const { origin } = moveable.state;
    const rect = getClientRect(moveable.controlBox.getElement());
    const absoluteOrigin = [
        rect.left + origin[0],
        rect.top + origin[1],
    ];
    const client = [clientX, clientY];
    mousedown(rotationElement, client);

    return [rotationElement, client, absoluteOrigin];
}
export async function rotate(startInfo: any[], deg: number) {
    const [rotationElement, startClient, absoluteOrigin] = startInfo;

    const rad = deg / 180 * Math.PI;

    const m = createRotateMatrix(rad, 3);
    const dist = minus(startClient, absoluteOrigin);
    const [offsetX, offsetY] = caculate(m, [dist[0], dist[1], 1]);
    const client = plus(absoluteOrigin, [offsetX, offsetY]);

    dispatchEvent(rotationElement, "mousemove", client);
}
export async function rotateEnd(startInfo: any[]) {
    const [rotationElement] = startInfo;

    dispatchEvent(rotationElement, "mouseup", [0, 0]);
}

export function helperMultiply(matrix: number[], matrix2: number[], n: number) {
    const newMatrix: number[] = [];
    // n * m X m * k
    const m = matrix.length / n;
    const k = matrix2.length / m;

    if (!m) {
        return matrix2;
    } else if (!k) {
        return matrix;
    }
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < k; ++j) {
            newMatrix[i * k + j] = 0;
            for (let l = 0; l < m; ++l) {
                newMatrix[i * k + j] += matrix[i * m + l] * matrix2[l * k + j];
            }
        }
    }
    // n * k
    return newMatrix;
}
export function helperInvert(
    matrix: number[],
    n: number = Math.sqrt(matrix.length),
) {
    const newMatrix = matrix.slice();
    const inverseMatrix = createIdentityMatrix(n);

    for (let i = 0; i < n; ++i) {
        const startIndex = n * i;
        const endIndex = n * (i + 1);
        const identityIndex = startIndex + i;

        if (newMatrix[identityIndex] === 0) {
            for (let j = i + 1; j < n; ++j) {
                if (newMatrix[n * j + i]) {
                    swap(newMatrix, inverseMatrix, startIndex, endIndex, n * j);
                    break;
                }
            }
        }
        if (newMatrix[identityIndex]) {
            divide(newMatrix, inverseMatrix, startIndex, endIndex, newMatrix[identityIndex]);
        } else {
            // no inverse matrix
            return [];
        }
        for (let j = 0; j < n; ++j) {
            const targetStartIndex = n * j;
            const targetEndIndex = targetStartIndex + n;
            const targetIndex = targetStartIndex + i;
            const target = newMatrix[targetIndex];

            if (target === 0 || i === j) {
                continue;
            }
            add(newMatrix, inverseMatrix, targetStartIndex, targetEndIndex, startIndex, -target);
        }
    }

    return inverseMatrix;
}
