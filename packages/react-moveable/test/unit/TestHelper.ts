import MoveableManager from "../../src/react-moveable/MoveableManager";
import {  createRotateMatrix, caculate, minus, plus, createIdentityMatrix } from "../../src/react-moveable/matrix";
import { RotatableProps } from "../../src/react-moveable";
import { getClientRect } from "../../src/react-moveable/utils";

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
function multiply(matrix: number[], matrix2: number[], n: number) {
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

function invert(
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

function convertDimension(matrix: number[], n: number = Math.sqrt(matrix.length), m: number) {
    // n < m
    if (n === m) {
        return matrix;
    }
    const newMatrix = createIdentityMatrix(m);

    const length = Math.min(n, m);
    for (let i = 0; i < length - 1; ++i) {
        for (let j = 0; j < length - 1; ++j) {
            newMatrix[i * m + j] = matrix[i * n + j];
        }

        newMatrix[(i + 1) * m - 1] = matrix[(i + 1) * n - 1];
        newMatrix[(m - 1) * m + i] = matrix[(n - 1) * n + i];
    }
    newMatrix[m * m - 1] = matrix[n * n - 1];

    return newMatrix;
}

function transpose(matrix: number[], n: number = Math.sqrt(matrix.length)) {
    const newMatrix: number[] = [];

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            newMatrix[j * n + i] = matrix[n * i + j];
        }
    }
    return newMatrix;
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

export function helperCreateWarpMatrix(
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
        return [];
    }
    const h = multiply(inverseMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);

    h[8] = 1;
    return convertDimension(h, 3, 4);
}

export function helperCaculate(matrix: number[], matrix2: number[], n: number = matrix2.length) {
    const result = multiply(matrix, matrix2, n);
    const k = result[n - 1];
    return result.map(v => v / k);
}
