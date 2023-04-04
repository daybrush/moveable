import { find } from "@daybrush/utils";
import { getClientRect } from "../utils";
import { MoveableClientRect } from "../types";
import { getMatrixStackInfo, MatrixStackInfo } from "../utils/getMatrixStackInfo";

let cacheStyleMap: Map<Element, {
    style: CSSStyleDeclaration;
    cached: Record<string, any>;
}> | null = null;
let clientRectStyleMap: Map<Element, MoveableClientRect> | null = null;

let matrixContainerInfos: Array<[
    [SVGElement | HTMLElement, SVGElement | HTMLElement | null | undefined],
    MatrixStackInfo
]> | null = null;

export type GetStyle = (propertyName: string) => any;
export function setStoreCache(useCache?: boolean) {
    if (useCache) {
        if (window.Map) {
            cacheStyleMap = new Map();
            clientRectStyleMap = new Map();
        }
        matrixContainerInfos = [];
    } else {
        cacheStyleMap = null;
        matrixContainerInfos = null;
        clientRectStyleMap = null;
    }
}

export function getCachedClientRect(el: HTMLElement | SVGElement): MoveableClientRect {
    const clientRect = clientRectStyleMap?.get(el);

    if (clientRect) {
        return clientRect;
    }
    const nextClientRect = getClientRect(el, true);

    if (clientRectStyleMap) {
        clientRectStyleMap.set(el, nextClientRect);
    }
    return nextClientRect;
}

export function getCachedMatrixContainerInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
) {
    if (matrixContainerInfos) {
        const result = find(matrixContainerInfos, info => info[0][0] == target && info[0][1] == container);

        if (result) {
            return result[1];
        }
    }
    const result = getMatrixStackInfo(target, container, true);

    if (matrixContainerInfos) {
        matrixContainerInfos.push([[target, container], result]);
    }
    return result;
}
export function getCachedStyle(element: Element): GetStyle {
    let cache = cacheStyleMap?.get(element);

    if (!cache) {
        const nextStyle = window.getComputedStyle(element);

        if (!cacheStyleMap) {
            return (property: string) => {
                return (nextStyle as any)[property];
            };
        }
        cache = {
            style: nextStyle,
            cached: {},
        };
        cacheStyleMap.set(element, cache);
    }
    const cached = cache.cached;
    const style = cache.style;

    return (property: string) => {
        if (!(property in cached)) {
            cached[property] = (style as any)[property];
        }
        return cached[property];
    };
}
