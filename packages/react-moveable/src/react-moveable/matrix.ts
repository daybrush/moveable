
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

export function createIdentityMatrix(n: number) {
    const length = n * n;
    const matrix = [];

    for (let i = 0; i < length; ++i) {
        matrix[i] = i % (n + 1) ? 0 : 1;
    }
    return matrix;
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
    const newMatrix = [];

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            newMatrix[j * n + i] = matrix[n * i + j];
        }
    }
    return newMatrix;
}
export function convertDimension(matrix: number[], n: number = Math.sqrt(matrix.length), m: number) {
    // n < m
    const newMatrix = createIdentityMatrix(m);

    for (let i = 0; i < n - 1; ++i) {
        for (let j = 0; j < n - 1; ++j) {
            newMatrix[i * m + j] = matrix[i * n + j];
        }

        newMatrix[(i + 1) * m - 1] = matrix[(i + 1) * n - 1];
        newMatrix[(m - 1) * m + i] = matrix[(n - 1) * n + i];
    }
    newMatrix[m * m - 1] = matrix[n * n - 1];

    return newMatrix;
}
export function multiply(matrix: number[], matrix2: number[], n: number) {
    const newMatrix = [];
    // n * m X m * k
    const m = matrix.length / n;
    const k = matrix2.length / m;

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
            a[2], a[4],
        ];
    }
    return transpose(a);
}
