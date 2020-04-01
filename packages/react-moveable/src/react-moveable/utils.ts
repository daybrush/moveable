import { PREFIX, IS_WEBKIT } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket, isUndefined, isObject, splitUnit, IObject } from "@daybrush/utils";
import {
    multiply, invert,
    convertCSStoMatrix, convertMatrixtoCSS,
    convertDimension, createIdentityMatrix,
    createOriginMatrix, convertPositionMatrix, caculate,
    multiplies,
    minus,
    getOrigin,
    createScaleMatrix,
    plus,
    getRad,
    ignoreDimension,
} from "@moveable/matrix";

import MoveableManager from "./MoveableManager";
import { MoveableManagerState, Able, MoveableClientRect } from "./types";

export function round(num: number) {
    return Math.round(num);
}
export function multiply2(pos1: number[], pos2: number[]) {
    return [
        pos1[0] * pos2[0],
        pos1[1] * pos2[1],
    ];
}
export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function createIdentityMatrix3() {
    return createIdentityMatrix(3);
}

export function getTransform(target: SVGElement | HTMLElement, isInit: true): number[];
export function getTransform(target: SVGElement | HTMLElement, isInit?: false): "none" | number[];
export function getTransform(target: SVGElement | HTMLElement, isInit?: boolean) {
    const transform = getComputedStyle(target).transform!;

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
        const viewBox = getSVGViewBox(el.ownerSVGElement!);
        return viewBox[isHorizontal ? "width" : "height"] / 100;
    }
    return 1;
}
export function getBeforeTransformOrigin(el: SVGElement) {
    const relativeOrigin = getTransformOrigin(getComputedStyle(el, ":before"));

    return relativeOrigin.map((o, i) => {
        const { value, unit } = splitUnit(o);

        return value * measureSVGSize(el, unit, i === 0);
    });
}
export function getTransformOrigin(style: CSSStyleDeclaration) {
    const transformOrigin = style.transformOrigin;

    return transformOrigin ? transformOrigin.split(" ") : ["0", "0"];
}
export function getOffsetInfo(
    el: SVGElement | HTMLElement | null | undefined,
    lastParent: SVGElement | HTMLElement | null | undefined,
    isParent?: boolean,
) {
    const body = document.body;
    let target = !el || isParent ? el : el.parentElement;
    let isEnd = false;
    let position = "relative";

    while (target && target !== body) {
        if (lastParent === target) {
            isEnd = true;
        }
        const style = getComputedStyle(target);
        const transform = style.transform;
        position = style.position!;

        if (position !== "static" || (transform && transform !== "none")) {
            break;
        }
        target = target.parentElement;
        position = "relative";
    }
    return {
        isStatic: position === "static",
        isEnd: isEnd || !target || target === body,
        offsetParent: target as HTMLElement || body,
    };

}
export function getOffsetPosInfo(
    el: HTMLElement | SVGElement,
    container: SVGElement | HTMLElement | null,
    style: CSSStyleDeclaration,
    isFixed: boolean,
) {
    const tagName = el.tagName.toLowerCase();
    let offsetLeft = (el as HTMLElement).offsetLeft;
    let offsetTop = (el as HTMLElement).offsetTop;

    if (isFixed) {
        const containerClientRect = (container || document.documentElement).getBoundingClientRect();

        offsetLeft -= containerClientRect.left;
        offsetTop -= containerClientRect.top;
    }
    // svg
    const isSVG = isUndefined(offsetLeft);
    let hasOffset = !isSVG;
    let origin: number[];
    // inner svg element
    if (!hasOffset && tagName !== "svg") {
        origin = IS_WEBKIT
            ? getBeforeTransformOrigin(el as SVGElement)
            : getTransformOrigin(style).map(pos => parseFloat(pos));

        hasOffset = true;

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
    return {
        isSVG,
        hasOffset,
        offset: [offsetLeft, offsetTop],
        origin,
    };
}
export function getMatrixStackInfo(
    target: SVGElement | HTMLElement,
    container: SVGElement | HTMLElement | null,
    prevMatrix?: number[],
) {
    let el: SVGElement | HTMLElement | null = target;
    const matrixes: number[][] = [];
    let isEnd = false;
    let is3d = false;
    let n = 3;
    let transformOrigin!: number[];
    let targetMatrix!: number[];

    const offsetContainer = getOffsetInfo(container, container, true).offsetParent;

    if (prevMatrix) {
        isEnd = target === container;
        if (prevMatrix.length > 10) {
            is3d = true;
            n = 4;
        }
        container = target.parentElement;
    }

    while (el && !isEnd) {
        const style: CSSStyleDeclaration = getComputedStyle(el);
        const tagName = el.tagName.toLowerCase();
        const position = style.position;
        const isFixed = position === "fixed";
        const styleTransform = style.transform!;
        let matrix: number[] = convertCSStoMatrix(getTransformMatrix(styleTransform));

        // convert 3 to 4
        const length = matrix.length;
        if (!is3d && length === 16) {
            is3d = true;
            n = 4;
            const matrixesLength = matrixes.length;

            for (let i = 0; i < matrixesLength; ++i) {
                matrixes[i] = convertDimension(matrixes[i], 3, 4);
            }
        }
        if (is3d &&  length === 9) {
            matrix = convertDimension(matrix, 3, 4);
        }
        const {
            hasOffset,
            isSVG,
            origin,
            offset: offsetPos,
        } = getOffsetPosInfo(el, container, style, isFixed);
        let [
            offsetLeft,
            offsetTop,
        ] = offsetPos;
        if (tagName === "svg" && targetMatrix) {
            matrixes.push(
                // scale matrix for svg's SVGElements.
                getSVGMatrix(el as SVGSVGElement, n),
                createIdentityMatrix(n),
            );
        }
        const {
            offsetParent,
            isEnd: isOffsetEnd,
            isStatic,
        } = getOffsetInfo(el, container);

        if (IS_WEBKIT && hasOffset && !isSVG && isStatic && position === "relative") {
            offsetLeft -= offsetParent.offsetLeft;
            offsetTop -= offsetParent.offsetTop;
            isEnd = isEnd || isOffsetEnd;
        }
        let parentClientLeft = 0;
        let parentClientTop = 0;

        if (hasOffset && offsetContainer !== offsetParent) {
            // border
            parentClientLeft = offsetParent.clientLeft;
            parentClientTop = offsetParent.clientTop;
        }
        matrixes.push(
            // absolute matrix
            getAbsoluteMatrix(matrix, n, origin),
            // offset matrix (offsetPos + clientPos(border))
            createOriginMatrix(hasOffset ? [
                offsetLeft - el.scrollLeft + parentClientLeft,
                offsetTop - el.scrollTop + parentClientTop,
            ] : [el, origin] as any, n),
        );
        if (!targetMatrix) {
            targetMatrix = matrix;
        }
        if (!transformOrigin) {
            transformOrigin = origin;
        }
        if (isEnd || isFixed) {
            break;
        } else {
            el = offsetParent;
            isEnd = isOffsetEnd;
        }
    }
    if (!targetMatrix) {
        targetMatrix = createIdentityMatrix(n);
    }
    if (!transformOrigin) {
        transformOrigin = [0, 0];
    }
    return {
        offsetContainer,
        matrixes,
        targetMatrix,
        transformOrigin,
        is3d,
    };
}
export function caculateMatrixStack(
    target: SVGElement | HTMLElement,
    container: SVGElement | HTMLElement | null,
    rootContainer: SVGElement | HTMLElement | null,
    prevMatrix?: number[],
    prevRootMatrix?: number[],
    prevN?: number,
): [number[], number[], number[], number[], number[], string, number[], boolean] {
    const {
        matrixes,
        is3d,
        targetMatrix: prevTargetMatrix,
        transformOrigin,
        offsetContainer,
    } = getMatrixStackInfo(target, container, prevMatrix);
    const {
        matrixes: rootMatrixes,
        is3d: isRoot3d,
    } = getMatrixStackInfo(offsetContainer, rootContainer, prevRootMatrix);

    const n = isRoot3d || is3d ? 4 : 3;
    const isSVGGraphicElement = target.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in target;
    const originalContainer = container || document.body;
    let allMatrix = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    let targetMatrix = prevTargetMatrix;
    let rootMatrix = prevRootMatrix ? convertDimension(prevRootMatrix, prevN!, n) : createIdentityMatrix(n);
    let beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    let offsetMatrix = createIdentityMatrix(n);
    const length = matrixes.length;
    const endContainer = getOffsetInfo(originalContainer, originalContainer, true).offsetParent;

    rootMatrixes.reverse();
    matrixes.reverse();

    if (!is3d && isRoot3d) {
        targetMatrix = convertDimension(targetMatrix, 3, 4);
        matrixes.forEach((matrix, i) => {
            matrixes[i] = convertDimension(matrix, 3, 4);
        });
    }
    if (is3d && !isRoot3d) {
        rootMatrixes.forEach((matrix, i) => {
            rootMatrixes[i] = convertDimension(matrix, 3, 4);
        });
    }

    // rootMatrix = (...) -> container -> offset -> absolute -> offset -> absolute(targetMatrix)
    // beforeMatrix = (... -> container -> offset -> absolute) -> offset -> absolute(targetMatrix)
    // offsetMatrix = (... -> container -> offset -> absolute -> offset) -> absolute(targetMatrix)

    if (!prevRootMatrix) {
        rootMatrixes.forEach(matrix => {
            rootMatrix = multiply(rootMatrix, matrix, n);
        });
    }
    matrixes.forEach((matrix, i) => {
        if (length - 2 === i) {
            // length - 3
            beforeMatrix = allMatrix.slice();
        }
        if (length - 1 === i) {
            // length - 2
            offsetMatrix = allMatrix.slice();
        }

        // caculate for SVGElement
        if (isObject(matrix[n - 1])) {
            [matrix[n - 1], matrix[2 * n - 1]] =
                getSVGOffset(
                    matrix[n - 1] as any,
                    endContainer,
                    n,
                    matrix[2 * n - 1] as any,
                    allMatrix,
                    matrixes[i + 1],
                );
        }
        allMatrix = multiply(allMatrix, matrix, n);
    });
    const isMatrix3d = !isSVGGraphicElement && is3d;

    if (!targetMatrix) {
        targetMatrix = createIdentityMatrix(isMatrix3d ? 4 : 3);
    }
    const transform = `${isMatrix3d ? "matrix3d" : "matrix"}(${
        convertMatrixtoCSS(isSVGGraphicElement && targetMatrix.length === 16
            ? convertDimension(targetMatrix, 4, 3) : targetMatrix)
        })`;

    rootMatrix = ignoreDimension(rootMatrix, n, n);
    return [
        rootMatrix,
        beforeMatrix,
        offsetMatrix,
        allMatrix,
        targetMatrix,
        transform,
        transformOrigin,
        is3d || isRoot3d,
    ];
}
export function getSVGViewBox(el: SVGSVGElement) {
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;
    const viewBox = el.viewBox;
    const baseVal = viewBox && viewBox.baseVal || { x: 0, y: 0, width: 0, height: 0 };

    return {
        x: baseVal.x,
        y: baseVal.y,
        width: baseVal.width || clientWidth,
        height: baseVal.height || clientHeight,
    };
}
export function getSVGMatrix(
    el: SVGSVGElement,
    n: number,
) {
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;
    const {
        width: viewBoxWidth,
        height: viewBoxHeight,
    } = getSVGViewBox(el);
    const scaleX = clientWidth / viewBoxWidth;
    const scaleY = clientHeight / viewBoxHeight;

    const preserveAspectRatio = el.preserveAspectRatio.baseVal;
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
    if (!el.getBBox) {
        return [0, 0];
    }
    const bbox = el.getBBox();
    const viewBox = getSVGViewBox(el.ownerSVGElement!);
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
export function caculatePoses(matrix: number[], width: number, height: number, n: number) {
    const pos1 = caculatePosition(matrix, [0, 0], n);
    const pos2 = caculatePosition(matrix, [width, 0], n);
    const pos3 = caculatePosition(matrix, [0, height], n);
    const pos4 = caculatePosition(matrix, [width, height], n);

    return [pos1, pos2, pos3, pos4];
}
export function getRect(poses: number[][]) {
    const posesX = poses.map(pos => pos[0]);
    const posesY = poses.map(pos => pos[1]);
    const left = Math.min(...posesX);
    const top = Math.min(...posesY);
    const right = Math.max(...posesX);
    const bottom = Math.max(...posesY);
    const rectWidth = right - left;
    const rectHeight = bottom - top;

    return {
        left, top,
        right, bottom,
        width: rectWidth,
        height: rectHeight,
    };
}
export function caculateRect(matrix: number[], width: number, height: number, n: number) {
    const poses = caculatePoses(matrix, width, height, n);

    return getRect(poses);
}
export function getSVGOffset(
    el: SVGElement,
    container: HTMLElement | SVGElement,
    n: number, origin: number[], beforeMatrix: number[], absoluteMatrix: number[]) {

    const [width, height] = getSize(el);
    const containerClientRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const rectLeft = rect.left - containerClientRect.left + container.scrollLeft;
    const rectTop = rect.top - containerClientRect.top + container.scrollTop;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    const mat = multiplies(
        n,
        beforeMatrix,
        absoluteMatrix,
    );
    const {
        left: prevLeft,
        top: prevTop,
        width: prevWidth,
        height: prevHeight,
    } = caculateRect(mat, width, height, n);
    const posOrigin = caculatePosition(mat, origin, n);
    const prevOrigin = minus(posOrigin, [prevLeft, prevTop]);
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
        const {
            left: nextLeft,
            top: nextTop,
        } = caculateRect(mat2, width, height, n);
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
    ] = caculatePoses(matrix, width, height, n);
    let [originX, originY] = caculatePosition(matrix, origin, n);

    const left = Math.min(x1, x2, x3, x4);
    const top = Math.min(y1, y2, y3, y4);
    const right = Math.max(x1, x2, x3, x4);
    const bottom = Math.max(y1, y2, y3, y4);

    x1 = (x1 - left) || 0;
    x2 = (x2 - left) || 0;
    x3 = (x3 - left) || 0;
    x4 = (x4 - left) || 0;

    y1 = (y1 - top) || 0;
    y2 = (y2 - top) || 0;
    y3 = (y3 - top) || 0;
    y4 = (y4 - top) || 0;

    originX = (originX - left) || 0;
    originY = (originY - top) || 0;

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
        [left, top, right, bottom],
        [originX, originY],
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
        direction,
    ];
}
export function getDistSize(vec: number[]) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}
export function getDiagonalSize(pos1: number[], pos2: number[]) {
    return getDistSize([
        pos2[0] - pos1[0],
        pos2[1] - pos1[1],
    ]);
}
export function getLineStyle(pos1: number[], pos2: number[], rad: number = getRad(pos1, pos2)) {
    const width = getDiagonalSize(pos1, pos2);

    return {
        transform: `translateY(-50%) translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad)`,
        width: `${width}px`,
    };
}
export function getControlTransform(rotation: number, ...poses: number[][]) {
    const length = poses.length;

    const x = poses.reduce((prev, pos) => prev + pos[0], 0) / length;
    const y = poses.reduce((prev, pos) => prev + pos[1], 0) / length;
    return {
        transform: `translate(${x}px, ${y}px) rotate(${rotation}rad)`,
    };
}
export function getCSSSize(target: SVGElement | HTMLElement) {
    const style = window.getComputedStyle(target);

    return [
        parseFloat(style.width!),
        parseFloat(style.height!),
    ];
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
export function getRotationRad(
    poses: number[][],
    direction: number,
) {
    return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
}
export function getTargetInfo(
    target?: HTMLElement | SVGElement,
    container?: HTMLElement | SVGElement | null,
    parentContainer?: HTMLElement | SVGElement | null,
    rootContainer?: HTMLElement | SVGElement | null,
    state?: Partial<MoveableManagerState> | false | undefined,
): Partial<MoveableManagerState> {
    let left = 0;
    let top = 0;
    let right = 0;
    let bottom = 0;
    let origin = [0, 0];
    let pos1 = [0, 0];
    let pos2 = [0, 0];
    let pos3 = [0, 0];
    let pos4 = [0, 0];
    let rootMatrix = createIdentityMatrix3();
    let offsetMatrix = createIdentityMatrix3();
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
    let targetClientRect = resetClientRect();
    let containerClientRect = resetClientRect();
    let rotation = 0;

    const prevMatrix = state ? state.beforeMatrix : undefined;
    const prevRootMatrix = state ? state.rootMatrix : undefined;
    const prevN = state ? (state.is3d ? 4 : 3) : undefined;

    if (target) {
        if (state) {
            width = state.width!;
            height = state.height!;
        } else {
            const style = getComputedStyle(target);

            width = (target as HTMLElement).offsetWidth;
            height = (target as HTMLElement).offsetHeight;

            if (isUndefined(width)) {
                [width, height] = getSize(target, style, true);
            }
        }
        [
            rootMatrix,
            beforeMatrix,
            offsetMatrix,
            matrix,
            targetMatrix,
            targetTransform, transformOrigin, is3d,
        ] = caculateMatrixStack(
            target, container!, rootContainer!,
            prevMatrix, prevRootMatrix, prevN,
        );

        [
            [left, top, right, bottom],
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
        ] = caculateMoveablePosition(offsetMatrix, plus(transformOrigin, getOrigin(targetMatrix, n)), width, height);

        beforeOrigin = [
            beforeOrigin[0] + beforePos[0] - left,
            beforeOrigin[1] + beforePos[1] - top,
        ];

        targetClientRect = getClientRect(target);
        containerClientRect = getClientRect(
            getOffsetInfo(parentContainer, parentContainer, true).offsetParent || document.body,
            true,
        );
        rotation = getRotationRad([pos1, pos2], direction);
    }

    return {
        rotation,
        targetClientRect,
        containerClientRect,
        beforeDirection,
        direction,
        target,
        left,
        top,
        right,
        bottom,
        pos1,
        pos2,
        pos3,
        pos4,
        width,
        height,
        rootMatrix,
        beforeMatrix,
        offsetMatrix,
        targetMatrix,
        matrix,
        targetTransform,
        is3d,
        beforeOrigin,
        origin,
        transformOrigin,
    };
}
export function resetClientRect(): MoveableClientRect {
    return {
        left: 0, right: 0,
        top: 0, bottom: 0,
        width: 0, height: 0,
        clientLeft: 0, clientTop: 0,
        clientWidth: 0, clientHeight: 0,
        scrollWidth: 0, scrollHeight: 0,
    };
}
export function getClientRect(el: HTMLElement | SVGElement, isExtends?: boolean) {
    const { left, width, top, bottom, right, height } = el.getBoundingClientRect();

    const rect: MoveableClientRect = {
        left,
        right,
        top,
        bottom,
        width,
        height,
    };

    if (isExtends) {
        rect.clientLeft = el.clientLeft;
        rect.clientTop = el.clientTop;
        rect.clientWidth = el.clientWidth;
        rect.clientHeight = el.clientHeight;
        rect.scrollWidth = el.scrollWidth;
        rect.scrollHeight = el.scrollHeight;
    }
    return rect;
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
export function getAbsolutePoses(poses: number[][], dist: number[]) {
    return [
        plus(dist, poses[0]),
        plus(dist, poses[1]),
        plus(dist, poses[2]),
        plus(dist, poses[3]),
    ];
}
export function getAbsolutePosesByState({
    left,
    top,
    pos1,
    pos2,
    pos3,
    pos4,
}: {
    left: number,
    top: number,
    pos1: number[],
    pos2: number[],
    pos3: number[],
    pos4: number[],
}) {
    return getAbsolutePoses([pos1, pos2, pos3, pos4], [left, top]);
}
export function roundSign(num: number) {
    return Math.round(num % 1 === -0.5 ? num - 1 : num);
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

export function fillParams<T extends IObject<any>>(
    moveable: MoveableManager,
    e: any,
    params: Pick<T, Exclude<keyof T, "target" | "clientX" | "clientY" | "inputEvent" | "datas" | "currentTarget">>,
): T {
    const datas = e.datas;

    if (!datas.datas) {
        datas.datas = {};
    }
    return {
        ...params,
        target: moveable.state.target,
        clientX: e.clientX,
        clientY: e.clientY,
        inputEvent: e.inputEvent,
        currentTarget: moveable,
        datas: datas.datas,
    } as any;
}

export function triggerEvent<T extends IObject<any>, U extends keyof T>(
    moveable: MoveableManager<T>,
    name: U & string,
    params: T[U] extends ((e: infer P) => any) | undefined ? P : {},
    isManager?: boolean,
): any {
    if (isManager) {
        MoveableManager.prototype.triggerEvent.call(moveable, name, params);
    }
    return moveable.triggerEvent(name, params);
}

export function getComputedStyle(el: HTMLElement | SVGElement, pseudoElt?: string | null) {
    return window.getComputedStyle(el, pseudoElt);
}

export function filterAbles(
    ables: Able[], methods: Array<keyof Able>,
    triggerAblesSimultaneously?: boolean,
) {
    const enabledAbles: IObject<boolean> = {};
    const ableGroups: IObject<boolean> = {};

    return ables.filter(able => {
        const name = able.name;

        if (enabledAbles[name] || !methods.some(method => able[method])) {
            return false;
        }
        if (!triggerAblesSimultaneously && able.ableGroup) {
            if (ableGroups[able.ableGroup]) {
                return false;
            }
            ableGroups[able.ableGroup] = true;
        }
        enabledAbles[name] = true;
        return true;
    });
}

export function getKeepRatioHeight(width: number, isWidth: boolean, ratio: number) {
    return width * (isWidth ? ratio : 1 / ratio);
}
export function getKeepRatioWidth(height: number, isWidth: boolean, ratio: number) {
    return height * (isWidth ? 1 / ratio : ratio);
}

export function equals(a1: any, a2: any) {
    return a1 === a2 || (a1 == null && a2 == null);
}

export function selectValue<T = any>(...values: any[]): T {
    const length = values.length - 1;
    for (let i = 0; i < length; ++i) {
        const value = values[i];

        if (!isUndefined(value)) {
            return value;
        }
    }

    return values[length];
}

export function groupBy<T>(arr: T[], func: (el: T, index: number, arr: T[]) => any) {
    const groups: T[][] = [];
    const groupKeys: any[] = [];

    arr.forEach((el, index) => {
        const groupKey = func(el, index, arr);
        const keyIndex = groupKeys.indexOf(groupKey);
        const group = groups[keyIndex] || [];

        if (keyIndex === -1) {
            groupKeys.push(groupKey);
            groups.push(group);
        }
        group.push(el);
    });
    return groups;
}
export function groupByMap<T>(arr: T[], func: (el: T, index: number, arr: T[]) => string | number) {
    const groups: T[][] = [];
    const groupKeys: IObject<T[]> = {};

    arr.forEach((el, index) => {
        const groupKey = func(el, index, arr);
        let group = groupKeys[groupKey];

        if (!group) {
            group = [];
            groupKeys[groupKey] = group;
            groups.push(group);
        }
        group.push(el);
    });
    return groups;
}
export function flat<T>(arr: T[][]): T[] {
    return arr.reduce((prev, cur) => {
        return prev.concat(cur);
    }, []);
}

export function equalSign(a: number, b: number) {
    return (a >= 0 && b >= 0) || (a < 0 && b < 0);
}

export function maxOffset(...args: number[]) {
    args.sort((a, b) => Math.abs(b) - Math.abs(a));

    return args[0];
}
export function minOffset(...args: number[]) {
    args.sort((a, b) => Math.abs(a) - Math.abs(b));

    return args[0];
}

export function convertDragDist(state: MoveableManagerState, e: any) {
    const {
        is3d,
        rootMatrix,
    } = state;
    const n = is3d ? 4 : 3;
    [
        e.distX, e.distY,
    ] = caculate(
        invert(rootMatrix, n),
        convertPositionMatrix([e.distX, e.distY], n),
        n,
    );

    return e;
}
