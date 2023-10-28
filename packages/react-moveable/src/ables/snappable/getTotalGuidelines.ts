import { convertUnitSize, dot, flat, isNumber, isObject, throttle } from "@daybrush/utils";
import { diff } from "@egjs/children-differ";
import {
    MoveableManagerInterface, SnappableProps,
    SnappableState, SnapGuideline, SnapDirectionPoses,
    PosGuideline, ElementGuidelineValue,
    SnapElementRect,
    NumericPosGuideline,
} from "../../types";
import { getRect, getAbsolutePosesByState, getRefTarget, calculateInversePosition, prefix, abs } from "../../utils";
import {
    splitSnapDirectionPoses, getSnapDirections,
    HORIZONTAL_NAMES_MAP, VERTICAL_NAMES_MAP, calculateContainerPos, SNAP_SKIP_NAMES_MAP,
} from "./utils";

export function getTotalGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
) {
    const state = moveable.state;
    const {
        containerClientRect,
        hasFixed,
    } = state;
    const {
        overflow,
        scrollHeight: containerHeight,
        scrollWidth: containerWidth,
        clientHeight: containerClientHeight,
        clientWidth: containerClientWidth,
        clientLeft,
        clientTop,
    } = containerClientRect;
    const {
        snapGap = true,
        verticalGuidelines,
        horizontalGuidelines,
        snapThreshold = 5,
        maxSnapElementGuidelineDistance = Infinity,
        isDisplayGridGuidelines,
    } = moveable.props;
    const { top, left, bottom, right } = getRect(getAbsolutePosesByState(moveable.state));
    const targetRect = { top, left, bottom, right, center: (left + right) / 2, middle: (top + bottom) / 2 };
    const elementGuidelines = getElementGuidelines(moveable);
    let totalGuidelines: SnapGuideline[] = [...elementGuidelines];

    const snapThresholdMultiples = (state.snapThresholdInfo?.multiples ?? [1, 1]).map(n => n * snapThreshold);

    if (snapGap) {
        totalGuidelines.push(...getGapGuidelines(
            moveable,
            targetRect,
            snapThresholdMultiples,
        ));
    }
    const snapOffset = {
        ...(state.snapOffset || {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
        }),
    };

    totalGuidelines.push(...getGridGuidelines(
        moveable,
        overflow ? containerWidth! : containerClientWidth!,
        overflow ? containerHeight! : containerClientHeight!,
        clientLeft,
        clientTop,
        snapOffset,
        isDisplayGridGuidelines,
    ));


    if (hasFixed) {
        const { left, top } = containerClientRect;

        snapOffset.left += left;
        snapOffset.top += top;
        snapOffset.right += left;
        snapOffset.bottom += top;
    }

    totalGuidelines.push(...getDefaultGuidelines(
        horizontalGuidelines || false,
        verticalGuidelines || false,
        overflow ? containerWidth! : containerClientWidth!,
        overflow ? containerHeight! : containerClientHeight!,
        clientLeft,
        clientTop,
        snapOffset,
    ));

    totalGuidelines = totalGuidelines.filter(({ element, elementRect, type }) => {
        if (!element || !elementRect) {
            return true;
        }
        const rect = elementRect.rect;

        return checkBetweenRects(targetRect, rect, type, maxSnapElementGuidelineDistance);
    });

    return totalGuidelines;
}

export function getGapGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    targetRect: SnapDirectionPoses,
    snapThresholds: number[],
) {
    const {
        maxSnapElementGuidelineDistance = Infinity,
        maxSnapElementGapDistance = Infinity,
    } = moveable.props;
    const elementRects = moveable.state.elementRects;
    const gapGuidelines: SnapGuideline[] = [];
    [
        ["vertical", VERTICAL_NAMES_MAP, HORIZONTAL_NAMES_MAP] as const,
        ["horizontal", HORIZONTAL_NAMES_MAP, VERTICAL_NAMES_MAP] as const,
    ].forEach(([type, mainNames, sideNames]) => {
        const targetStart = targetRect[mainNames.start]!;
        const targetEnd = targetRect[mainNames.end]!;
        const targetCenter = targetRect[mainNames.center]!;
        const targetStart2 = targetRect[sideNames.start]!;
        const targetEnd2 = targetRect[sideNames.end]!;

        // element : moveable
        const snapThresholdMap = {
            left: snapThresholds[0],
            top: snapThresholds[1],
        };

        function getDist(elementRect: SnapElementRect) {
            const rect = elementRect.rect;
            const snapThreshold = snapThresholdMap[mainNames.start];

            if (rect[mainNames.end]! < targetStart + snapThreshold) {
                return targetStart - rect[mainNames.end]!;
            } else if (targetEnd - snapThreshold < rect[mainNames.start]!) {
                return rect[mainNames.start]! - targetEnd;
            } else {
                return -1;
            }
        }
        const nextElementRects = elementRects.filter(elementRect => {
            const rect = elementRect.rect;

            if (rect[sideNames.start]! > targetEnd2 || rect[sideNames.end]! < targetStart2) {
                return false;
            }

            return getDist(elementRect) > 0;
        }).sort((a, b) => {
            return getDist(a) - getDist(b);
        });

        const groups: SnapElementRect[][] = [];

        nextElementRects.forEach(snapRect1 => {
            nextElementRects.forEach(snapRect2 => {
                if (snapRect1 === snapRect2) {
                    return;
                }
                const { rect: rect1 } = snapRect1;
                const { rect: rect2 } = snapRect2;

                const rect1Start = rect1[sideNames.start]!;
                const rect1End = rect1[sideNames.end]!;
                const rect2Start = rect2[sideNames.start]!;
                const rect2End = rect2[sideNames.end]!;

                if (rect1Start > rect2End || rect2Start > rect1End) {
                    return;
                }

                groups.push([snapRect1, snapRect2]);
            });
        });

        groups.forEach(([snapRect1, snapRect2]) => {
            const { rect: rect1 } = snapRect1;
            const { rect: rect2 } = snapRect2;

            const rect1Start = rect1[mainNames.start]!;
            const rect1End = rect1[mainNames.end]!;
            const rect2Start = rect2[mainNames.start]!;
            const rect2End = rect2[mainNames.end]!;
            const snapThreshold = snapThresholdMap[mainNames.start];
            let gap = 0;
            let pos = 0;
            let isStart = false;
            let isCenter = false;
            let isEnd = false;

            if (rect1End <= targetStart && targetEnd <= rect2Start) {
                // (l)element1(r) : (l)target(r) : (l)element2(r)
                isCenter = true;
                gap = ((rect2Start - rect1End) - (targetEnd - targetStart)) / 2;
                pos = rect1End + gap + (targetEnd - targetStart) / 2;

                if (abs(pos - targetCenter) > snapThreshold) {
                    return;
                }
            } else if (rect1End < rect2Start && rect2End < targetStart + snapThreshold) {
                // (l)element1(r) : (l)element2(r) : (l)target
                isStart = true;

                gap = rect2Start - rect1End;
                pos = rect2End + gap;

                if (abs(pos - targetStart) > snapThreshold) {
                    return;
                }
            } else if (rect1End < rect2Start && targetEnd - snapThreshold < rect1Start) {
                // target(r) : (l)element1(r) : (l)element2(r)

                isEnd = true;
                gap = rect2Start - rect1End;
                pos = rect1Start - gap;

                if (abs(pos - targetEnd) > snapThreshold) {
                    return;
                }
            } else {
                return;
            }
            if (!gap) {
                return;
            }
            if (!checkBetweenRects(targetRect, rect2, type, maxSnapElementGuidelineDistance)) {
                return;
            }
            if (gap > maxSnapElementGapDistance) {
                return;
            }
            gapGuidelines.push({
                type,
                pos: type === "vertical" ? [pos, 0] : [0, pos],
                element: snapRect2.element,
                size: 0,
                className: snapRect2.className,
                isStart,
                isCenter,
                isEnd,
                gap,
                hide: true,
                gapRects: [snapRect1, snapRect2],
                direction: "",
                elementDirection: "",
            });
        });
    });
    return gapGuidelines;
}
export function startGridGroupGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    clientLeft: number,
    clientTop: number,
    snapOffset: { left: number, top: number, right: number, bottom: number },
) {
    const props = moveable.props;
    const state = moveable.state;
    const {
        snapGridAll,
    } = props;
    const {
        snapGridWidth = 0,
        snapGridHeight = 0,
    } = props;
    const {
        snapRenderInfo,
    } = state;
    const hasDirection = snapRenderInfo && (snapRenderInfo.direction?.[0] || snapRenderInfo.direction?.[1]);
    const moveables = moveable.moveables;
    const ignores = [false, false];

    // snap group's all child to grid.
    if (
        snapGridAll
        && moveables
        && hasDirection
        && (snapGridWidth || snapGridHeight)
    ) {
        if (state.snapThresholdInfo) {
            return;
        }
        state.snapThresholdInfo = {
            multiples: [1, 1],
            offset: [0, 0],
        };

        const rect = moveable.getRect();
        const children = rect.children;
        const direction = snapRenderInfo.direction!;


        if (children) {
            const result = direction.map((dir, i) => {
                const {
                    snapSize,
                    posName,
                    sizeName,
                    clientOffset,
                } = i === 0 ? {
                    snapSize: snapGridWidth,
                    posName: "left",
                    sizeName: "width",
                    clientOffset: snapOffset.left - clientLeft,
                } as const : {
                    snapSize: snapGridHeight,
                    posName: "top",
                    sizeName: "height",
                    clientOffset: snapOffset.top - clientTop,
                } as const;

                if (!snapSize) {
                    return {
                        dir,
                        multiple: 1,
                        snapSize,
                        snapOffset: 0,
                    };
                }
                const rectSize = rect[sizeName];
                const rectPos = rect[posName];

                // 사이즈보다 만약 작다면 어떻게 해야되죠?
                const childSizes = flat(children.map(child => {
                    return [
                        (child[posName] - rectPos),
                        (child[sizeName]),
                        (rectSize - child[sizeName] - child[posName] + rectPos),
                    ];
                })).filter(v => v).sort((a, b) => {
                    return a - b;
                });

                const firstChildSize = childSizes[0];
                const childSnapSizes = childSizes.map(size => throttle(size / firstChildSize, 0.1) * snapSize);
                let n = 1;

                const rectRatio = throttle(rectSize / firstChildSize, 0.1);

                for (n = 1; n <= 10; ++n) {
                    if (childSnapSizes.every(childSize => {
                        return childSize * n % 1 === 0;
                    })) {
                        break;
                    }
                }

                // dir 1 (fixed -1)
                // dir 0 (fixed 0)
                // dir -1 (fixed 1)

                const ratio = (-dir + 1) / 2;
                const offsetPos = dot(
                    rectPos - clientOffset,
                    rectPos - clientOffset + rectSize,
                    ratio, 1 - ratio,
                );

                return {
                    multiple: rectRatio * n,
                    dir,
                    snapSize,
                    snapOffset: Math.round(offsetPos / snapSize),
                };
            });

            const multiples = result.map(r => r.multiple || 1);
            state.snapThresholdInfo.multiples = multiples;
            state.snapThresholdInfo.offset = result.map(r => r.snapOffset);

            result.forEach((r, i) => {
                if (r.snapSize) {
                    ignores[i] = true;
                }
            });
        }
    } else {
        state.snapThresholdInfo = null;
    }
}


export function getGridGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    containerWidth: number,
    containerHeight: number,
    clientLeft = 0,
    clientTop = 0,
    snapOffset: { left: number, top: number, right: number, bottom: number },
    isDisplayGridGuidelines?: boolean,
): SnapGuideline[] {
    const props = moveable.props;
    const state = moveable.state;
    let {
        snapGridWidth = 0,
        snapGridHeight = 0,
    } = props;
    const guidelines: SnapGuideline[] = [];
    const {
        left: snapOffsetLeft,
        top: snapOffsetTop,
    } = snapOffset;
    let startOffset = [0, 0];

    startGridGroupGuidelines(
        moveable,
        clientLeft,
        clientTop,
        snapOffset,
    );

    const snapThresholdInfo = state.snapThresholdInfo;
    const defaultSnapGridWidth = snapGridWidth;
    const defaultSnapGridHeight = snapGridHeight;

    if (snapThresholdInfo) {
        snapGridWidth *= snapThresholdInfo.multiples[0] || 1;
        snapGridHeight *= snapThresholdInfo.multiples[1] || 1;
        startOffset = snapThresholdInfo.offset;
    }

    if (snapGridHeight) {
        const pushGuideline = (pos: number) => {
            guidelines.push({
                type: "horizontal",
                pos: [
                    snapOffsetLeft,
                    throttle(startOffset[1] * defaultSnapGridHeight + pos - clientTop + snapOffsetTop, 0.1),
                ],
                className: prefix("grid-guideline"),
                size: containerWidth!,
                hide: !isDisplayGridGuidelines,
                direction: "",
                grid: true,
            });
        };
        for (let pos = 0; pos <= containerHeight * 2; pos += snapGridHeight) {
            pushGuideline(pos);
        }
        for (let pos = -snapGridHeight; pos >= -containerHeight; pos -= snapGridHeight) {
            pushGuideline(pos);
        }
    }

    if (snapGridWidth) {
        const pushGuideline = (pos: number) => {
            guidelines.push({
                type: "vertical",
                pos: [
                    throttle(startOffset[0] * defaultSnapGridWidth + pos - clientLeft + snapOffsetLeft, 0.1),
                    snapOffsetTop,
                ],
                className: prefix("grid-guideline"),
                size: containerHeight!,
                hide: !isDisplayGridGuidelines,
                direction: "",
                grid: true,
            });
        };
        for (let pos = 0; pos <= containerWidth * 2; pos += snapGridWidth) {
            pushGuideline(pos);
        }
        for (let pos = -snapGridWidth; pos >= -containerWidth; pos -= snapGridWidth) {
            pushGuideline(pos);
        }
    }

    return guidelines;
}

export function checkBetweenRects(
    rect1: SnapDirectionPoses,
    rect2: SnapDirectionPoses,
    type: "horizontal" | "vertical",
    distance: number,
) {
    if (type === "horizontal") {
        return abs(rect1.right! - rect2.left!) <= distance
            || abs(rect1.left! - rect2.right!) <= distance
            || rect1.left! <= rect2.right! && rect2.left! <= rect1.right!;
    } else if (type === "vertical") {
        return abs(rect1.bottom! - rect2.top!) <= distance
            || abs(rect1.top! - rect2.bottom!) <= distance
            || rect1.top! <= rect2.bottom! && rect2.top! <= rect1.bottom!;
    }
    return true;
}


export function getElementGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
) {
    const state = moveable.state;

    const {
        elementGuidelines = [],
    } = moveable.props;

    if (!elementGuidelines.length) {
        state.elementRects = [];
        return [];
    }

    const prevValues = (state.elementRects || []).filter(snapRect => !snapRect.refresh);
    const nextElementGuidelines = elementGuidelines.map(el => {
        if (isObject(el) && "element" in el) {
            return {
                ...el,
                element: getRefTarget(el.element, true)!,
            };
        }
        return {
            element: getRefTarget(el, true)!,
        };
    }).filter(value => {
        return value.element;
    }) as ElementGuidelineValue[];

    const {
        maintained,
        added,
    } = diff(prevValues.map(v => v.element), nextElementGuidelines.map(v => v.element));


    const nextValues: SnapElementRect[] = [];
    maintained.forEach(([prevIndex, nextIndex]) => {
        nextValues[nextIndex] = prevValues[prevIndex];
    });

    getSnapElementRects(moveable, added.map(index => nextElementGuidelines[index])).map((rect, i) => {
        nextValues[added[i]] = rect;
    });


    state.elementRects = nextValues;
    const elementSnapDirections = getSnapDirections(moveable.props.elementSnapDirections);
    const nextGuidelines: SnapGuideline[] = [];

    nextValues.forEach(snapRect => {
        const {
            element,
            top: topValue = elementSnapDirections.top,
            left: leftValue = elementSnapDirections.left,
            right: rightValue = elementSnapDirections.right,
            bottom: bottomValue = elementSnapDirections.bottom,
            center: centerValue = elementSnapDirections.center,
            middle: middleValue = elementSnapDirections.middle,
            className,
            rect,
        } = snapRect;
        const {
            horizontal,
            vertical,
            horizontalNames,
            verticalNames,
        } = splitSnapDirectionPoses({
            top: topValue,
            right: rightValue,
            left: leftValue,
            bottom: bottomValue,
            center: centerValue,
            middle: middleValue,
        }, rect);
        const rectTop = rect.top!;
        const rectLeft = rect.left!;
        const width = rect.right! - rectLeft;
        const height = rect.bottom! - rectTop;
        const sizes = [width, height];

        vertical.forEach((pos, i) => {
            nextGuidelines.push({
                type: "vertical", element, pos: [
                    throttle(pos, 0.1),
                    rectTop,
                ], size: height,
                sizes,
                className,
                elementRect: snapRect,
                elementDirection: SNAP_SKIP_NAMES_MAP[verticalNames[i]] || verticalNames[i],
                direction: "",
            });
        });
        horizontal.forEach((pos, i) => {
            nextGuidelines.push({
                type: "horizontal",
                element,
                pos: [
                    rectLeft,
                    throttle(pos, 0.1),
                ],
                size: width,
                sizes,
                className,
                elementRect: snapRect,
                elementDirection: SNAP_SKIP_NAMES_MAP[horizontalNames[i]] || horizontalNames[i],
                direction: "",
            });
        });
    });

    return nextGuidelines;
}


function getObjectGuidelines(
    guidelines: Array<PosGuideline | number | string> | false,
    containerSize: number,
): NumericPosGuideline[] {
    return guidelines ? guidelines.map(info => {
        const posGuideline = isObject(info) ? info : { pos: info };
        const pos = posGuideline.pos;

        if (isNumber(pos)) {
            return posGuideline as NumericPosGuideline;
        } else {
            return {
                ...posGuideline,
                pos: convertUnitSize(pos, containerSize),
            };
        }
    }) : [];
}

export function getDefaultGuidelines(
    horizontalGuidelines: Array<PosGuideline | number | string> | false,
    verticalGuidelines: Array<PosGuideline | number | string> | false,
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
        bottom: snapOffsetBottom,
        right: snapOffsetRight,
    } = snapOffset;
    const snapWidth = width! + snapOffsetRight - snapOffsetLeft;
    const snapHeight = height! + snapOffsetBottom - snapOffsetTop;

    getObjectGuidelines(horizontalGuidelines, snapHeight).forEach(posInfo => {
        guidelines.push({
            type: "horizontal",
            pos: [
                snapOffsetLeft,
                throttle(posInfo.pos - clientTop + snapOffsetTop, 0.1),
            ],
            size: snapWidth,
            className: posInfo.className,
            direction: "",
        });
    });
    getObjectGuidelines(verticalGuidelines, snapWidth).forEach(posInfo => {
        guidelines.push({
            type: "vertical",
            pos: [
                throttle(posInfo.pos - clientLeft + snapOffsetLeft, 0.1),
                snapOffsetTop,
            ],
            size: snapHeight,
            className: posInfo.className,
            direction: "",
        });
    });
    return guidelines;
}



export function getSnapElementRects(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    values: ElementGuidelineValue[],
): SnapElementRect[] {
    if (!values.length) {
        return [];
    }
    const groupable = moveable.props.groupable;
    const state = moveable.state;
    const {
        containerClientRect,
        // targetClientRect: {
        //     top: clientTop,
        //     left: clientLeft,
        // },
        rootMatrix,
        is3d,
        offsetDelta,
    } = state;
    const n = is3d ? 4 : 3;
    const [containerLeft, containerTop] = calculateContainerPos(rootMatrix, containerClientRect, n);
    // const poses = getAbsolutePosesByState(state);
    // const {
    //     minX: targetLeft,
    //     minY: targetTop,
    // } = getMinMaxs(poses);
    // const [distLeft, distTop] = minus([targetLeft, targetTop], calculateInversePosition(rootMatrix, [
    //     clientLeft - containerLeft,
    //     clientTop - containerTop,
    // ], n)).map(pos => roundSign(pos));

    const offsetLeft = groupable ? 0 : offsetDelta[0];
    const offsetTop = groupable ? 0 : offsetDelta[1];

    return values.map(value => {
        const rect = value.element.getBoundingClientRect();
        const left = rect.left - containerLeft - offsetLeft;
        const top = rect.top - containerTop - offsetTop;
        const bottom = top + rect.height;
        const right = left + rect.width;
        const [elementLeft, elementTop] = calculateInversePosition(rootMatrix, [left, top], n);
        const [elementRight, elementBottom] = calculateInversePosition(rootMatrix, [right, bottom], n);

        return {
            ...value,
            rect: {
                left: elementLeft,
                right: elementRight,
                top: elementTop,
                bottom: elementBottom,
                center: (elementLeft + elementRight) / 2,
                middle: (elementTop + elementBottom) / 2,
            },
        };
    });
}

