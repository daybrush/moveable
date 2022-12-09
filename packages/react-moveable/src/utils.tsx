import { PREFIX, IS_WEBKIT605, TINY_NUM } from "./consts";
import { prefixNames, InvertObject } from "framework-utils";
import {
    isUndefined, isObject, splitUnit,
    IObject, hasClass, isArray, isString, getRad,
    getShapeDirection, isFunction, convertUnitSize, between, getKeys, decamelize,
} from "@daybrush/utils";
import {
    multiply, invert,
    convertDimension, createIdentityMatrix,
    createOriginMatrix, convertPositionMatrix, calculate,
    multiplies,
    minus,
    createScaleMatrix,
    plus,
    convertMatrixtoCSS,
    rotate,
} from "@scena/matrix";
import {
    MoveableManagerState, Able, MoveableClientRect,
    MoveableProps, ArrayFormat, MoveableRefType,
    MatrixInfo, ExcludeEndParams, ExcludeParams,
    ElementSizes, MoveablePosition, TransformObject,
    MoveableRefTargetsResultType, MoveableRefTargetType, MoveableManagerInterface, CSSObject,
} from "./types";
import { parse, toMat, calculateMatrixDist, parseMat } from "css-to-mat";
import { getBeforeRenderableDatas, getDragDist } from "./gesto/GestoUtils";
import { getGestoData } from "./gesto/GestoData";

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

export function defaultSync(fn: () => void) {
    fn();
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
    return parseMat(transform);
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
export function getElementTransform(
    target: HTMLElement | SVGElement,
    computedStyle = getComputedStyle(target),
) {
    const computedTransform = computedStyle.transform;

    if (computedTransform && computedTransform !== "none") {
        return computedStyle.transform;
    }
    if ("transform" in target) {
        const list = (target as any).transform as SVGAnimatedTransformList;
        const baseVal = list.baseVal;

        if (!baseVal) {
            return "";
        }
        const length = baseVal.length;

        if (!length) {
            return "";
        }

        const matrixes: string[] = [];

        for (let i = 0; i < length; ++i) {
            const matrix = baseVal[i].matrix;

            matrixes.push(`matrix(${(["a", "b", "c", "d", "e", "f"] as const).map(chr => matrix[chr]).join(", ")})`);
        }
        return matrixes.join(" ");

    }
    return "";
}

export function getOffsetInfo(
    el: SVGElement | HTMLElement | null | undefined,
    lastParent: SVGElement | HTMLElement | null | undefined,
    isParent?: boolean,
    checkZoom?: boolean,
    targetStyle?: CSSStyleDeclaration,
) {
    const documentElement = document.documentElement || document.body;
    let hasSlot = false;
    let target: HTMLElement | SVGElement | null | undefined;
    let parentSlotElement: HTMLElement | null | undefined;

    if (!el || isParent) {
        target = el;
    } else {
        const assignedSlotParentElement = el?.assignedSlot?.parentElement;
        const parentElement = el.parentElement;

        if (assignedSlotParentElement) {
            hasSlot = true;
            parentSlotElement = parentElement;
            target = assignedSlotParentElement;
        } else {
            target = parentElement;
        }
    }

    let isCustomElement = false;
    let isEnd = el === lastParent || target === lastParent;
    let position = "relative";
    let offsetZoom = 1;


    const targetZoom = parseFloat((targetStyle as any)?.zoom) || 1;
    const targetPosition = targetStyle?.position;



    while (target && target !== documentElement) {
        if (lastParent === target) {
            isEnd = true;
        }
        const style = getComputedStyle(target);
        const tagName = target.tagName.toLowerCase();
        const transform = getElementTransform(target as SVGElement, style);
        const willChange = style.willChange;
        const zoom = parseFloat((style as any).zoom) || 1;
        position = style.position!;

        if (checkZoom && zoom !== 1) {
            offsetZoom = zoom;
            break;
        }
        if (
            // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
            !isParent && checkZoom && targetZoom !== 1 && targetPosition && targetPosition !== "absolute"
            || tagName === "svg"
            || position !== "static"
            || (transform && transform !== "none")
            || willChange === "transform"
        ) {
            break;
        }
        const slotParentNode = el?.assignedSlot?.parentNode;
        const targetParentNode = target.parentNode;

        if (slotParentNode) {
            hasSlot = true;
            parentSlotElement = targetParentNode as HTMLElement;
        }
        const parentNode = slotParentNode || targetParentNode;


        if (parentNode && parentNode.nodeType === 11) {
            // Shadow Root
            target = (parentNode as ShadowRoot).host as HTMLElement;
            isCustomElement = true;

            break;
        }
        target = parentNode as HTMLElement | SVGElement;
        position = "relative";
    }
    return {
        offsetZoom,
        hasSlot,
        parentSlotElement,
        isCustomElement,
        isStatic: position === "static",
        isEnd: isEnd || !target || target === documentElement,
        offsetParent: target as HTMLElement || documentElement,
    };

}
export function getOffsetPosInfo(
    el: HTMLElement | SVGElement,
    target: HTMLElement | SVGElement,
    style: CSSStyleDeclaration,
) {
    const tagName = el.tagName.toLowerCase();
    let offsetLeft = (el as HTMLElement).offsetLeft;
    let offsetTop = (el as HTMLElement).offsetTop;

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

        [
            offsetLeft, offsetTop, origin[0], origin[1],
        ] = getSVGGraphicsOffset(
            el as SVGGraphicsElement,
            origin,
            el === target && target.tagName.toLowerCase() === "g",
        );
    } else {
        origin = getTransformOrigin(style).map(pos => parseFloat(pos));
        targetOrigin = origin.slice();
    }
    return {
        tagName,
        isSVG,
        hasOffset,
        offset: [offsetLeft || 0, offsetTop || 0],
        origin,
        targetOrigin,
    };
}
export function getBodyOffset(
    el: HTMLElement | SVGElement,
    isSVG: boolean,
    style: CSSStyleDeclaration = getComputedStyle(el),
) {
    const bodyStyle = getComputedStyle(document.body);
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
export function convert3DMatrixes(matrixes: MatrixInfo[]) {
    matrixes.forEach(info => {
        const matrix = info.matrix;

        if (matrix) {
            info.matrix = convertDimension(matrix, 3, 4);
        }
    });
}

export function getBodyScrollPos() {
    return [
        document.documentElement.scrollLeft || document.body.scrollLeft,
        document.documentElement.scrollTop || document.body.scrollTop,
    ];
}

export function getPositionFixedInfo(el: HTMLElement | SVGElement) {
    let fixedContainer = el.parentElement;
    let hasTransform = false;

    while (fixedContainer) {
        const transform = getComputedStyle(fixedContainer).transform;


        if (transform && transform !== "none") {
            hasTransform = true;
            break;
        }
        if (fixedContainer === document.body) {
            break;
        }
        fixedContainer = fixedContainer.parentElement;
    }

    return {
        fixedContainer: fixedContainer || document.body,
        hasTransform,
    };
}

export function makeMatrixCSS(matrix: number[], is3d: boolean = matrix.length > 9) {
    return `${is3d ? "matrix3d" : "matrix"}(${convertMatrixtoCSS(matrix, !is3d).join(",")})`;
}
export function getSVGViewBox(el: SVGSVGElement) {
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;

    if (!el) {
        return { x: 0, y: 0, width: 0, height: 0, clientWidth, clientHeight };
    }
    const viewBox = el.viewBox;
    const baseVal = (viewBox && viewBox.baseVal) || { x: 0, y: 0, width: 0, height: 0 };

    return {
        x: baseVal.x,
        y: baseVal.y,
        width: baseVal.width || clientWidth,
        height: baseVal.height || clientHeight,
        clientWidth,
        clientHeight,
    };
}
export function getSVGMatrix(
    el: SVGSVGElement,
    n: number,
) {
    const {
        width: viewBoxWidth,
        height: viewBoxHeight,
        clientWidth,
        clientHeight,
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
    isGTarget?: boolean,
) {
    if (!el.getBBox || !isGTarget && el.tagName.toLowerCase() === "g") {
        return [0, 0, 0, 0];
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
    offsetInfo: MatrixInfo,
    targetInfo: MatrixInfo,
    container: HTMLElement | SVGElement,
    n: number,
    beforeMatrix: number[],
) {
    const target = offsetInfo.target;
    const origin = offsetInfo.origin!;
    const targetMatrix = targetInfo.matrix!;
    const {
        offsetWidth: width,
        offsetHeight: height,
    } = getSize(target);
    const containerClientRect = container.getBoundingClientRect();
    let margin = [0, 0];

    if (container === document.body) {
        margin = getBodyOffset(target, true);
    }

    const rect = target.getBoundingClientRect();
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
        targetMatrix,
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
            targetMatrix,
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

export function calculateMoveableClientPositions(
    rootMatrix: number[],
    poses: number[][],
    rootClientRect: MoveableClientRect,
) {
    const is3d = rootMatrix.length === 16;
    const n = is3d ? 4 : 3;
    const rootPoses = poses.map(pos => calculatePosition(rootMatrix, pos, n));
    const { left, top } = rootClientRect;

    return rootPoses.map(pos => {
        return [pos[0] + left, pos[1] + top];
    });

}
export function calculateMoveablePosition(
    matrix: number[],
    origin: number[],
    width: number,
    height: number,
): MoveablePosition {
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

    const direction = getShapeDirection(calculatePoses(matrix, 100, 100, n));
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
    const style = getComputedStyle(target);

    return [
        parseFloat(style.width!),
        parseFloat(style.height!),
    ];
}

export function getProps<Props>(props: Props, ableName: keyof Props): Props {
    const self = props[ableName];

    if (isObject(self)) {
        return {
            ...props,
            ...self,
        };
    }
    return props;
}

export function getSize(
    target?: SVGElement | HTMLElement | null,
    style: CSSStyleDeclaration | null = target ? getComputedStyle(target) : null,
): ElementSizes {
    const hasOffset = target && !isUndefined((target as any).offsetWidth);

    let offsetWidth = 0;
    let offsetHeight = 0;
    let clientWidth = 0;
    let clientHeight = 0;
    let cssWidth = 0;
    let cssHeight = 0;
    let contentWidth = 0;
    let contentHeight = 0;

    let minWidth = 0;
    let minHeight = 0;
    let minOffsetWidth = 0;
    let minOffsetHeight = 0;

    let maxWidth = Infinity;
    let maxHeight = Infinity;
    let maxOffsetWidth = Infinity;
    let maxOffsetHeight = Infinity;
    let inlineCSSWidth = 0;
    let inlineCSSHeight = 0;
    let svg = false;

    if (target) {
        if (!hasOffset && target!.tagName.toLowerCase() !== "svg") {
            const bbox = (target as SVGGraphicsElement).getBBox();

            svg = true;
            offsetWidth = bbox.width;
            offsetHeight = bbox.height;
            cssWidth = offsetWidth;
            cssHeight = offsetHeight;
            contentWidth = offsetWidth;
            contentHeight = offsetHeight;
            clientWidth = offsetWidth;
            clientHeight = offsetHeight;
        } else {
            const targetStyle = target.style;
            const boxSizing = style!.boxSizing === "border-box";
            const borderLeft = parseFloat(style!.borderLeftWidth!) || 0;
            const borderRight = parseFloat(style!.borderRightWidth!) || 0;
            const borderTop = parseFloat(style!.borderTopWidth!) || 0;
            const borderBottom = parseFloat(style!.borderBottomWidth!) || 0;
            const paddingLeft = parseFloat(style!.paddingLeft!) || 0;
            const paddingRight = parseFloat(style!.paddingRight!) || 0;
            const paddingTop = parseFloat(style!.paddingTop!) || 0;
            const paddingBottom = parseFloat(style!.paddingBottom!) || 0;

            const horizontalPadding = paddingLeft + paddingRight;
            const verticalPadding = paddingTop + paddingBottom;
            const horizontalBorder = borderLeft + borderRight;
            const verticalBorder = borderTop + borderBottom;
            const horizontalOffset = horizontalPadding + horizontalBorder;
            const verticalOffset = verticalPadding + verticalBorder;
            const position = style!.position;

            let containerWidth = 0;
            let containerHeight = 0;

            // SVGSVGElement, HTMLElement
            if ("clientLeft" in target) {
                let parentElement: HTMLElement | null = null;

                if (position === "absolute") {
                    const offsetInfo = getOffsetInfo(target, document.body);
                    parentElement = offsetInfo.offsetParent;

                } else {
                    parentElement = target.parentElement;
                }
                if (parentElement) {
                    const parentStyle = getComputedStyle(parentElement);

                    containerWidth = parseFloat(parentStyle.width);
                    containerHeight = parseFloat(parentStyle.height);
                }
            }
            minWidth = Math.max(
                horizontalPadding,
                convertUnitSize(style!.minWidth, containerWidth) || 0,
            );
            minHeight = Math.max(
                verticalPadding,
                convertUnitSize(style!.minHeight, containerHeight) || 0,
            );
            maxWidth = convertUnitSize(style!.maxWidth, containerWidth);
            maxHeight = convertUnitSize(style!.maxHeight, containerHeight);

            if (isNaN(maxWidth)) {
                maxWidth = Infinity;
            }
            if (isNaN(maxHeight)) {
                maxHeight = Infinity;
            }
            inlineCSSWidth = convertUnitSize(targetStyle.width, 0) || 0;
            inlineCSSHeight = convertUnitSize(targetStyle.height, 0) || 0;
            cssWidth = parseFloat(style!.width) || 0;
            cssHeight = parseFloat(style!.height) || 0;


            contentWidth = Math.abs(cssWidth - inlineCSSWidth) < 1
                ? between(minWidth, inlineCSSWidth || cssWidth, maxWidth)
                : cssWidth;
            contentHeight = Math.abs(cssHeight - inlineCSSHeight) < 1
                ? between(minHeight, inlineCSSHeight || cssHeight, maxHeight)
                : cssHeight;

            offsetWidth = contentWidth;
            offsetHeight = contentHeight;
            clientWidth = contentWidth;
            clientHeight = contentHeight;

            if (boxSizing) {
                maxOffsetWidth = maxWidth;
                maxOffsetHeight = maxHeight;
                minOffsetWidth = minWidth;
                minOffsetHeight = minHeight;
                contentWidth = offsetWidth - horizontalOffset;
                contentHeight = offsetHeight - verticalOffset;
            } else {
                maxOffsetWidth = maxWidth + horizontalOffset;
                maxOffsetHeight = maxHeight + verticalOffset;
                minOffsetWidth = minWidth + horizontalOffset;
                minOffsetHeight = minHeight + verticalOffset;
                offsetWidth = contentWidth + horizontalOffset;
                offsetHeight = contentHeight + verticalOffset;
            }
            clientWidth = contentWidth + horizontalPadding;
            clientHeight = contentHeight + verticalPadding;
        }
    }

    return {
        svg,
        offsetWidth,
        offsetHeight,
        clientWidth,
        clientHeight,
        contentWidth,
        contentHeight,
        inlineCSSWidth,
        inlineCSSHeight,
        cssWidth,
        cssHeight,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        minOffsetWidth,
        minOffsetHeight,
        maxOffsetWidth,
        maxOffsetHeight,
    };
}
export function getRotationRad(
    poses: number[][],
    direction: number,
) {
    return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
}

export function resetClientRect(): MoveableClientRect {
    return {
        left: 0, top: 0,
        width: 0, height: 0,
        right: 0,
        bottom: 0,
        clientLeft: 0, clientTop: 0,
        clientWidth: 0, clientHeight: 0,
        scrollWidth: 0, scrollHeight: 0,
    };
}

export function getExtendsRect(el: HTMLElement | SVGElement, rect: MoveableClientRect): MoveableClientRect {
    const isRoot = el === document.body || el === document.documentElement;


    const extendsRect =  {
        clientLeft: el.clientLeft,
        clientTop: el.clientTop,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
        overflow: false,
    };

    if (isRoot) {
        extendsRect.clientHeight = Math.max(rect.height, extendsRect.clientHeight);
        extendsRect.scrollHeight = Math.max(rect.height, extendsRect.scrollHeight);
    }
    extendsRect.overflow = getComputedStyle(el).overflow !== "visible";

    return {
        ...rect,
        ...extendsRect,
    };
}

export function getClientRectByPosition(
    position: { left: number, right: number, top: number, bottom: number },
    base: MoveableClientRect,
    el?: HTMLElement | SVGElement, isExtends?: boolean,
) {
    const {
        left,
        right,
        top,
        bottom,
    } = position;
    const baseTop = base.top;
    const baseLeft = base.left;

    const rect: MoveableClientRect = {
        left: baseLeft + left,
        top: baseTop + top,
        right: baseLeft + right,
        bottom: baseTop + bottom,
        width: right - left,
        height: bottom - top,
    };


    if (el && isExtends) {
        return getExtendsRect(el, rect);
    }
    return rect;
}
export function getClientRect(el: HTMLElement | SVGElement, isExtends?: boolean) {
    let left = 0;
    let top = 0;
    let width = 0;
    let height = 0;
    // let isRoot = false;

    if (el) {
        // isRoot = el === document.body || el === document.documentElement;
        // if (isRoot) {
        //     width = window.innerWidth;
        //     height = window.innerHeight;
        //     const scrollPos = getBodyScrollPos();

        //     [left, top] = [-scrollPos[0], -scrollPos[1]];
        // } else {
        const clientRect = el.getBoundingClientRect();

        left = clientRect.left;
        top = clientRect.top;
        width = clientRect.width;
        height = clientRect.height;
        // }
    }

    const rect: MoveableClientRect = {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
    };

    if (el && isExtends) {
        return getExtendsRect(el, rect);
    }
    return rect;
}
export function getTotalDirection(
    parentDirection: number[],
    isPinch: boolean,
    inputEvent: any,
    datas: any,
) {
    let direction: number[] | undefined;

    if (parentDirection) {
        direction = parentDirection;
    } else if (isPinch) {
        direction = [0, 0];
    } else {
        const target = inputEvent.target;

        direction = getDirection(target, datas);
    }
    return direction;
}
export function getDirection(target: SVGElement | HTMLElement, datas: any) {
    if (!target) {
        return;
    }
    const deg = target.getAttribute("data-rotation") || "";
    const direciton = target.getAttribute("data-direction")!;

    datas.deg = deg;

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

export function unset(self: any, name: string) {
    self[name]?.unset();
    self[name] = null;
}

export function fillCSSObject(style: Record<string, any>, resolvedEvent?: any): CSSObject {
    if (resolvedEvent) {
        const originalDatas = getBeforeRenderableDatas(resolvedEvent);

        originalDatas.nextStyle = {
            ...originalDatas.nextStyle,
            ...style,
        };
    }
    return {
        style,
        cssText: getKeys(style).map(name => `${decamelize(name, "-")}: ${style[name]};`).join(""),
    };
}

export function fillAfterTransform(
    prevEvent: { style: Record<string, string>, transform: string },
    nextEvent: { style: Record<string, string>, transform: string, afterTransform?: string },
    resolvedEvent?: any
): TransformObject {
    const afterTransform = nextEvent.afterTransform || nextEvent.transform;

    return {
        ...fillCSSObject({
            ...prevEvent.style,
            ...nextEvent.style,
            transform: afterTransform,
        }, resolvedEvent),
        afterTransform,
        transform: prevEvent.transform,
    };
}

export function fillParams<T extends IObject<any>>(
    moveable: any,
    e: any,
    params: ExcludeParams<T>,
    isBeforeEvent?: boolean,
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
        isFirstDrag: !!e.isFirstDrag,
        stopAble() {
            datas.isEventStart = false;
        },
        stopDrag() {
            e.stop?.();
        },
    } as any;

    if (!datas.isStartEvent) {
        datas.isStartEvent = true;
    } else if (!isBeforeEvent) {
        datas.lastEvent = nextParams;
    }
    return nextParams;
}
export function fillEndParams<T extends IObject<any>>(
    moveable: any,
    e: any,
    params: ExcludeEndParams<T> & { isDrag?: boolean },
): T {
    const datas = e.datas;
    const isDrag = "isDrag" in params ? params.isDrag : e.isDrag;

    if (!datas.datas) {
        datas.datas = {};
    }

    return {
        isDrag,
        ...params,
        moveable,
        target: moveable.state.target,
        clientX: e.clientX,
        clientY: e.clientY,
        inputEvent: e.inputEvent,
        currentTarget: moveable,
        lastEvent: datas.lastEvent,
        isDouble: e.isDouble,
        datas: datas.datas,
        isFirstDrag: !!e.isFirstDrag,
    } as any;
}
export function catchEvent<EventName extends keyof Props, Props extends IObject<any> = MoveableProps>(
    moveable: any,
    name: EventName,
    callback: (e: Props[EventName] extends ((e: infer P) => any) | undefined ? P : IObject<any>) => void,
): any {
    moveable._emitter.on(name, callback);
}

export function triggerEvent<EventName extends keyof Props, Props extends IObject<any> = MoveableProps>(
    moveable: any,
    name: EventName,
    params: Props[EventName] extends ((e: infer P) => any) | undefined ? P : IObject<any>,
    isManager?: boolean,
): any {
    return moveable.triggerEvent(name, params, isManager);
}

export function getComputedStyle(el: Element, pseudoElt?: string | null) {
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
    matrix: number[],
    pos: number[],
    transformOrigin: number[],
    origin: number[],
    n: number,
) {
    return minus(calculatePosition(matrix, plus(transformOrigin, pos), n), origin);
}

export function convertCSSSize(value: number, size: number, isRelative?: boolean) {
    return isRelative ? `${value / size * 100}%` : `${value}px`;
}

export function getTinyDist(v: number) {
    return Math.abs(v) <= TINY_NUM ? 0 : v;
}

export function viewDraggingPrefix(ableName: string) {
    return prefix(`${ableName}-view-dragging`);
}
export function getDirectionViewClassName(ableName: string) {
    return (moveable: MoveableManagerInterface) => {
        if (!moveable.isDragging(ableName)) {
            return "";
        }
        const data = getGestoData(moveable, ableName);
        const deg = data.deg;
        if (!deg) {
            return "";
        }
        return prefix(`view-control-rotation${deg}`);
    };
}
export function getDirectionCondition(ableName: string, checkAbles: string[] = [ableName]) {
    return (moveable: any, e: any) => {
        if (e.isRequest) {
            if (checkAbles.some(name => e.requestAble === name)) {
                return e.parentDirection!;
            } else {
                return false;
            }
        }
        const target = e.inputEvent.target;

        return hasClass(target, prefix("direction")) && (!ableName || hasClass(target, prefix(ableName)));
    };
}

export function invertObject<T extends IObject<any>>(obj: T): InvertObject<T> {
    const nextObj: IObject<any> = {};

    for (const name in obj) {
        nextObj[obj[name]] = name;
    }
    return nextObj as any;
}

export function convertTransformInfo(transforms: string[], index: number) {
    const beforeFunctionTexts = transforms.slice(0, index < 0 ? undefined : index);
    const beforeFunctionTexts2 = transforms.slice(0, index < 0 ? undefined : index + 1);
    const targetFunctionText = transforms[index] || "";
    const afterFunctionTexts = index < 0 ? [] : transforms.slice(index);
    const afterFunctionTexts2 = index < 0 ? [] : transforms.slice(index + 1);

    const beforeFunctions = parse(beforeFunctionTexts);
    const beforeFunctions2 = parse(beforeFunctionTexts2);
    const targetFunctions = parse([targetFunctionText]);
    const afterFunctions = parse(afterFunctionTexts);
    const afterFunctions2 = parse(afterFunctionTexts2);


    const beforeFunctionMatrix = toMat(beforeFunctions);
    const beforeFunctionMatrix2 = toMat(beforeFunctions2);
    const afterFunctionMatrix = toMat(afterFunctions);
    const afterFunctionMatrix2 = toMat(afterFunctions2);
    const allFunctionMatrix = multiply(
        beforeFunctionMatrix,
        afterFunctionMatrix,
        4,
    );
    return {
        transforms,
        beforeFunctionMatrix,
        beforeFunctionMatrix2,
        targetFunctionMatrix: toMat(targetFunctions),
        afterFunctionMatrix,
        afterFunctionMatrix2,
        allFunctionMatrix,
        beforeFunctions,
        beforeFunctions2,
        targetFunction: targetFunctions[0],
        afterFunctions,
        afterFunctions2,
        beforeFunctionTexts,
        beforeFunctionTexts2,
        targetFunctionText,
        afterFunctionTexts,
        afterFunctionTexts2,
    };
}

export function isArrayFormat<T = any>(arr: any): arr is ArrayFormat<T> {
    if (!arr || !isObject(arr)) {
        return false;
    }
    if (arr instanceof Element) {
        return false;
    }
    return isArray(arr) || "length" in arr;
}

export function getRefTarget<T extends Element = HTMLElement | SVGElement>(
    target: MoveableRefType<T>, isSelector: true): T | null;
export function getRefTarget<T extends Element = HTMLElement | SVGElement>(
    target: MoveableRefType<T>, isSelector?: boolean): T | string | null;
export function getRefTarget<T extends Element = HTMLElement | SVGElement>(
    target: MoveableRefType<T>,
    isSelector?: boolean,
): any {
    if (!target) {
        return null;
    }
    if (target instanceof Element) {
        return target;
    }
    if (isString(target)) {
        if (isSelector) {
            return document.querySelector(target);
        }
        return target;
    }
    if (isFunction(target)) {
        return target();
    }
    if ("current" in target) {
        return target.current;
    }
    return target;
}

export function getRefTargets(
    targets: MoveableRefTargetType,
    isSelector: true): Array<HTMLElement | SVGElement | null>;
export function getRefTargets(
    targets: MoveableRefTargetType,
    isSelector?: boolean): MoveableRefTargetsResultType;
export function getRefTargets(targets: MoveableRefTargetType, isSelector?: boolean): any[] {
    if (!targets) {
        return [];
    }
    const userTargets = isArrayFormat(targets) ? [].slice.call(targets) : [targets];

    return userTargets.reduce((prev, target) => {
        if (isString(target) && isSelector) {
            return [...prev, ...[].slice.call(document.querySelectorAll<HTMLElement>(target))];
        }
        if (isArray(target)) {
            prev.push(getRefTargets(target, isSelector));
        } else {
            prev.push(getRefTarget(target, isSelector));
        }
        return prev;
    }, [] as MoveableRefTargetsResultType);
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


export function getDragDistByState(state: MoveableManagerState, dist: number[]) {
    const {
        rootMatrix,
        is3d,
    } = state;
    const n = is3d ? 4 : 3;

    let inverseMatrix = invert(rootMatrix, n);

    if (!is3d) {
        inverseMatrix = convertDimension(inverseMatrix, 3, 4);
    }
    inverseMatrix[12] = 0;
    inverseMatrix[13] = 0;
    inverseMatrix[14] = 0;

    return calculateMatrixDist(inverseMatrix, dist);
}

export function getSizeDistByDist(
    startSize: number[],
    dist: number[],
    ratio: number,
    direction: number[],
    keepRatio?: boolean,
) {
    const [startOffsetWidth, startOffsetHeight] = startSize;
    let distWidth = 0;
    let distHeight = 0;

    if (keepRatio && startOffsetWidth && startOffsetHeight) {
        const rad = getRad([0, 0], dist);
        const standardRad = getRad([0, 0], direction);
        const size = getDistSize(dist);
        const signSize = Math.cos(rad - standardRad) * size;

        if (!direction[0]) {
            // top, bottom
            distHeight = signSize;
            distWidth = distHeight * ratio;
        } else if (!direction[1]) {
            // left, right
            distWidth = signSize;
            distHeight = distWidth / ratio;
        } else {
            // two-way
            const startWidthSize = direction[0] * 2 * startOffsetWidth;
            const startHeightSize = direction[1] * 2 * startOffsetHeight;
            const distSize = getDistSize([startWidthSize + dist[0], startHeightSize + dist[1]])
                - getDistSize([startWidthSize, startHeightSize]);
            const ratioRad = getRad([0, 0], [ratio, 1]);

            distWidth = Math.cos(ratioRad) * distSize;
            distHeight = Math.sin(ratioRad) * distSize;
        }
    } else {
        distWidth = direction[0] * dist[0];
        distHeight = direction[1] * dist[1];
    }

    return [distWidth, distHeight];
}
export function getOffsetSizeDist(
    sizeDirection: number[],
    keepRatio: boolean,
    datas: any,
    e: any,
) {
    const {
        ratio,
        startOffsetWidth,
        startOffsetHeight,
    } = datas;
    let distWidth = 0;
    let distHeight = 0;
    const {
        distX,
        distY,
        parentDistance,
        parentDist,
        parentScale,
    } = e;
    const startFixedDirection = datas.fixedDirection;
    const directionsDists = [0, 1].map(index => {
        return Math.abs(sizeDirection[index] - startFixedDirection[index]);
    });
    const directionRatios = [0, 1].map(index => {
        let dist = directionsDists[index];

        if (dist !== 0) {
            dist = 2 / dist;
        }
        return dist;
    });
    if (parentDist) {
        distWidth = parentDist[0];
        distHeight = parentDist[1];

        if (keepRatio) {
            if (!distWidth) {
                distWidth = distHeight * ratio;
            } else if (!distHeight) {
                distHeight = distWidth / ratio;
            }
        }
    } else if (parentScale) {
        distWidth = (parentScale[0] - 1) * startOffsetWidth;
        distHeight = (parentScale[1] - 1) * startOffsetHeight;
    } else if (parentDistance) {
        const scaleX = startOffsetWidth * directionsDists[0];
        const scaleY = startOffsetHeight * directionsDists[1];
        const ratioDistance = getDistSize([scaleX, scaleY]);

        distWidth = parentDistance / ratioDistance * scaleX * directionRatios[0];
        distHeight = parentDistance / ratioDistance * scaleY * directionRatios[1];
    } else {
        let dist = getDragDist({ datas, distX, distY });

        dist = directionRatios.map((ratio, i) => {
            return dist[i] * ratio;
        });

        [distWidth, distHeight] = getSizeDistByDist(
            [startOffsetWidth, startOffsetHeight],
            dist,
            ratio,
            sizeDirection,
            keepRatio,
        );
    }
    return {
        // direction,
        // sizeDirection,
        distWidth,
        distHeight,
    };
}

export function convertTransformUnit(
    origin: string,
    xy?: boolean,
): { x?: string; y?: string; value?: string; } {
    if (xy) {
        if (origin === "left") {
            return { x: "0%", y: "50%" };
        } else if (origin === "top") {
            return { x: "50%", y: "50%" };
        } else if (origin === "center") {
            return { x: "50%", y: "50%" };
        } else if (origin === "right") {
            return { x: "100%", y: "50%" };
        } else if (origin === "bottom") {
            return { x: "50%", y: "100%" };
        }
        const [left, right] = origin.split(" ");
        const leftOrigin = convertTransformUnit(left || "");
        const rightOrigin = convertTransformUnit(right || "");
        const originObject = {
            ...leftOrigin,
            ...rightOrigin,
        };

        const nextOriginObject = {
            x: "50%",
            y: "50%",
        };
        if (originObject.x) {
            nextOriginObject.x = originObject.x;
        }
        if (originObject.y) {
            nextOriginObject.y = originObject.y;
        }
        if (originObject.value) {
            if (originObject.x && !originObject.y) {
                nextOriginObject.y = originObject.value;
            }
            if (!originObject.x && originObject.y) {
                nextOriginObject.x = originObject.value;
            }
        }
        return nextOriginObject;
    }
    if (origin === "left") {
        return { x: "0%" };
    }
    if (origin === "right") {
        return { x: "100%" };
    }
    if (origin === "top") {
        return { y: "0%" };
    }
    if (origin === "bottom") {
        return { y: "100%" };
    }
    if (!origin) {
        return {};
    }
    if (origin === "center") {
        return { value: "50%" };
    }
    return { value: origin };
}
export function convertTransformOriginArray(transformOrigin: string, width: number, height: number) {
    const { x, y } = convertTransformUnit(transformOrigin, true);

    return [
        convertUnitSize(x!, width) || 0,
        convertUnitSize(y!, height) || 0,
    ];
}

export function rotatePosesInfo(poses: number[][], origin: number[], rad: number) {
    const prevPoses = poses.map((pos) => minus(pos, origin));
    const nextPoses = prevPoses.map((pos) => rotate(pos, rad));

    return {
        prev: prevPoses,
        next: nextPoses,
        result: nextPoses.map(pos => plus(pos, origin)),
    };
}
