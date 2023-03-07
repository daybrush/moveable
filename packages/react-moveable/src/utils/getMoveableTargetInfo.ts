import { plus, getOrigin, multiply, minus } from "@scena/matrix";
import { MoveableClientRect, Writable } from "../types";
import {
    calculateInversePosition,
    calculateMoveablePosition,
    getClientRect, getClientRectByPosition, getOffsetInfo, getTransformOrigin, resetClientRect,
} from "../utils";
import { calculateElementInfo, MoveableElementInfo } from "./getElementInfo";


export interface MoveableTargetInfo extends MoveableElementInfo {
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rootContainerClientRect: MoveableClientRect;
    beforeDirection: 1 | -1;
    beforeOrigin: number[];
    offsetDelta: number[],
    originalBeforeOrigin: number[];
    target: HTMLElement | SVGElement | null | undefined;
    style: Partial<Writable<CSSStyleDeclaration>>;
}

export function getMoveableTargetInfo(
    moveableElement?: HTMLElement | null,
    target?: HTMLElement | SVGElement | null,
    container?: HTMLElement | SVGElement | null,
    parentContainer?: HTMLElement | SVGElement | null,
    rootContainer?: HTMLElement | SVGElement | null,
    requestStyles: Array<keyof CSSStyleDeclaration> = [],
): MoveableTargetInfo {
    let beforeDirection: 1 | -1 = 1;
    let beforeOrigin = [0, 0];
    let targetClientRect = resetClientRect();
    let moveableClientRect = resetClientRect();
    let containerClientRect = resetClientRect();
    let rootContainerClientRect = resetClientRect();
    let offsetDelta = [0, 0];
    const style: Partial<Writable<CSSStyleDeclaration>> = {};

    const result = calculateElementInfo(
        target, container!, rootContainer!,
        true,
    );
    if (target) {
        const computedStyle = getComputedStyle(target);

        requestStyles.forEach(name => {
            style[name] = computedStyle[name] as any;
        });
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

        rootContainerClientRect = getClientRect(result.offsetRootContainer!);


        const offsetContainer = getOffsetInfo(parentContainer, parentContainer, true).offsetParent
            || result.offsetRootContainer!;

        if (result.hasZoom) {
            const absoluteTargetPosition = calculateMoveablePosition(
                multiply(result.originalRootMatrix, result.allMatrix),
                result.transformOrigin,
                result.width, result.height,
            );
            const absoluteContainerPosition = calculateMoveablePosition(
                result.originalRootMatrix,
                getTransformOrigin(getComputedStyle(offsetContainer)).map(pos => parseFloat(pos)),
                offsetContainer.offsetWidth, offsetContainer.offsetHeight,
            );
            targetClientRect = getClientRectByPosition(absoluteTargetPosition, rootContainerClientRect);
            containerClientRect = getClientRectByPosition(
                absoluteContainerPosition,
                rootContainerClientRect,
                offsetContainer,
                true,
            );

            if (moveableElement) {
                const left = absoluteTargetPosition.left;
                const top = absoluteTargetPosition.top;
                moveableClientRect = getClientRectByPosition({
                    left,
                    top,
                    bottom: top,
                    right: top,
                }, rootContainerClientRect);
            }
        } else {
            targetClientRect = getClientRect(target);
            containerClientRect = getClientRect(offsetContainer, true);

            if (moveableElement) {
                moveableClientRect = getClientRect(moveableElement);
            }
            const {
                left: containerClientRectLeft,
                top: containerClientRectTop,
                clientLeft: containterClientLeft,
                clientTop: containerClientTop,
            } = containerClientRect;
            const clientDelta = [
                targetClientRect.left - containerClientRectLeft,
                targetClientRect.top - containerClientRectTop,
            ];

            offsetDelta = minus(
                calculateInversePosition(result.rootMatrix, clientDelta, 4),
                [containterClientLeft! + result.left, containerClientTop! + result.top],
            );
        }
    }

    return {
        targetClientRect,
        containerClientRect,
        moveableClientRect,
        rootContainerClientRect,
        beforeDirection,
        beforeOrigin,
        originalBeforeOrigin: beforeOrigin,
        target,
        style,
        offsetDelta,
        ...result,
    };
}
