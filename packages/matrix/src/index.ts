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

export function ignoreDimension(
    matrix: number[],
    m: number,
    n: number = Math.sqrt(matrix.length),
) {
    const newMatrix = matrix.slice();

    for (let i = 0; i < n; ++i) {
        newMatrix[i * n + m - 1] = 0;
        newMatrix[(m - 1) * n + i] = 0;
    }
    newMatrix[(m - 1) * (n + 1)] = 1;

    return newMatrix;
}

export function invert(
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

export function transpose(matrix: number[], n: number = Math.sqrt(matrix.length)) {
    const newMatrix: number[] = [];

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            newMatrix[j * n + i] = matrix[n * i + j];
        }
    }
    return newMatrix;
}

export function getRad(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const rad = Math.atan2(distY, distX);

    return rad >= 0 ? rad : rad + Math.PI * 2;
}

export function getOrigin(matrix: number[], n: number = Math.sqrt(matrix.length)) {
    const originMatrix: number[] = [];

    for (let i = 0; i < n - 1; ++i) {
        originMatrix[i] = matrix[(i + 1) * n - 1];
    }
    originMatrix[n - 1] = 0;
    return originMatrix;
}

export function convertPositionMatrix(matrix: number[], n: number) {
    const newMatrix = matrix.slice();

    for (let i = matrix.length; i < n - 1; ++i) {
        newMatrix[i] = 0;
    }
    newMatrix[n - 1] = 1;
    return newMatrix;
}

export function convertDimension(matrix: number[], n: number = Math.sqrt(matrix.length), m: number) {
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

export function multiplies(n: number, ...matrixes: number[][]) {
    let m: number[] = createIdentityMatrix(n);

    matrixes.forEach(matrix => {
        m = multiply(m, matrix, n);
    });
    return m;
}

export function multiply(matrix: number[], matrix2: number[], n: number) {
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

export function multiplyCSS(matrix: number[], matrix2: number[], n: number = Math.sqrt(matrix.length)) {
    const newMatrix: number[] = [];
    // n(y) * m(x) X m(y) * k(x)
    const m = matrix.length / n;
    const k = matrix2.length / m;

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < k; ++j) {
            newMatrix[i + j * k] = 0;
            for (let l = 0; l < m; ++l) {
                newMatrix[i + j * k] += matrix[i + l * m] * matrix2[l + j * k];
            }
        }
    }
    // n * k
    return newMatrix;
}
export function sum(...nums: number[]) {
    const length = nums.length;
    let total = 0;

    for (let i = length - 1; i >= 0; --i) {
        total += nums[i];
    }
    return total;
}
export function average(...nums: number[]) {
    const length = nums.length;
    let total = 0;

    for (let i = length - 1; i >= 0; --i) {
        total += nums[i];
    }
    return length ? total / length : 0;
}
export function plus(pos1: number[], pos2: number[]) {
    const length = Math.min(pos1.length, pos2.length);
    const nextPos = pos1.slice();

    for (let i = 0; i < length; ++i) {
        nextPos[i] = nextPos[i] + pos2[i];
    }
    return nextPos;
}

export function minus(pos1: number[], pos2: number[]) {
    const length = Math.min(pos1.length, pos2.length);
    const nextPos = pos1.slice();

    for (let i = 0; i < length; ++i) {
        nextPos[i] = nextPos[i] - pos2[i];
    }
    return nextPos;
}

export function caculate(matrix: number[], matrix2: number[], n: number = matrix2.length) {
    const result = multiply(matrix, matrix2, n);
    const k = result[n - 1];
    return result.map(v => v / k);
}

export function rotate(pos: number[], rad: number) {
    return caculate(
        createRotateMatrix(rad, 3),
        convertPositionMatrix(pos, 3),
    );
}

export function convertCSStoMatrix(a: number[]) {
    if (a.length === 6) {
        return [
            a[0], a[2], a[4],
            a[1], a[3], a[5],
            0, 0, 1,
        ];
    }
    return transpose(a);
}
export function convertMatrixtoCSS(a: number[]) {
    if (a.length === 9) {
        return [
            a[0], a[3],
            a[1], a[4],
            a[2], a[5],
        ];
    }
    return transpose(a);
}
export function createRotateMatrix(rad: number, n: number) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const m = createIdentityMatrix(n);

    m[0] = cos;
    m[1] = -sin;
    m[n] = sin;
    m[n + 1] = cos;

    return m;
}

export function createIdentityMatrix(n: number) {
    const length = n * n;
    const matrix: number[] = [];

    for (let i = 0; i < length; ++i) {
        matrix[i] = i % (n + 1) ? 0 : 1;
    }
    return matrix;
}
export function createScaleMatrix(scale: number[], n: number) {
    const m = createIdentityMatrix(n);
    const length = Math.min(scale.length, n - 1);

    for (let i = 0; i < length; ++i) {
        m[(n + 1) * i] = scale[i];
    }
    return m;
}
export function createOriginMatrix(origin: number[], n: number) {
    const m = createIdentityMatrix(n);
    const length = Math.min(origin.length, n - 1);

    for (let i = 0; i < length; ++i) {
        m[n * (i + 1) - 1] = origin[i];
    }
    return m;
}

export function createWarpMatrix(
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
