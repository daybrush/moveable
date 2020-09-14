import { getElementInfo as getElementInfoFunction } from "react-moveable";

export function getElementInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    rootContainer?: SVGElement | HTMLElement | null | undefined,
) {
    return getElementInfoFunction(target, container, rootContainer);
};
