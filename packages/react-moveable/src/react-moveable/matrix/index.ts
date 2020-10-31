function add(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    fromIndex: number,
    n: number,
    k: number,
) {
    for (let i = 0; i < n; ++i) {
        const x = startIndex + i * n;
        const fromX = fromIndex + i * n;
        matrix[x] += matrix[fromX] * k;
        inverseMatrix[x] += inverseMatrix[fromX] * k;
    }
}

function swap(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    fromIndex: number,
    n: number,
) {
    for (let i = 0; i < n; ++i) {
        const x = startIndex + i * n;
        const fromX = fromIndex + i * n;
        const v = matrix[x];
        const iv = inverseMatrix[x];

        matrix[x] = matrix[fromX];
        matrix[fromX] = v;

        inverseMatrix[x] = inverseMatrix[fromX];
        inverseMatrix[fromX] = iv;
    }
}

function divide(
    matrix: number[],
    inverseMatrix: number[],
    startIndex: number,
    n: number,
    k: number,
) {
    for (let i = 0; i < n; ++i) {
        const x = startIndex + i * n;

        matrix[x] /= k;
        inverseMatrix[x] /= k;
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
        // diagonal
        const identityIndex = n * i + i;

        if (newMatrix[identityIndex] === 0) {
            for (let j = i + 1; j < n; ++j) {
                if (newMatrix[n * i + j]) {
                    swap(newMatrix, inverseMatrix, i, j, n);
                    break;
                }
            }
        }
        if (newMatrix[identityIndex]) {
            divide(newMatrix, inverseMatrix, i, n, newMatrix[identityIndex]);
        } else {
            // no inverse matrix
            return [];
        }
        for (let j = 0; j < n; ++j) {
            const targetStartIndex = j;
            const targetIndex = j + i * n;
            const target = newMatrix[targetIndex];

            if (target === 0 || i === j) {
                continue;
            }
            add(newMatrix, inverseMatrix, targetStartIndex, i, n, -target);
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
    const w = matrix[n * n - 1];
    for (let i = 0; i < n - 1; ++i) {
        originMatrix[i] = matrix[n * (n - 1) + i] / w;
    }
    originMatrix[n - 1] = 0;
    return originMatrix;
}

export function fromTranslation(pos: number[], n: number) {
    const newMatrix = createIdentityMatrix(n);

    for (let i = 0; i < n - 1; ++i) {
        newMatrix[n * (n - 1) + i] = pos[i] || 0;
    }
    return newMatrix;
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

export function multiply(matrix: number[], matrix2: number[], n: number = Math.sqrt(matrix.length)) {
    const newMatrix: number[] = [];
    // 1 y: n
    // 1 x: m
    // 2 x: m
    // 2 y: k
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
            newMatrix[j * n + i] = 0;
            for (let l = 0; l < m; ++l) {
                // m1 x: m(l), y: n(i)
                // m2 x: k(j):  y: m(l)
                // nw x: n(i), y: k(j)
                newMatrix[j * n + i] += matrix[l * n + i] * matrix2[j * m + l];
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

export function convertCSStoMatrix(a: number[], is2d: boolean = a.length === 6) {
    if (is2d) {
        return [
            a[0], a[1], 0,
            a[2], a[3], 0,
            a[4], a[5], 1,
        ];
    }
    return a;
}
export function convertMatrixtoCSS(a: number[], is2d: boolean = a.length === 9) {
    if (is2d) {
        return [
            a[0], a[1],
            a[3], a[4],
            a[6], a[7],
        ];
    }
    return a;
}

export function calculate(matrix: number[], matrix2: number[], n: number = matrix2.length) {
    const result = multiply(matrix, matrix2, n);
    const k = result[n - 1];
    return result.map(v => v / k);
}

export function rotate(pos: number[], rad: number) {
    return calculate(
        createRotateMatrix(rad, 3),
        convertPositionMatrix(pos, 3),
    );
}

export function createRotateMatrix(rad: number, n: number) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const m = createIdentityMatrix(n);

    // cos -sin
    // sin cos
    m[0] = cos;
    m[1] = sin;
    m[n] = -sin;
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
        m[n * (n - 1) + i] = origin[i];
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
        x0, 0, x1, 0, x2, 0, x3, 0,
        y0, 0, y1, 0, y2, 0, y3, 0,
        1, 0, 1, 0, 1, 0, 1, 0,
        0, x0, 0, x1, 0, x2, 0, x3,
        0, y0, 0, y1, 0, y2, 0, y3,
        0, 1, 0, 1, 0, 1, 0, 1,
        -u0 * x0, -v0 * x0, -u1 * x1, -v1 * x1, -u2 * x2, -v2 * x2, -u3 * x3, -v3 * x3,
        -u0 * y0, -v0 * y0, -u1 * y1, -v1 * y1, -u2 * y2, -v2 * y2, -u3 * y3, -v3 * y3,
    ];
    const inverseMatrix = invert(matrix, 8);

    if (!inverseMatrix.length) {
        return [];
    }
    const h = multiply(inverseMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);

    h[8] = 1;
    return convertDimension(transpose(h), 3, 4);
}
