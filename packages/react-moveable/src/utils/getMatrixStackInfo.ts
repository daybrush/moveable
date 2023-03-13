import {
    convertCSStoMatrix, convertDimension,
    createIdentityMatrix, createOriginMatrix, createScaleMatrix,
} from "@scena/matrix";
import { IS_WEBKIT, IS_SAFARI_ABOVE15, IS_FIREFOX, IS_CHROMIUM109 } from "../consts";
import { MatrixInfo } from "../types";
import {
    getOffsetInfo, getElementTransform,
    getTransformMatrix, getPositionFixedInfo,
    convert3DMatrixes, getOffsetPosInfo,
    getSVGMatrix, getBodyOffset, getAbsoluteMatrix,
} from "../utils";


export function getShadowRoot(parentElement: HTMLElement | SVGElement) {
    if (parentElement && parentElement.getRootNode) {
        const rootNode = parentElement.getRootNode();

        if (rootNode.nodeType === 11) {
            return rootNode;
        }
    }
    return;
}

export function getMatrixStackInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    checkContainer?: boolean,
) {
    let el: SVGElement | HTMLElement | null = target;
    const matrixes: MatrixInfo[] = [];
    const documentElement = document.documentElement || document.body;
    let requestEnd = !checkContainer && target === container || target === documentElement;
    let isEnd = requestEnd;
    let is3d = false;
    let n = 3;
    let transformOrigin!: number[];
    let targetTransformOrigin!: number[];
    let targetMatrix!: number[];

    let hasFixed = false;
    let offsetContainer = getOffsetInfo(container, container, true).offsetParent;
    let zoom = 1;

    while (el && !isEnd) {
        isEnd = requestEnd;
        const style: CSSStyleDeclaration = getComputedStyle(el);
        const position = style.position;
        const transform = getElementTransform(el, style);
        let matrix: number[] = convertCSStoMatrix(getTransformMatrix(transform));
        const isFixed = position === "fixed";
        let fixedInfo: {
            hasTransform: boolean;
            fixedContainer: HTMLElement | null;
        } = {
            hasTransform: false,
            fixedContainer: null,
        };
        if (isFixed) {
            hasFixed = true;
            fixedInfo = getPositionFixedInfo(el);

            offsetContainer = fixedInfo.fixedContainer!;
        }

        // convert 3 to 4
        const length = matrix.length;

        if (!is3d && length === 16) {
            is3d = true;
            n = 4;

            convert3DMatrixes(matrixes);
            if (targetMatrix) {
                targetMatrix = convertDimension(targetMatrix, 3, 4);
            }
        }
        if (is3d && length === 9) {
            matrix = convertDimension(matrix, 3, 4);
        }
        const {
            tagName,
            hasOffset,
            isSVG,
            origin,
            targetOrigin,
            offset: offsetPos,
        } = getOffsetPosInfo(el, target, style);
        let [
            offsetLeft,
            offsetTop,
        ] = offsetPos;

        if (tagName === "svg" && targetMatrix) {
            // scale matrix for svg's SVGElements.
            matrixes.push({
                type: "target",
                target: el,
                matrix: getSVGMatrix(el as SVGSVGElement, n),
            });
            matrixes.push({
                type: "offset",
                target: el,
                matrix: createIdentityMatrix(n),
            });
        }

        let offsetParent: HTMLElement;
        let isOffsetEnd = false;
        let isStatic = false;

        const targetZoom = parseFloat((style as any).zoom) || 1;

        if (isFixed) {
            offsetParent = fixedInfo.fixedContainer!;
            isOffsetEnd = true;
        } else {
            const offsetInfo = getOffsetInfo(el, container, false, true, style);
            const offsetZoom = offsetInfo.offsetZoom;

            offsetParent = offsetInfo.offsetParent;
            isOffsetEnd = offsetInfo.isEnd;
            isStatic = offsetInfo.isStatic;
            zoom *= offsetZoom;

            if (offsetZoom !== 1 && isStatic) {
                offsetLeft -= offsetParent.offsetLeft;
                offsetTop -= offsetParent.offsetTop;
            } else if (IS_FIREFOX || IS_CHROMIUM109) {
                const parentSlotElement = offsetInfo.parentSlotElement;

                if (parentSlotElement) {
                    let customOffsetParent: HTMLElement | null = offsetParent;
                    let customOffsetLeft = 0;
                    let customOffsetTop = 0;

                    while (customOffsetParent) {
                        if (!getShadowRoot(customOffsetParent)) {
                            break;
                        }
                        customOffsetLeft += customOffsetParent.offsetLeft;
                        customOffsetTop += customOffsetParent.offsetTop;
                        customOffsetParent = customOffsetParent.offsetParent as HTMLElement;
                    }
                    offsetLeft -= customOffsetLeft;
                    offsetTop -= customOffsetTop;
                }
            }
        }

        if (
            IS_WEBKIT && !IS_SAFARI_ABOVE15
            && hasOffset && !isSVG && isStatic
            && (position === "relative" || position === "static")
        ) {
            offsetLeft -= offsetParent.offsetLeft;
            offsetTop -= offsetParent.offsetTop;
            requestEnd = requestEnd || isOffsetEnd;
        }

        let parentClientLeft = 0;
        let parentClientTop = 0;
        let fixedClientLeft = 0;
        let fixedClientTop = 0;

        if (isFixed) {
            if (hasOffset && fixedInfo.hasTransform) {
                // border
                fixedClientLeft = offsetParent.clientLeft;
                fixedClientTop = offsetParent.clientTop;
            }
        } else {
            if (hasOffset && offsetContainer !== offsetParent) {
                // border
                parentClientLeft = offsetParent.clientLeft;
                parentClientTop = offsetParent.clientTop;
            }
            if (hasOffset && offsetParent === documentElement) {
                const margin = getBodyOffset(el, false, style);

                offsetLeft += margin[0];
                offsetTop += margin[1];
            }
        }

        matrixes.push({
            type: "target",
            target: el,
            matrix: getAbsoluteMatrix(matrix, n, origin),
        });

        if (hasOffset) {
            const isElementTarget = el === target;
            const scrollLeft = isElementTarget ? 0 : el.scrollLeft;
            const scrollTop = isElementTarget ? 0 : el.scrollTop;

            matrixes.push({
                type: "offset",
                target: el,
                matrix: createOriginMatrix([
                    offsetLeft - scrollLeft + parentClientLeft - fixedClientLeft,
                    offsetTop - scrollTop + parentClientTop - fixedClientTop,
                ], n),
            });
        } else {
            // svg
            matrixes.push({
                type: "offset",
                target: el,
                origin,
            });
        }
        // transform으로 계산되지 않는 zoom을 위한 (0, 0) 을 기준 matrix 추가.
        if (targetZoom !== 1) {
            matrixes.push({
                type: "zoom",
                target: el,
                matrix: getAbsoluteMatrix(createScaleMatrix([targetZoom, targetZoom], n), n, [0, 0]),
            });
        }
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
            requestEnd = isOffsetEnd;
        }
        if (!checkContainer || el === documentElement) {
            isEnd = requestEnd;
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
        zoom,
        offsetContainer,
        matrixes,
        targetMatrix,
        transformOrigin,
        targetOrigin: targetTransformOrigin,
        is3d,
        hasFixed,
    };
}
