import { PREFIX, isNotSupportTransformOrigin } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket, isUndefined, isObject, splitUnit, IObject } from "@daybrush/utils";
import { MoveableState } from "./types";
import {
    multiply, invert,
    convertCSStoMatrix, convertMatrixtoCSS,
    convertDimension, createIdentityMatrix,
    createOriginMatrix, convertPositionMatrix, caculate,
    multiplies,
    minus,
    getOrigin,
    createScaleMatrix,
    sum,
    getRad,
} from "@moveable/matrix";

import MoveableManager from "./MoveableManager";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function createIdentityMatrix3() {
    return createIdentityMatrix(3);
}

export function getTransform(target: SVGElement | HTMLElement, isInit: true): number[];
export function getTransform(target: SVGElement | HTMLElement, isInit?: false): "none" | number[];
export function getTransform(target: SVGElement | HTMLElement, isInit?: boolean) {
    const transform = window.getComputedStyle(target).transform!;

    if (!transform || (transform === "none" && !isInit)) {
        return "none";
    }
    return getTransformMatrix(transform);
}

export function getTransformMatrix(transform: string | number[]) {
    if (!transform || transform === "none") {
        return [1, 0, 0, 1, 0, 0];

    }
    if (isObject(transform)) {
        return transform;
    }
    const value = splitBracket(transform).value!;
    return value.split(/s*,\s*/g).map(v => parseFloat(v));
}
export function getAbsoluteMatrix(matrix: number[], n: number, origin: number[]) {

    return multiplies(
        n,
        createOriginMatrix(origin, n),
        matrix,
        createOriginMatrix(origin.map(a => -a), n),
    );
}
export function measureSVGSize(el: SVGElement, unit: string, isHorizontal: boolean) {
    if (unit === "%") {
        const viewBox = el.ownerSVGElement!.viewBox.baseVal;
        return viewBox[isHorizontal ? "width" : "height"] / 100;
    }
    return 1;
}
export function getBeforeTransformOrigin(el: SVGElement) {
    const relativeOrigin = getTransformOrigin(window.getComputedStyle(el, ":before"));

    return relativeOrigin.map((o, i) => {
        const { value, unit } = splitUnit(o);

        return value * measureSVGSize(el, unit, i === 0);
    });
}
export function getTransformOrigin(style: CSSStyleDeclaration, ) {
    const transformOrigin = style.transformOrigin;

    return transformOrigin ? transformOrigin.split(" ") : ["0", "0"];
}
export function caculateMatrixStack(
    target: SVGElement | HTMLElement,
    container: SVGElement | HTMLElement | null,
    prevMatrix?: number[],
    prevN?: number,
): [number[], number[], number[], number[], string, number[], boolean] {
    let el: SVGElement | HTMLElement | null = target;
    const matrixes: number[][] = [];
    const isContainer: boolean = !!prevMatrix || target === container;
    const isSVGGraphicElement = el.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in el;
    let is3d = false;
    let n = 3;
    let transformOrigin!: number[];
    let targetMatrix!: number[];

    while (el && (isContainer || el !== container)) {
        const tagName = el.tagName.toLowerCase();
        const style: CSSStyleDeclaration | null = window.getComputedStyle(el);
        let matrix: number[] = convertCSStoMatrix(getTransformMatrix(style!.transform!));

        if (!is3d && matrix.length === 16) {
            is3d = true;
            n = 4;
            const matrixesLength = matrixes.length;

            for (let i = 0; i < matrixesLength; ++i) {
                matrixes[i] = convertDimension(matrixes[i], 3, 4);
            }
        }
        if (is3d && matrix.length === 9) {
            matrix = convertDimension(matrix, 3, 4);
        }

        let offsetLeft = (el as any).offsetLeft;
        let offsetTop = (el as any).offsetTop;
        // svg
        const isSVG = isUndefined(offsetLeft);
        let hasNotOffset = isSVG;
        let origin: number[];
        // inner svg element
        if (hasNotOffset && tagName !== "svg") {
            origin = isNotSupportTransformOrigin
                ? getBeforeTransformOrigin(el as SVGElement)
                : getTransformOrigin(style).map(pos => parseFloat(pos));

            hasNotOffset = false;

            if (tagName === "g") {
                offsetLeft = 0;
                offsetTop = 0;
            } else {
                [
                    offsetLeft, offsetTop, origin[0], origin[1],
                ] = getSVGGraphicsOffset(el as SVGGraphicsElement, origin);
            }
        } else {
            origin = getTransformOrigin(style).map(pos => parseFloat(pos));
        }
        if (tagName === "svg" && targetMatrix) {
            matrixes.push(
                getSVGMatrix(el as SVGSVGElement, n),
                createIdentityMatrix(n),
            );
        }

        matrixes.push(
            getAbsoluteMatrix(matrix, n, origin),
            createOriginMatrix([
                hasNotOffset ? el : offsetLeft,
                hasNotOffset ? origin : offsetTop,
            ], n),
        );
        if (!targetMatrix) {
            targetMatrix = matrix;
        }
        if (!transformOrigin) {
            transformOrigin = origin;
        }
        if (isContainer) {
            break;
        }

        if (isSVG) {
            el = el.parentElement;
            continue;
        }
        const offsetParent: HTMLElement = (el as any).offsetParent;

        if (!offsetParent) {
            break;
        }
        while (el && el !== container && el !== offsetParent) {
            el = el.parentElement;
        }
    }
    let mat = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    let beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    let offsetMatrix = createIdentityMatrix(n);
    const length = matrixes.length;

    matrixes.reverse();
    matrixes.forEach((matrix, i) => {
        if (length - 2 === i) {
            beforeMatrix = mat.slice();
        }
        if (length - 1 === i) {
            offsetMatrix = mat.slice();
        }

        if (isObject(matrix[n - 1])) {
            [matrix[n - 1], matrix[2 * n - 1]] =
                getSVGOffset(
                    matrix[n - 1] as any,
                    container,
                    n,
                    matrix[2 * n - 1] as any,
                    mat,
                    matrixes[i + 1],
                );
        }
        mat = multiply(
            mat,
            matrix,
            n,
        );
    });
    const isMatrix3d = !isSVGGraphicElement && is3d;
    const transform = `${isMatrix3d ? "matrix3d" : "matrix"}(${
        convertMatrixtoCSS(isSVGGraphicElement && targetMatrix.length === 16
            ? convertDimension(targetMatrix, 4, 3) : targetMatrix)
        })`;

    return [beforeMatrix, offsetMatrix, mat, targetMatrix, transform, transformOrigin, is3d];
}
export function getSVGMatrix(
    el: SVGSVGElement,
    n: number,
) {
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;
    const viewBox = (el as SVGSVGElement).viewBox.baseVal;
    const viewBoxWidth = viewBox.width || clientWidth;
    const viewBoxHeight = viewBox.height || clientHeight;
    const scaleX = clientWidth / viewBoxWidth;
    const scaleY = clientHeight / viewBoxHeight;

    const preserveAspectRatio = (el as SVGSVGElement).preserveAspectRatio.baseVal;
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
    const align = preserveAspectRatio.align;
    // 1 : meet 2: slice
    const meetOrSlice = preserveAspectRatio.meetOrSlice;
    const svgOrigin = [0, 0];
    const scale = [scaleX, scaleY];
    const translate = [0, 0];

    if (align !== 1) {
        const xAlign = (align - 2) % 3;
        const yAlign = Math.floor((align - 2) / 3);

        svgOrigin[0] = viewBoxWidth * xAlign / 2;
        svgOrigin[1] = viewBoxHeight * yAlign / 2;

        const scaleDimension = meetOrSlice === 2 ? Math.max(scaleY, scaleX) : Math.min(scaleX, scaleY);

        scale[0] = scaleDimension;
        scale[1] = scaleDimension;

        translate[0] = (clientWidth - viewBoxWidth) / 2 * xAlign;
        translate[1] = (clientHeight - viewBoxHeight) / 2 * yAlign;
    }

    const scaleMatrix = createScaleMatrix(scale, n);
    [
        scaleMatrix[n - 1],
        scaleMatrix[2 * n - 1],
    ] = translate;

    return getAbsoluteMatrix(
        scaleMatrix,
        n,
        svgOrigin,
    );
}
export function getSVGGraphicsOffset(
    el: SVGGraphicsElement,
    origin: number[],
) {
    if (!(el as SVGGraphicsElement).getBBox) {
        return [0, 0];
    }
    const bbox = (el as SVGGraphicsElement).getBBox();
    const svgElement = el.ownerSVGElement!;
    const viewBox = svgElement.viewBox.baseVal;
    const left = bbox.x - viewBox.x;
    const top = bbox.y - viewBox.y;

    return [
        left,
        top,
        origin[0] - left,
        origin[1] - top,
    ];
}
export function caculatePosition(matrix: number[], pos: number[], n: number) {
    return caculate(matrix, convertPositionMatrix(pos, n), n);
}
export function caculateRect(matrix: number[], width: number, height: number, n: number) {
    const pos1 = caculatePosition(matrix, [0, 0], n);
    const pos2 = caculatePosition(matrix, [width, 0], n);
    const pos3 = caculatePosition(matrix, [0, height], n);
    const pos4 = caculatePosition(matrix, [width, height], n);

    return [pos1, pos2, pos3, pos4];
}
export function getSVGOffset(
    el: SVGElement,
    container: HTMLElement | SVGElement | null,
    n: number, origin: number[], beforeMatrix: number[], absoluteMatrix: number[]) {
    const [width, height] = getSize(el);

    const containerRect = (container || document.documentElement).getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const rectLeft = rect.left - containerRect.left;
    const rectTop = rect.top - containerRect.top;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    const mat = multiplies(
        n,
        beforeMatrix,
        absoluteMatrix,
    );
    const poses = caculateRect(mat, width, height, n);
    const posesX = poses.map(pos => pos[0]);
    const posesY = poses.map(pos => pos[1]);
    const posOrigin = caculatePosition(mat, origin, n);
    const prevLeft = Math.min(...posesX);
    const prevTop = Math.min(...posesY);
    const prevOrigin = minus(posOrigin, [prevLeft, prevTop]);
    const prevWidth = Math.max(...posesX) - prevLeft;
    const prevHeight = Math.max(...posesY) - prevTop;
    const rectOrigin = [
        rectLeft + prevOrigin[0] * rectWidth / prevWidth,
        rectTop + prevOrigin[1] * rectHeight / prevHeight,
    ];
    const offset = [0, 0];
    let count = 0;

    while (++count < 10) {
        const inverseBeforeMatrix = invert(beforeMatrix, n);
        [offset[0], offset[1]] = minus(
            caculatePosition(inverseBeforeMatrix, rectOrigin, n),
            caculatePosition(inverseBeforeMatrix, posOrigin, n),
        );
        const mat2 = multiplies(
            n,
            beforeMatrix,
            createOriginMatrix(offset, n),
            absoluteMatrix,
        );
        const nextPoses = caculateRect(mat2, width, height, n);
        const nextLeft = Math.min(...nextPoses.map(pos => pos[0]));
        const nextTop = Math.min(...nextPoses.map(pos => pos[1]));
        const distLeft = nextLeft - rectLeft;
        const distTop = nextTop - rectTop;

        if (Math.abs(distLeft) < 2 && Math.abs(distTop) < 2) {
            break;
        }
        rectOrigin[0] -= distLeft;
        rectOrigin[1] -= distTop;
    }
    return offset.map(p => Math.round(p));
}
export function caculateMoveablePosition(matrix: number[], origin: number[], width: number, height: number): [
    number[],
    number[],
    number[],
    number[],
    number[],
    number[],
    1 | -1,
] {
    const is3d = matrix.length === 16;
    const n = is3d ? 4 : 3;
    let [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ] = caculateRect(matrix, width, height, n);
    let [originX, originY] = caculatePosition(matrix, origin, n);

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

    const center = [
        (x1 + x2 + x3 + x4) / 4,
        (y1 + y2 + y3 + y4) / 4,
    ];
    const pos1Rad = getRad(center, [x1, y1]);
    const pos2Rad = getRad(center, [x2, y2]);
    const direction =
        (pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI) || (pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI)
            ? 1 : -1;

    return [
        [minX, minY],
        [originX, originY],
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
        direction,
    ];
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

    if (!hasOffset && !width && !height) {
        const bbox = (target as SVGGraphicsElement).getBBox();

        return [bbox.width, bbox.height];
    }
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

export function getTargetInfo(
    target?: HTMLElement | SVGElement,
    container?: HTMLElement | SVGElement,
    state?: Partial<MoveableState> | false | undefined,
): Partial<MoveableState> {
    let left = 0;
    let top = 0;
    let origin = [0, 0];
    let pos1 = [0, 0];
    let pos2 = [0, 0];
    let pos3 = [0, 0];
    let pos4 = [0, 0];
    let beforeMatrix = createIdentityMatrix3();
    let matrix = createIdentityMatrix3();
    let targetMatrix = createIdentityMatrix3();
    let width = 0;
    let height = 0;
    let transformOrigin = [0, 0];
    let direction: 1 | -1 = 1;
    let beforeDirection: 1 | -1 = 1;
    let is3d = false;
    let targetTransform = "";
    let beforeOrigin = [0, 0];

    const prevMatrix = state ? state.beforeMatrix : undefined;
    const prevN = state ? (state.is3d ? 4 : 3) : undefined;

    if (target) {
        if (state) {
            width = state.width!;
            height = state.height!;
        } else {
            const style = window.getComputedStyle(target);

            width = (target as HTMLElement).offsetWidth;
            height = (target as HTMLElement).offsetHeight;

            if (isUndefined(width)) {
                [width, height] = getSize(target, style, true);
            }
        }
        let offsetMatrix: number[];
        [
            beforeMatrix, offsetMatrix, matrix,
            targetMatrix,
            targetTransform, transformOrigin, is3d,
        ] = caculateMatrixStack(target, container!, prevMatrix, prevN);

        [
            [left, top],
            origin,
            pos1,
            pos2,
            pos3,
            pos4,
            direction,
        ] = caculateMoveablePosition(matrix, transformOrigin, width, height);

        const n = is3d ? 4 : 3;
        let beforePos = [0, 0];

        [
            beforePos, beforeOrigin, , , , , beforeDirection,
        ] = caculateMoveablePosition(offsetMatrix, sum(transformOrigin, getOrigin(targetMatrix, n)), width, height);

        beforeOrigin = [
            beforeOrigin[0] + beforePos[0] - left,
            beforeOrigin[1] + beforePos[1] - top,
        ];
    }

    return {
        beforeDirection,
        direction,
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
        targetTransform,
        targetMatrix,
        is3d,
        beforeOrigin,
        origin,
        transformOrigin,
    };
}
export function getDirection(target: SVGElement | HTMLElement) {
    if (!target) {
        return;
    }
    const direciton = target.getAttribute("data-direction")!;

    if (!direciton) {
        return;
    }
    const dir = [0, 0];

    (direciton.indexOf("w") > -1) && (dir[0] = -1);
    (direciton.indexOf("e") > -1) && (dir[0] = 1);
    (direciton.indexOf("n") > -1) && (dir[1] = -1);
    (direciton.indexOf("s") > -1) && (dir[1] = 1);

    return dir;
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
    return nums;
}

export function unset(self: any, name: string) {
    if (self[name]) {
        self[name].unset();
        self[name] = null;
    }
}

export function getOrientationDirection(pos: number[], pos1: number[], pos2: number[]) {
    return (pos[0] - pos1[0]) * (pos2[1] - pos1[1]) - (pos[1] - pos1[1]) * (pos2[0] - pos1[0]);
}
export function isInside(pos: number[], pos1: number[], pos2: number[], pos3: number[], pos4: number[]) {
    const k1 = getOrientationDirection(pos, pos1, pos2);
    const k2 = getOrientationDirection(pos, pos2, pos4);
    const k3 = getOrientationDirection(pos, pos4, pos1);

    const k4 = getOrientationDirection(pos, pos2, pos4);
    const k5 = getOrientationDirection(pos, pos4, pos3);
    const k6 = getOrientationDirection(pos, pos3, pos2);
    const signs1 = [k1, k2, k3];
    const signs2 = [k4, k5, k6];

    if (
        signs1.every(sign => sign >= 0)
        || signs1.every(sign => sign <= 0)
        || signs2.every(sign => sign >= 0)
        || signs2.every(sign => sign <= 0)
    ) {
        return true;
    }
    return false;
}

export function triggerEvent<T extends IObject<any>, U extends keyof T>(
    moveable: MoveableManager<T>,
    name: U,
    e: T[U] extends ((e: infer P) => any) | undefined ? P : {},
): any {
    return moveable.triggerEvent(name, e as any);
}
