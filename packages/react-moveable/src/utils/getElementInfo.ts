import { createIdentityMatrix } from "@scena/matrix";
import { ElementSizes, MoveablePosition } from "../types";
import { calculateMoveablePosition, getSize, getRotationRad } from "../utils";
import { calculateMatrixStack, MoveableElementMatrixInfo } from "./calculateMatrixStack";

export interface MoveableElementInfo extends MoveableElementMatrixInfo, MoveablePosition, ElementSizes {
    width: number;
    height: number;
    rotation: number;
}

export function calculateElementInfo(
    target?: SVGElement | HTMLElement | null,
    container?: SVGElement | HTMLElement | null,
    rootContainer: HTMLElement | SVGElement | null | undefined = container,
    isAbsolute3d?: boolean,
): MoveableElementInfo {
    let width = 0;
    let height = 0;
    let rotation = 0;
    let allResult: {} = {};

    const sizes = getSize(target);

    if (target) {
        width = sizes.offsetWidth;
        height = sizes.offsetHeight;
    }

    if (target) {
        const result = calculateMatrixStack(
            target,
            container,
            rootContainer,
            isAbsolute3d,
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
        hasZoom: false,
        width,
        height,
        rotation,
        ...sizes,
        originalRootMatrix: createIdentityMatrix(n),
        rootMatrix: createIdentityMatrix(n),
        beforeMatrix: createIdentityMatrix(n),
        offsetMatrix: createIdentityMatrix(n),
        allMatrix: createIdentityMatrix(n),
        targetMatrix: createIdentityMatrix(n),
        targetTransform: "",
        inlineTransform: "",
        transformOrigin: [0, 0],
        targetOrigin: [0, 0],
        is3d: !!isAbsolute3d,
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
        hasFixed: false,
        offsetContainer: null,
        offsetRootContainer: null,
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
