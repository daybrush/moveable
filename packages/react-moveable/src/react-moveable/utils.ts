import { PREFIX, IS_WEBKIT605, TINY_NUM, IS_WEBKIT } from "./consts";
import { prefixNames } from "framework-utils";
import { splitBracket, isUndefined, isObject, splitUnit, IObject, hasClass, isArray, isString, getRad, getShapeDirection } from "@daybrush/utils";
import {
    multiply, invert,
    convertDimension, createIdentityMatrix,
    createOriginMatrix, convertPositionMatrix, calculate,
    multiplies,
    minus,
    getOrigin,
    createScaleMatrix,
    plus,
    ignoreDimension,
    convertCSStoMatrix,
    convertMatrixtoCSS,
} from "@scena/matrix";
import {
    MoveableManagerState, Able, MoveableClientRect,
    MoveableProps, ControlPose, InvertTypes, ArrayFormat, MoveableRefType
} from "./types";
import { parse, toMat } from "css-to-mat";

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
    container: SVGElement | HTMLElement | null | undefined,
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
    let targetOrigin: number[];
    // inner svg element
    if (!hasOffset && tagName !== "svg") {
        origin = IS_WEBKIT605
            ? getBeforeTransformOrigin(el as SVGElement)
            : getTransformOrigin(style).map(pos => parseFloat(pos));

        targetOrigin = origin.slice();
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
        targetOrigin = origin.slice();
    }
    return {
        isSVG,
        hasOffset,
        offset: [offsetLeft || 0, offsetTop || 0],
        origin,
        targetOrigin,
    };
}
export function getBodyOffset(
    el: HTMLElement| SVGElement,
    isSVG: boolean,
    style: CSSStyleDeclaration = window.getComputedStyle(el),
) {
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyPosition = bodyStyle.position;
    if (!isSVG && (!bodyPosition || bodyPosition === "static")) {
        return [0, 0];
    }

    let marginLeft = parseInt(bodyStyle.marginLeft, 10);
    let marginTop = parseInt(bodyStyle.marginTop, 10);

    if (style.position === "absolute") {
        if (style.top !== "auto" || style.bottom !== "auto") {
            marginTop = 0;
        }
        if (style.left !== "auto" || style.right !== "auto") {
            marginLeft = 0;
        }
    }

    return [marginLeft, marginTop];
}
export function getMatrixStackInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    // prevMatrix?: number[],
) {
    let el: SVGElement | HTMLElement | null = target;
    const matrixes: number[][] = [];
    let isEnd = false;
    let is3d = false;
    let n = 3;
    let transformOrigin!: number[];
    let targetTransformOrigin!: number[];
    let targetMatrix!: number[];

    const offsetContainer = getOffsetInfo(container, container, true).offsetParent;

    // if (prevMatrix) {
    //     isEnd = target === container;
    //     if (prevMatrix.length > 10) {
    //         is3d = true;
    //         n = 4;
    //     }
    //     container = target.parentElement;
    // }

    while (el && !isEnd) {
        const style: CSSStyleDeclaration = getComputedStyle(el);
        const tagName = el.tagName.toLowerCase();
        const position = style.position;
        const isFixed = position === "fixed";
        let matrix: number[] = convertCSStoMatrix(getTransformMatrix(style.transform!));

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
        if (is3d && length === 9) {
            matrix = convertDimension(matrix, 3, 4);
        }
        const {
            hasOffset,
            isSVG,
            origin,
            targetOrigin,
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

        if (IS_WEBKIT && hasOffset && !isSVG && isStatic && (position === "relative" || position === "static")) {
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
        if (hasOffset && offsetParent === document.body) {
            const margin = getBodyOffset(el, false, style);
            offsetLeft += margin[0];
            offsetTop += margin[1];
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
        if (!targetTransformOrigin) {
            targetTransformOrigin = targetOrigin;
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
    if (!targetTransformOrigin) {
        targetTransformOrigin = [0, 0];
    }
    return {
        offsetContainer,
        matrixes,
        targetMatrix,
        transformOrigin,
        targetOrigin: targetTransformOrigin,
        is3d,
    };
}
export function calculateElementInfo(
    target?: SVGElement | HTMLElement | null,
    container?: SVGElement | HTMLElement | null,
    rootContainer: HTMLElement | SVGElement | null | undefined = container,
    isAbsolute3d?: boolean,
    // state?: Partial<MoveableManagerState> | false,
) {
    // const prevMatrix = state ? state.beforeMatrix : undefined;
    // const prevRootMatrix = state ? state.rootMatrix : undefined;
    // const prevN = state ? (state.is3d ? 4 : 3) : undefined;
    let width: number = 0;
    let height: number = 0;
    let rotation = 0;
    let allResult: {} = {};

    if (target) {
        const style = getComputedStyle(target);

        width = (target as HTMLElement).offsetWidth;
        height = (target as HTMLElement).offsetHeight;

        if (isUndefined(width)) {
            [width, height] = getSize(target, style, true);
        }
    }

    if (target) {
        const result = calculateMatrixStack(
            target, container, rootContainer, isAbsolute3d,
            // prevMatrix, prevRootMatrix, prevN,
        );
        const position = calculateMoveablePosition(
            result.allMatrix,
            result.transformOrigin,
            width, height,
        );
        allResult = {
            ...result,
            ...position,
        };
        const rotationPosition = calculateMoveablePosition(
            result.allMatrix, [50, 50], 100, 100,
        );
        rotation = getRotationRad([rotationPosition.pos1, rotationPosition.pos2], rotationPosition.direction);
    }
    const n = isAbsolute3d ? 4 : 3;
    return {
        width,
        height,
        rotation,
        // rootMatrix: number[];
        // beforeMatrix: number[];
        // offsetMatrix: number[];
        // allMatrix: number[];
        // targetMatrix: number[];
        // targetTransform: string;
        // transformOrigin: number[];
        // targetOrigin: number[];
        // is3d: boolean;
        rootMatrix: createIdentityMatrix(n),
        beforeMatrix: createIdentityMatrix(n),
        offsetMatrix: createIdentityMatrix(n),
        allMatrix: createIdentityMatrix(n),
        targetMatrix: createIdentityMatrix(n),
        targetTransform: "",
        transformOrigin: [0, 0],
        targetOrigin: [0, 0],
        is3d: !!isAbsolute3d,
        // left: number;
        // top: number;
        // right: number;
        // bottom: number;
        // origin: number[];
        // pos1: number[];
        // pos2: number[];
        // pos3: number[];
        // pos4: number[];
        // direction: 1 | -1;
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        origin: [0, 0],
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
        direction: 1,
        ...allResult,
    };
}
export function getElementInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    rootContainer: SVGElement | HTMLElement | null | undefined = container,
) {
    return calculateElementInfo(target, container, rootContainer, true);
}
export function calculateMatrixStack(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    rootContainer: SVGElement | HTMLElement | null | undefined = container,
    isAbsolute3d?: boolean,
    // prevMatrix?: number[],
    // prevRootMatrix?: number[],
    // prevN?: number,
) {
    const {
        matrixes,
        is3d,
        targetMatrix: prevTargetMatrix,
        transformOrigin,
        targetOrigin,
        offsetContainer,
    } = getMatrixStackInfo(target, container); // prevMatrix
    const {
        matrixes: rootMatrixes,
        is3d: isRoot3d,
    } = getMatrixStackInfo(offsetContainer, rootContainer); // prevRootMatrix

    // if (rootContainer === document.body) {
    //     console.log(offsetContainer, rootContainer, rootMatrixes);
    // }
    const isNext3d = isAbsolute3d || isRoot3d || is3d;
    const n = isNext3d ? 4 : 3;
    const isSVGGraphicElement = target.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in target;
    const originalContainer = container || document.body;
    let targetMatrix = prevTargetMatrix;
    // let allMatrix = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    // let rootMatrix = prevRootMatrix ? convertDimension(prevRootMatrix, prevN!, n) : createIdentityMatrix(n);
    // let beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN!, n) : createIdentityMatrix(n);
    let allMatrix = createIdentityMatrix(n);
    let rootMatrix = createIdentityMatrix(n);
    let beforeMatrix = createIdentityMatrix(n);
    let offsetMatrix = createIdentityMatrix(n);
    const length = matrixes.length;
    const endContainer = getOffsetInfo(originalContainer, originalContainer, true).offsetParent;

    rootMatrixes.reverse();
    matrixes.reverse();

    if (!is3d && isNext3d) {
        targetMatrix = convertDimension(targetMatrix, 3, 4);
        matrixes.forEach((matrix, i) => {
            matrixes[i] = convertDimension(matrix, 3, 4);
        });
    }
    if (!isRoot3d && isNext3d) {
        rootMatrixes.forEach((matrix, i) => {
            rootMatrixes[i] = convertDimension(matrix, 3, 4);
        });
    }

    // rootMatrix = (...) -> container -> offset -> absolute -> offset -> absolute(targetMatrix)
    // beforeMatrix = (... -> container -> offset -> absolute) -> offset -> absolute(targetMatrix)
    // offsetMatrix = (... -> container -> offset -> absolute -> offset) -> absolute(targetMatrix)

    // if (!prevRootMatrix) {
    rootMatrixes.forEach(matrix => {
        rootMatrix = multiply(rootMatrix, matrix, n);
    });
    // }
    matrixes.forEach((matrix, i) => {
        if (length - 2 === i) {
            // length - 3
            beforeMatrix = allMatrix.slice();
        }
        if (length - 1 === i) {
            // length - 2
            offsetMatrix = allMatrix.slice();
        }

        // calculate for SVGElement
        if (isObject(matrix[n * (n - 1)])) {
            [matrix[n * (n - 1)], matrix[n * (n - 1) + 1]] =
                getSVGOffset(
                    matrix[n * (n - 1)] as any,
                    endContainer,
                    n,
                    matrix[n * (n - 1) + 1] as any,
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
    const targetTransform = makeMatrixCSS(
        isSVGGraphicElement && targetMatrix.length === 16
            ? convertDimension(targetMatrix, 4, 3) : targetMatrix,
        isMatrix3d,
    );

    rootMatrix = ignoreDimension(rootMatrix, n, n);

    return {
        rootMatrix,
        beforeMatrix,
        offsetMatrix,
        allMatrix,
        targetMatrix,
        targetTransform,
        transformOrigin,
        targetOrigin,
        is3d: isNext3d,
    };
}
export function makeMatrixCSS(matrix: number[], is3d: boolean = matrix.length > 9) {
    return `${is3d ? "matrix3d" : "matrix"}(${convertMatrixtoCSS(matrix, !is3d).join(",")})`;
}
export function getSVGViewBox(el: SVGSVGElement) {
    if (!el) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;
    const viewBox = el.viewBox;
    const baseVal = (viewBox && viewBox.baseVal) || { x: 0, y: 0, width: 0, height: 0 };

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
        scaleMatrix[n * (n - 1)],
        scaleMatrix[n * (n - 1) + 1],
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
export function calculatePosition(matrix: number[], pos: number[], n: number) {
    return calculate(matrix, convertPositionMatrix(pos, n), n);
}
export function calculatePoses(matrix: number[], width: number, height: number, n: number) {
    return [[0, 0], [width, 0], [0, height], [width, height]].map(pos => calculatePosition(matrix, pos, n));
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
export function calculateRect(matrix: number[], width: number, height: number, n: number) {
    const poses = calculatePoses(matrix, width, height, n);

    return getRect(poses);
}
export function getSVGOffset(
    el: SVGElement,
    container: HTMLElement | SVGElement,
    n: number, origin: number[], beforeMatrix: number[], absoluteMatrix: number[]) {

    const [width, height] = getSize(el, undefined, true);
    const containerClientRect = container.getBoundingClientRect();
    let margin = [0, 0];

    if (container === document.body) {
        margin = getBodyOffset(el, true);
    }
    const rect = el.getBoundingClientRect();
    const rectLeft
        = rect.left - containerClientRect.left + container.scrollLeft
        - (container.clientLeft || 0) + margin[0];
    const rectTop
        = rect.top - containerClientRect.top + container.scrollTop
        - (container.clientTop || 0) + margin[1];
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
    } = calculateRect(mat, width, height, n);
    const posOrigin = calculatePosition(mat, origin, n);
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
            calculatePosition(inverseBeforeMatrix, rectOrigin, n),
            calculatePosition(inverseBeforeMatrix, posOrigin, n),
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
        } = calculateRect(mat2, width, height, n);
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
export function calculateMoveablePosition(matrix: number[], origin: number[], width: number, height: number) {
    const is3d = matrix.length === 16;
    const n = is3d ? 4 : 3;
    const poses = calculatePoses(matrix, width, height, n);
    let [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ] = poses;
    let [originX, originY] = calculatePosition(matrix, origin, n);

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

    const direction = getShapeDirection(poses);

    return {
        left,
        top,
        right,
        bottom,
        origin: [originX, originY],
        pos1: [x1, y1],
        pos2: [x2, y2],
        pos3: [x3, y3],
        pos4: [x4, y4],
        direction,
    };
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
export function getLineStyle(pos1: number[], pos2: number[], zoom = 1, rad: number = getRad(pos1, pos2)) {
    const width = getDiagonalSize(pos1, pos2);

    return {
        transform: `translateY(-50%) translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad) scaleY(${zoom})`,
        width: `${width}px`,
    };
}
export function getControlTransform(rotation: number, zoom: number, ...poses: number[][]) {
    const length = poses.length;

    const x = poses.reduce((prev, pos) => prev + pos[0], 0) / length;
    const y = poses.reduce((prev, pos) => prev + pos[1], 0) / length;
    return {
        transform: `translateZ(0px) translate(${x}px, ${y}px) rotate(${rotation}rad) scale(${zoom})`,
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
    if (!hasOffset && target.tagName.toLowerCase() !== "svg") {
        const bbox = (target as SVGGraphicsElement).getBBox();
        return [bbox.width, bbox.height];
    }

    width = target.clientWidth;
    height = target.clientHeight;

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
    moveableElement?: HTMLElement | null,
    target?: HTMLElement | SVGElement | null,
    container?: HTMLElement | SVGElement | null,
    parentContainer?: HTMLElement | SVGElement | null,
    rootContainer?: HTMLElement | SVGElement | null,
    // state?: Partial<MoveableManagerState> | false | undefined,
) {
    let beforeDirection: 1 | -1 = 1;
    let beforeOrigin = [0, 0];
    let targetClientRect = resetClientRect();
    let containerClientRect = resetClientRect();
    let moveableClientRect = resetClientRect();

    const result = calculateElementInfo(
        target, container!, rootContainer!, false,
        // state,
    );
    if (target) {
        const n = result.is3d ? 4 : 3;
        const beforePosition = calculateMoveablePosition(
            result.offsetMatrix,
            plus(result.transformOrigin, getOrigin(result.targetMatrix, n)),
            result.width, result.height,
        );
        beforeDirection = beforePosition.direction;
        beforeOrigin = plus(
            beforePosition.origin,
            [beforePosition.left - result.left, beforePosition.top - result.top],
        );

        targetClientRect = getClientRect(target);
        containerClientRect = getClientRect(
            getOffsetInfo(parentContainer, parentContainer, true).offsetParent || document.body,
            true,
        );
        if (moveableElement) {
            moveableClientRect = getClientRect(moveableElement);
        }
    }

    return {
        targetClientRect,
        containerClientRect,
        moveableClientRect,
        beforeDirection,
        beforeOrigin,
        originalBeforeOrigin: beforeOrigin,
        target,
        ...result,
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

export function fillParams<T extends IObject<any>>(
    moveable: any,
    e: any,
    params: Pick<T, Exclude<keyof T, "moveable" | "target" | "clientX" | "clientY" | "inputEvent" | "datas" | "currentTarget">>,
): T {
    const datas = e.datas;

    if (!datas.datas) {
        datas.datas = {};
    }
    const nextParams = {
        ...params,
        target: moveable.state.target,
        clientX: e.clientX,
        clientY: e.clientY,
        inputEvent: e.inputEvent,
        currentTarget: moveable,
        moveable,
        datas: datas.datas,
    } as any;

    if (datas.isStartEvent) {
        datas.lastEvent = nextParams;
    } else {
        datas.isStartEvent = true;
    }
    return nextParams;
}
export function fillEndParams<T extends IObject<any>>(
    moveable: any,
    e: any,
    params: Pick<T, Exclude<
        keyof T,
        "moveable" | "target" | "clientX" | "clientY" | "inputEvent" |
        "datas" | "currentTarget" | "lastEvent" | "isDrag" | "isDouble">
    > & { isDrag?: boolean },
): T {
    const datas = e.datas;
    const isDrag = "isDrag" in params ? params.isDrag : e.isDrag;

    if (!datas.datas) {
        datas.datas = {};
    }

    return {
        isDrag,
        ...params,
        target: moveable.state.target,
        clientX: e.clientX,
        clientY: e.clientY,
        inputEvent: e.inputEvent,
        currentTarget: moveable,
        lastEvent: datas.lastEvent,
        isDouble: e.isDouble,
        datas: datas.datas,
    } as any;
}

export function triggerEvent<T extends IObject<any> = MoveableProps, U extends keyof T = string>(
    moveable: any,
    name: U,
    params: T[U] extends ((e: infer P) => any) | undefined ? P : IObject<any>,
    isManager?: boolean,
): any {
    return moveable.triggerEvent(name, params, isManager);
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

export function calculateInversePosition(matrix: number[], pos: number[], n: number) {
    return calculate(
        invert(matrix, n),
        convertPositionMatrix(pos, n),
        n,
    );
}
export function convertDragDist(state: MoveableManagerState, e: any) {
    const {
        is3d,
        rootMatrix,
    } = state;
    const n = is3d ? 4 : 3;
    [
        e.distX, e.distY,
    ] = calculateInversePosition(rootMatrix, [e.distX, e.distY], n);

    return e;
}

export function calculatePadding(
    matrix: number[], pos: number[],
    transformOrigin: number[], origin: number[], n: number,
) {
    return minus(calculatePosition(matrix, plus(transformOrigin, pos), n), origin);
}

export function convertCSSSize(value: number, size: number, isRelative?: boolean) {
    return isRelative ? `${value / size * 100}%` : `${value}px`;
}

export function moveControlPos(
    controlPoses: ControlPose[],
    index: number,
    dist: number[],
    isRect?: boolean,
) {
    const { direction, sub } = controlPoses[index];
    const dists = controlPoses.map(() => [0, 0]);
    const directions = direction ? direction.split("") : [];

    if (isRect && index < 8) {
        const verticalDirection = directions.filter(dir => dir === "w" || dir === "e")[0];
        const horizontalDirection = directions.filter(dir => dir === "n" || dir === "s")[0];

        dists[index] = dist;
        controlPoses.forEach((controlPose, i) => {
            const {
                direction: controlDir,
            } = controlPose;

            if (!controlDir) {
                return;
            }
            if (controlDir.indexOf(verticalDirection) > -1) {
                dists[i][0] = dist[0];
            }
            if (controlDir.indexOf(horizontalDirection) > -1) {
                dists[i][1] = dist[1];
            }
        });
        if (verticalDirection) {
            dists[1][0] = dist[0] / 2;
            dists[5][0] = dist[0] / 2;
        }
        if (horizontalDirection) {
            dists[3][1] = dist[1] / 2;
            dists[7][1] = dist[1] / 2;
        }
    } else if (direction && !sub) {
        directions.forEach(dir => {
            const isVertical = dir === "n" || dir === "s";

            controlPoses.forEach((controlPose, i) => {
                const {
                    direction: dirDir,
                    horizontal: dirHorizontal,
                    vertical: dirVertical,
                } = controlPose;

                if (!dirDir || dirDir.indexOf(dir) === -1) {
                    return;
                }
                dists[i] = [
                    isVertical || !dirHorizontal ? 0 : dist[0],
                    !isVertical || !dirVertical ? 0 : dist[1],
                ];
            });
        });
    } else {
        dists[index] = dist;
    }

    return dists;
}

export function getTinyDist(v: number) {
    return Math.abs(v) <= TINY_NUM ? 0 : v;
}

export function directionCondition(e: any) {
    if (e.isRequest) {
        if (e.requestAble === "resizable" || e.requestAble === "scalable") {
            return e.parentDirection!;
        } else {
            return false;
        }
    }
    return hasClass(e.inputEvent.target, prefix("direction"));
}

export function invertObject<T extends IObject<any>>(obj: T): InvertTypes<T> {
    const nextObj: IObject<any> = {};

    for (const name in obj) {
        nextObj[obj[name]] = name;
    }
    return nextObj as any;
}

export function getTransform(transforms: string[], index: number) {
    const beforeFunctionTexts = transforms.slice(0, index < 0 ? undefined : index);
    const targetFunctionText = transforms[index] || "";
    const afterFunctionTexts = index < 0 ? [] : transforms.slice(index);
    const beforeFunctions = parse(beforeFunctionTexts);
    const targetFunctions = parse([targetFunctionText]);
    const afterFunctions = parse(afterFunctionTexts);

    const beforeFunctionMatrix = toMat(beforeFunctions);
    const afterFunctionMatrix = toMat(afterFunctions);
    const allFunctionMatrix = multiply(
        beforeFunctionMatrix,
        afterFunctionMatrix,
        4,
    );
    return {
        transforms,
        beforeFunctionMatrix,
        targetFunctionMatrix: toMat(targetFunctions),
        afterFunctionMatrix,
        allFunctionMatrix,
        beforeFunctions,
        targetFunction: targetFunctions[0],
        afterFunctions,
        beforeFunctionTexts,
        targetFunctionText,
        afterFunctionTexts,
    };
}

export function isArrayFormat<T = any>(arr: any): arr is ArrayFormat<T> {
    if (!arr || !isObject(arr)) {
        return false;
    }
    return isArray(arr) || "length" in arr;
}

export function getRefTargets(targets: MoveableRefType | MoveableRefType[]) {
    if (!targets) {
        return [];
    }
    const userTargets = isArrayFormat(targets) ? [].slice.call(targets) : [targets];

    return userTargets.map(target => {
        if (!target) {
            return null;
        }
        if (isString(target)) {
            return target;
        }
        if ("current" in target) {
            return target.current;
        }
        return target;
    }) as Array<SVGElement | HTMLElement | string | null | undefined>;
}

export function getElementTargets(
    targets: Array<SVGElement | HTMLElement | string | null | undefined>,
    selectorMap: IObject<Array<HTMLElement | SVGElement>>,
) {
    const elementTargets: Array<SVGElement | HTMLElement> = [];
    targets.forEach(target => {
        if (!target) {
            return;
        }
        if (isString(target)) {
            if (selectorMap[target]) {
                elementTargets.push(...selectorMap[target]);
            }
            return;
        }
        elementTargets.push(target);
    });

    return elementTargets;
}

export function minmax(...values: number[]) {
    return [Math.min(...values), Math.max(...values)];
}


export function getAbsoluteRotation(pos1: number[], pos2: number[], direction: number) {
    let deg = getRad(pos1, pos2) / Math.PI * 180;

    deg = direction >= 0 ? deg : 180 - deg;
    deg = deg >= 0 ? deg : 360 + deg;

    return deg;
}
