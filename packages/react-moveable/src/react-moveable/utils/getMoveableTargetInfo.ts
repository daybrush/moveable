import { plus, getOrigin } from "@scena/matrix";
import { MoveableClientRect } from "../types";
import {
    calculateMoveablePosition,
    getClientRect, getOffsetInfo, resetClientRect,
} from "../utils";
import { calculateElementInfo, MoveableElementInfo } from "./getElementInfo";


export interface MoveableTargetInfo extends MoveableElementInfo {
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rootContainerClientRect: MoveableClientRect;
    beforeDirection: 1 | -1;
    beforeOrigin: number[];
    originalBeforeOrigin: number[];
    target: HTMLElement | SVGElement | null | undefined;
}

export function getMoveableTargetInfo(
    moveableElement?: HTMLElement | null,
    target?: HTMLElement | SVGElement | null,
    container?: HTMLElement | SVGElement | null,
    parentContainer?: HTMLElement | SVGElement | null,
    rootContainer?: HTMLElement | SVGElement | null,
    // state?: Partial<MoveableManagerState> | false | undefined,
): MoveableTargetInfo {
    let beforeDirection: 1 | -1 = 1;
    let beforeOrigin = [0, 0];
    let targetClientRect = resetClientRect();
    let moveableClientRect = resetClientRect();
    let containerClientRect = resetClientRect();
    let rootContainerClientRect = resetClientRect();

    const result = calculateElementInfo(
        target, container!, rootContainer!,
        true,
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
        const offsetContainer = getOffsetInfo(parentContainer, parentContainer, true).offsetParent
            || result.offsetRootContainer!;
        containerClientRect = getClientRect(offsetContainer, true);
        rootContainerClientRect = getClientRect(result.offsetRootContainer!);
        if (moveableElement) {
            moveableClientRect = getClientRect(moveableElement);
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
        ...result,
    };
}
