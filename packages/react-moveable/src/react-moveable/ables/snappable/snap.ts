import {
    SnapInfo, SnappableProps, SnappableState,
    SnapGuideline, ResizableProps, ScalableProps,
    SnapOffsetInfo, MoveableManagerInterface, MoveableClientRect,
    ElementGuidelineValue,
} from "../../types";
import {
    selectValue, throttle, getAbsolutePosesByState,
    getRect, groupBy, getTinyDist, calculateInversePosition,
    calculatePosition, roundSign, getRefTarget,
} from "../../utils";
import { getPosByDirection, getPosesByDirection } from "../../gesto/GestoUtils";
import { TINY_NUM } from "../../consts";
import { minus } from "@scena/matrix";
import { getMinMaxs } from "overlap-area";
import { diff } from "@egjs/children-differ";
import { isObject } from "@daybrush/utils";

export function calculateContainerPos(
    rootMatrix: number[],
    containerRect: MoveableClientRect,
    n: number,
) {
    const clientPos = calculatePosition(
        rootMatrix, [containerRect.clientLeft!, containerRect.clientTop!], n);

    return [
        containerRect.left + clientPos[0],
        containerRect.top + clientPos[1],
    ];
}

export function getGapGuidelines(
    guidelines: SnapGuideline[],
    type: "vertical" | "horizontal",
    snapThreshold: number,
    index: number,
    [start, end]: number[],
    [otherStart, otherEnd]: number[],
) {
    const totalGuidelines: SnapGuideline[] = [];
    const otherIndex = index ? 0 : 1;
    const otherType = type === "vertical" ? "horizontal" : "vertical";

    const elementGuidelines
        = groupBy(guidelines.filter(({ type: guidelineType }) => guidelineType === type), ({ element }) => element)
            .map(group => group[0])
            .filter(({ pos, sizes }) => pos[otherIndex] <= otherEnd
                && otherStart <= pos[otherIndex] + sizes![otherIndex]);

    elementGuidelines.forEach(guideline1 => {
        const elementStart = guideline1.pos[index];
        const elementEnd = elementStart + guideline1.sizes![index];

        elementGuidelines.forEach(guideline2 => {
            const {
                pos: guideline2Pos,
                sizes: guideline2Sizes,
                element: guideline2Element,
                className: guidline2ClassName,
            } = guideline2;
            const targetStart = guideline2Pos[index];
            const targetEnd = targetStart + guideline2Sizes![index];
            let pos = 0;
            let gap = 0;
            let canSnap = true;

            if (elementEnd <= targetStart) {
                // gap -
                gap = elementEnd - targetStart;
                pos = targetEnd - gap;

                if (start < pos - snapThreshold) {
                    canSnap = false;
                }
                // element target moveable
            } else if (targetEnd <= elementStart) {
                // gap +
                gap = elementStart - targetEnd;
                pos = targetStart - gap;

                if (end > pos + snapThreshold) {
                    canSnap = false;
                }
                // moveable target element
            } else {
                return;
            }
            if (canSnap) {
                totalGuidelines.push({
                    pos: otherType === "vertical" ? [pos, guideline2Pos[1]] : [guideline2Pos[0], pos],
                    element: guideline2Element,
                    sizes: guideline2Sizes,
                    size: 0,
                    type: otherType,
                    gap,
                    className: guidline2ClassName,
                    gapGuidelines: elementGuidelines,
                });
            }
            if (elementEnd <= start && end <= targetStart) {
                // elementEnd   moveable   target
                const centerPos = ((targetStart + elementEnd) - (end - start)) / 2;

                if (throttle(start - (centerPos - snapThreshold), 0.1) >= 0) {
                    totalGuidelines.push({
                        pos: otherType === "vertical" ? [centerPos, guideline2Pos[1]] : [guideline2Pos[0], centerPos],
                        className: guidline2ClassName,
                        element: guideline2Element,
                        sizes: guideline2Sizes,
                        size: 0,
                        type: otherType,
                        gap: elementEnd - start,
                        gapGuidelines: elementGuidelines,
                    });
                }
            }
        });
    });
    return totalGuidelines;
}
export function getDefaultGuidelines(
    horizontalGuidelines: number[] | false,
    verticalGuidelines: number[] | false,
    width: number,
    height: number,
    clientLeft = 0,
    clientTop = 0,
    snapOffset = { left: 0, top: 0, right: 0, bottom: 0 },
): SnapGuideline[] {
    const guidelines: SnapGuideline[] = [];
    const {
        left: snapOffsetLeft,
        top: snapOffsetTop,
    } = snapOffset;

    horizontalGuidelines && horizontalGuidelines!.forEach(pos => {
        guidelines.push({ type: "horizontal", pos: [
            snapOffsetLeft,
            throttle(pos - clientTop + snapOffsetTop, 0.1),
        ], size: width! });
    });
    verticalGuidelines && verticalGuidelines!.forEach(pos => {
        guidelines.push({ type: "vertical", pos: [
            throttle(pos - clientLeft + snapOffsetLeft, 0.1),
            snapOffsetTop,
        ], size: height! });
    });
    return guidelines;
}
export function calculateElementGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    values: ElementGuidelineValue[],
) {
    const guidelines: SnapGuideline[] = [];

    if (!values.length) {
        return guidelines;
    }
    const state = moveable.state;
    const {
        snapCenter,
    } = moveable.props;
    const {
        containerClientRect,
        targetClientRect: {
            top: clientTop,
            left: clientLeft,
        },
        rootMatrix,
        is3d,
    } = state;
    const n = is3d ? 4 : 3;
    const [containerLeft, containerTop] = calculateContainerPos(rootMatrix, containerClientRect, n);
    const poses = getAbsolutePosesByState(state);
    const {
        minX: targetLeft,
        minY: targetTop,
    } = getMinMaxs(poses);
    const [distLeft, distTop] = minus([targetLeft, targetTop], calculateInversePosition(rootMatrix, [
        clientLeft - containerLeft,
        clientTop - containerTop,
    ], n)).map(pos => roundSign(pos));

    values.forEach(value => {
        const {
            element,
            top: topValue,
            left: leftValue,
            right: rightValue,
            bottom: bottomValue,
            className,
        } = value;
        const rect = element.getBoundingClientRect();
        const left = rect.left - containerLeft;
        const top = rect.top - containerTop;
        const bottom = top + rect.height;
        const right = left + rect.width;
        const [elementLeft, elementTop] = calculateInversePosition(rootMatrix, [left, top], n);
        const [elementRight, elementBottom] = calculateInversePosition(rootMatrix, [right, bottom], n);
        const width = elementRight - elementLeft;
        const height = elementBottom - elementTop;
        const sizes = [width, height];

        //top
        if (topValue !== false) {
            guidelines.push({
                type: "vertical", element, pos: [
                    throttle(elementLeft + distLeft, 0.1),
                    elementTop,
                ], size: height,
                sizes,
                className,
            });
        }

        // bottom
        if (bottomValue !== false) {
            guidelines.push({
                type: "vertical", element, pos: [
                    throttle(elementRight + distLeft, 0.1),
                    elementTop,
                ], size: height,
                sizes,
                className,
            });
        }

        // left
        if (leftValue !== false) {
            guidelines.push({
                type: "horizontal", element, pos: [
                    elementLeft,
                    throttle(elementTop + distTop, 0.1),
                ], size: width,
                sizes,
                className,
            });
        }

        // right
        if (rightValue !== false) {
            guidelines.push({
                type: "horizontal", element, pos: [
                    elementLeft,
                    throttle(elementBottom + distTop, 0.1),
                ], size: width,
                sizes,
                className,
            });
        }

        if (snapCenter) {
            guidelines.push({
                type: "vertical",
                element,
                pos: [
                    throttle((elementLeft + elementRight) / 2 + distLeft, 0.1),
                    elementTop,
                ],
                size: height,
                sizes,
                center: true,
                className,
            });
            guidelines.push({
                type: "horizontal",
                element,
                pos: [
                    elementLeft,
                    throttle((elementTop + elementBottom) / 2 + distTop, 0.1),
                ],
                size: width,
                sizes,
                center: true,
                className,
            });
        }
    });
    return guidelines;
}
export function getElementGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    isRefresh: boolean,
    prevGuidelines: SnapGuideline[] = [],
) {
    const guidelines: SnapGuideline[] = [];
    const state = moveable.state;

    if (isRefresh && state.guidelines && state.guidelines.length) {
        return guidelines;
    }

    const {
        elementGuidelines = [],
    } = moveable.props;

    if (!elementGuidelines.length) {
        return guidelines;
    }

    const prevValues = state.elementGuidelineValues || [];
    const nextValues = elementGuidelines.map(el => {
        if (isObject(el) && "element" in el) {
            return el;
        }
        return {
            element: getRefTarget(el, true)!,
        };
    }).filter(value => {
        return value.element;
    }) as ElementGuidelineValue[];

    state.elementGuidelineValues = nextValues;

    const { added, removed } = diff(prevValues.map(v => v.element), nextValues.map(v => v.element));
    const removedElements = removed.map(index => prevValues[index].element);
    const addedGuidelines = calculateElementGuidelines(moveable, added.map(index => nextValues[index]).filter(value => {
        return (value.refresh && isRefresh) || (!value.refresh && !isRefresh);
    }));

    return [
        ...prevGuidelines.filter(guideline => removedElements.indexOf(guideline.element!) === -1),
        ...addedGuidelines,
    ];
}
export function getTotalGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
) {
    const {
        snapOffset,
        staticGuidelines,
        snapContainerRect: {
            overflow,
            scrollHeight: containerHeight,
            scrollWidth: containerWidth,
            clientHeight: containerClientHeight,
            clientWidth: containerClientWidth,
        },
        containerClientRect: {
            clientLeft,
            clientTop,
        },
    } = moveable.state;
    const {
        snapHorizontal = true,
        snapVertical = true,
        snapGap = true,
        verticalGuidelines,
        horizontalGuidelines,
        snapThreshold = 5,
        snapGridWidth = 0,
        snapGridHeight = 0,
    } = moveable.props;
    const totalGuidelines: SnapGuideline[] = [...staticGuidelines, ...getElementGuidelines(moveable, true)];

    if (snapGap) {
        const { top, left, bottom, right } = getRect(getAbsolutePosesByState(moveable.state));
        const elementGuidelines = staticGuidelines.filter(({ element }) => element);

        totalGuidelines.push(...getGapGuidelines(
            elementGuidelines,
            "horizontal",
            snapThreshold,
            0,
            [left, right],
            [top, bottom],
        ), ...getGapGuidelines(
            elementGuidelines,
            "vertical",
            snapThreshold,
            1,
            [top, bottom],
            [left, right],
        ));
    }
    totalGuidelines.push(...getGridGuidelines(
        snapGridWidth,
        snapGridHeight,
        overflow ? containerWidth! : containerClientWidth!,
        overflow ? containerHeight! : containerClientHeight!,
        clientLeft,
        clientTop,
    ));

    totalGuidelines.push(...getDefaultGuidelines(
        (snapHorizontal && horizontalGuidelines) || false,
        (snapVertical && verticalGuidelines) || false,
        overflow ? containerWidth! : containerClientWidth!,
        overflow ? containerHeight! : containerClientHeight!,
        clientLeft,
        clientTop,
        snapOffset,
    ));

    return totalGuidelines;
}
export function getGridGuidelines(
    snapGridWidth: number,
    snapGridHeight: number,
    containerWidth: number,
    containerHeight: number,
    clientLeft = 0,
    clientTop = 0,
): SnapGuideline[] {
    const guidelines: SnapGuideline[] = [];

    if (snapGridHeight) {
        for (let pos = 0; pos < containerHeight; pos += snapGridHeight) {
            guidelines.push({
                type: "horizontal",
                pos: [0, throttle(pos - clientTop, 0.1)],
                size: containerWidth!,
                hide: true,
            });
        }
    }
    if (snapGridWidth) {
        for (let pos = 0; pos < containerWidth; pos += snapGridWidth) {
            guidelines.push({
                type: "vertical",
                pos: [throttle(pos - clientLeft, 0.1), 0],
                size: containerHeight!,
                hide: true,
            });
        }
    }
    return guidelines;
}
export function checkMoveableSnapPoses(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    snapCenter?: boolean,
    customSnapThreshold?: number,
) {
    const props = moveable.props;
    const {
        snapElement = true,
    } = props;
    const snapThreshold = selectValue<number>(customSnapThreshold, props.snapThreshold, 5);

    return checkSnapPoses(
        moveable.state.guidelines,
        posesX,
        posesY,
        {
            snapThreshold,
            snapCenter,
            snapElement,
        },
    );
}

export function checkSnapPoses(
    guidelines: SnapGuideline[],
    posesX: number[],
    posesY: number[],
    options: {
        snapThreshold?: number,
        snapCenter?: boolean,
        snapElement?: boolean,
    },
) {
    return {
        vertical: checkSnap(guidelines, "vertical", posesX, options),
        horizontal: checkSnap(guidelines, "horizontal", posesY, options),
    };
}
export function checkSnapKeepRatio(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    startPos: number[],
    endPos: number[],
): { vertical: SnapOffsetInfo, horizontal: SnapOffsetInfo } {
    const [endX, endY] = endPos;
    const [startX, startY] = startPos;
    let [dx, dy] = minus(endPos, startPos);
    const isBottom = dy > 0;
    const isRight = dx > 0;

    dx = getTinyDist(dx);
    dy = getTinyDist(dy);

    const verticalInfo: SnapOffsetInfo = {
        isSnap: false,
        offset: 0,
        pos: 0,
    };
    const horizontalInfo: SnapOffsetInfo = {
        isSnap: false,
        offset: 0,
        pos: 0,
    };

    if (dx === 0 && dy === 0) {
        return {
            vertical: verticalInfo,
            horizontal: horizontalInfo,
        };
    }
    const {
        vertical: verticalSnapInfo,
        horizontal: horizontalSnapInfo,
    } = checkMoveableSnapPoses(moveable, dx ? [endX] : [], dy ? [endY] : []);

    verticalSnapInfo.posInfos.filter(({ pos }) => {
        return isRight ? pos >= startX : pos <= startX;
    });
    horizontalSnapInfo.posInfos.filter(({ pos }) => {
        return isBottom ? pos >= startY : pos <= startY;
    });
    verticalSnapInfo.isSnap = verticalSnapInfo.posInfos.length > 0;
    horizontalSnapInfo.isSnap = horizontalSnapInfo.posInfos.length > 0;

    const {
        isSnap: isVerticalSnap,
        guideline: verticalGuideline,
    } = getNearestSnapGuidelineInfo(verticalSnapInfo);
    const {
        isSnap: isHorizontalSnap,
        guideline: horizontalGuideline,
    } = getNearestSnapGuidelineInfo(horizontalSnapInfo);
    const horizontalPos = isHorizontalSnap ? horizontalGuideline!.pos[1] : 0;
    const verticalPos = isVerticalSnap ? verticalGuideline!.pos[0] : 0;

    if (dx === 0) {
        if (isHorizontalSnap) {
            horizontalInfo.isSnap = true;
            horizontalInfo.pos = horizontalGuideline!.pos[1];
            horizontalInfo.offset = endY - horizontalInfo.pos;
        }
    } else if (dy === 0) {
        if (isVerticalSnap) {
            verticalInfo.isSnap = true;
            verticalInfo.pos = verticalPos;
            verticalInfo.offset = endX - verticalPos;
        }
    } else {
        // y - y1 = a * (x - x1)
        const a = dy / dx;
        const b = endPos[1] - a * endX;
        let y = 0;
        let x = 0;
        let isSnap = false;

        if (isVerticalSnap) {
            x = verticalPos;
            y = a * x + b;
            isSnap = true;
        } else if (isHorizontalSnap) {
            y = horizontalPos;
            x = (y - b) / a;
            isSnap = true;
        }
        if (isSnap) {
            verticalInfo.isSnap = true;
            verticalInfo.pos = x;
            verticalInfo.offset = endX - x;

            horizontalInfo.isSnap = true;
            horizontalInfo.pos = y;
            horizontalInfo.offset = endY - y;
        }
    }
    return {
        vertical: verticalInfo,
        horizontal: horizontalInfo,
    };
}

export function checkSnaps(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    rect: {
        left?: number,
        top?: number,
        bottom?: number,
        right?: number,
        center?: number,
        middle?: number,
    },
    isCenter: boolean,
    customSnapThreshold?: number,
) {
    const snapCenter = moveable.props.snapCenter;
    const isSnapCenter = snapCenter! && isCenter;

    let verticalNames: Array<"left" | "center" | "right"> = ["left", "right"];
    let horizontalNames: Array<"top" | "middle" | "bottom"> = ["top", "bottom"];

    if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
    }
    verticalNames = verticalNames.filter(name => name in rect);
    horizontalNames = horizontalNames.filter(name => name in rect);

    return checkMoveableSnapPoses(
        moveable,
        verticalNames.map(name => rect[name]!),
        horizontalNames.map(name => rect[name]!),
        isSnapCenter,
        customSnapThreshold,
    );
}

export function getNearestSnapGuidelineInfo(
    snapInfo: SnapInfo,
) {
    const isSnap = snapInfo.isSnap;

    if (!isSnap) {
        return {
            isSnap: false,
            offset: 0,
            dist: -1,
            pos: 0,
            guideline: null,
        };
    }
    const posInfo = snapInfo.posInfos[0];
    const guidelineInfo = posInfo!.guidelineInfos[0];
    const offset = guidelineInfo!.offset;
    const dist = guidelineInfo!.dist;
    const guideline = guidelineInfo!.guideline;

    return {
        isSnap,
        offset,
        dist,
        pos: posInfo!.pos,
        guideline,
    };
}

function checkSnap(
    guidelines: SnapGuideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    {
        snapThreshold = 5,
        snapElement,
        snapCenter,
    }: {
        snapThreshold?: number,
        snapCenter?: boolean,
        snapElement?: boolean,
    } = {},
): SnapInfo {
    if (!guidelines || !guidelines.length) {
        return {
            isSnap: false,
            index: -1,
            posInfos: [],
        };
    }
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPosInfos = targetPoses.map((targetPos, index) => {
        const guidelineInfos = guidelines.map(guideline => {
            const { pos } = guideline;
            const offset = targetPos - pos[posType];

            return {
                offset,
                dist: Math.abs(offset),
                guideline,
            };
        }).filter(({ guideline, dist }) => {
            const { type, center, element } = guideline;
            if (
                (!snapElement && element)
                || (!snapCenter && center)
                || type !== targetType
                || dist > snapThreshold
            ) {
                return false;
            }
            return true;
        }).sort(
            (a, b) => a.dist - b.dist,
        );


        return {
            pos: targetPos,
            index,
            guidelineInfos,
        };
    }).filter(snapPosInfo => {
        return snapPosInfo.guidelineInfos.length > 0;
    }).sort((a, b) => {
        return a.guidelineInfos[0].dist - b.guidelineInfos[0].dist;
    });

    const isSnap = snapPosInfos.length > 0;
    return {
        isSnap,
        index: isSnap ? snapPosInfos[0].index : -1,
        posInfos: snapPosInfos,
    };
}

export function getSnapInfosByDirection(
    moveable: MoveableManagerInterface<SnappableProps & (ResizableProps | ScalableProps), SnappableState>,
    poses: number[][],
    snapDirection: number[],
) {
    let nextPoses: number[][] = [];
    if (snapDirection[0] && snapDirection[1]) {
        nextPoses = [
            snapDirection,
            [-snapDirection[0], snapDirection[1]],
            [snapDirection[0], -snapDirection[1]],
        ].map(direction => getPosByDirection(poses, direction));
    } else if (!snapDirection[0] && !snapDirection[1]) {
        const alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];

        for (let i = 0; i < 4; ++i) {
            nextPoses.push(alignPoses[i]);
            nextPoses.push([
                (alignPoses[i][0] + alignPoses[i + 1][0]) / 2,
                (alignPoses[i][1] + alignPoses[i + 1][1]) / 2,
            ]);
        }
    } else {
        if (moveable.props.keepRatio) {
            nextPoses = [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
                snapDirection,
            ].map(dir => getPosByDirection(poses, dir));
        } else {
            nextPoses = getPosesByDirection(poses, snapDirection);

            if (nextPoses.length > 1) {
                nextPoses.push([
                    (nextPoses[0][0] + nextPoses[1][0]) / 2,
                    (nextPoses[0][1] + nextPoses[1][1]) / 2,
                ]);
            }
        }
    }
    return checkMoveableSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
}

export function checkSnapBoundPriority(
    a: { isBound: boolean, isSnap: boolean, offset: number },
    b: { isBound: boolean, isSnap: boolean, offset: number },
) {
    const aDist = Math.abs(a.offset);
    const bDist = Math.abs(b.offset);

    if (a.isBound && b.isBound) {
        return bDist - aDist;
    } else if (a.isBound) {
        return -1;
    } else if (b.isBound) {
        return 1;
    } else if (a.isSnap && b.isSnap) {
        return bDist - aDist;
    } else if (a.isSnap) {
        return -1;
    } else if (b.isSnap) {
        return 1;
    } else if (aDist < TINY_NUM) {
        return 1;
    } else if (bDist < TINY_NUM) {
        return -1;
    }
    return aDist - bDist;
}
export function getNearOffsetInfo<T extends { offset: number[], isBound: boolean, isSnap: boolean, sign: number[] }>(
    offsets: T[],
    index: number,
) {
    return offsets.slice().sort((a, b) => {
        const aSign = a.sign[index];
        const bSign = b.sign[index];
        const aOffset = a.offset[index];
        const bOffset = b.offset[index];
        // -1 The positions of a and b do not change.
        // 1 The positions of a and b are reversed.
        if (!aSign) {
            return 1;
        } else if (!bSign) {
            return -1;
        }
        return checkSnapBoundPriority(
            { isBound: a.isBound, isSnap: a.isSnap, offset: aOffset },
            { isBound: b.isBound, isSnap: b.isSnap, offset: bOffset },
        );
    })[0];
}
