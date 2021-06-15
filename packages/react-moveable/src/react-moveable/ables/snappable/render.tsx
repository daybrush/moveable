import { find } from "@daybrush/utils";
import {
    RenderGuidelineInfo, Renderer, RenderGuidelineInnerInfo,
    MoveableManagerInterface, SnappableProps, SnapGuideline,
    SnappableOptions, SnappableRenderType, GapGuideline, SnappableState,
} from "../../types";
import { prefix, flat, throttle, groupBy } from "../../utils";

const DIRECTION_NAMES = {
    horizontal: [
        "left",
        "top",
        "width",
        "Y",
        "X",
    ] as const,
    vertical: [
        "top", "left", "height", "X", "Y",
    ] as const,
} as const;

export function groupByElementGuidelines(
    guidelines: SnapGuideline[],
    clientPos: number,
    size: number,
    index: number
) {
    const groupInfos: Array<[Element, number, any]> = [];

    const group = groupBy(
        guidelines.filter(({ element, gap }) => element && !gap),
        ({ element, pos }) => {
            const elementPos = pos[index];
            const sign = Math.min(0, elementPos - clientPos) < 0 ? -1 : 1;
            const groupKey = `${sign}_${pos[index ? 0 : 1]}`;
            const groupInfo = find(groupInfos, ([groupElement, groupPos]) => {
                return element === groupElement && elementPos === groupPos;
            });
            if (groupInfo) {
                return groupInfo[2];
            }
            groupInfos.push([element!, elementPos, groupKey]);
            return groupKey;
        }
    );
    group.forEach((elementGuidelines) => {
        elementGuidelines.sort((a, b) => {
            const result =
                getElementGuidelineDist(a.pos[index], a.size, clientPos, size)
                    .size -
                getElementGuidelineDist(b.pos[index], a.size, clientPos, size)
                    .size;

            return result || a.pos[index ? 0 : 1] - b.pos[index ? 0 : 1];
        });
    });
    return group;
}
export function getElementGuidelineDist(
    elementPos: number,
    elementSize: number,
    targetPos: number,
    targetSize: number
) {
    // relativePos < 0  => element(l)  ---  (r)target
    // relativePos > 0  => target(l)   ---  (r)element
    const relativePos = elementPos - targetPos;
    const startPos = relativePos < 0 ? relativePos + elementSize : targetSize;
    const endPos = relativePos < 0 ? 0 : relativePos;
    const size = endPos - startPos;

    return {
        size,
        pos: startPos,
    };
}

export function renderGuideline(info: RenderGuidelineInfo, React: Renderer): any {
    const { direction, classNames, size, pos, zoom, key } = info;
    const isHorizontal = direction === "horizontal";
    const scaleDirection = isHorizontal ? "Y" : "X";
    // const scaleDirection2 = isHorizontal ? "Y" : "X";

    return React.createElement("div", {
        key,
        className: classNames.join(" "),
        style: {
            [isHorizontal ? "width" : "height"]: `${size}`,
            transform: `translate(${pos[0]}, ${pos[1]}) translate${scaleDirection}(-50%) scale${scaleDirection}(${zoom})`,
        },
    });
}

export function renderInnerGuideline(info: RenderGuidelineInnerInfo, React: Renderer): any {
    return renderGuideline({
        ...info,
        classNames: [
            prefix("line", "guideline", info.direction),
            ...info.classNames,
        ].filter(className => className) as string[],
        size: info.size || `${info.sizeValue}px`,
        pos: info.pos || info.posValue.map(v => `${throttle(v, 0.1)}px`),
    }, React);
}

export function renderElementGroups(
    moveable: MoveableManagerInterface<SnappableProps>,
    direction: "vertical" | "horizontal",
    groups: SnapGuideline[][],
    minPos: number,
    clientPos: number,
    clientSize: number,
    targetPos: number,
    snapThreshold: number,
    snapDigit: number,
    index: number,
    snapDistFormat: Required<SnappableOptions>["snapDistFormat"],
    React: Renderer
) {
    const { zoom, isDisplaySnapDigit = true } = moveable.props;
    const [posName1, posName2, sizeName, , scaleDirection] = DIRECTION_NAMES[direction];
    return flat(
        groups.map((elementGuidelines, i) => {
            let isFirstRenderSize = true;

            return elementGuidelines.map(({ pos, size }, j) => {
                const {
                    pos: linePos,
                    size: lineSize,
                } = getElementGuidelineDist(
                    pos[index],
                    size,
                    clientPos,
                    clientSize
                );

                if (lineSize < snapThreshold) {
                    return null;
                }
                const isRenderSize = isFirstRenderSize;

                isFirstRenderSize = false;
                const snapSize =
                    isDisplaySnapDigit && isRenderSize
                        ? parseFloat(lineSize.toFixed(snapDigit))
                        : 0;
                return (
                    <div
                        key={`${direction}LinkGuideline${i}-${j}`}
                        className={prefix("guideline-group", direction)}
                        style={{
                            [posName1]: `${minPos + linePos}px`,
                            [posName2]: `${-targetPos + pos[index ? 0 : 1]}px`,
                            [sizeName]: `${lineSize}px`,
                        }}
                    >
                        {renderInnerGuideline(
                            {
                                direction: direction,
                                classNames: [prefix("dashed")],
                                size: "100%",
                                posValue: [0, 0],
                                sizeValue: lineSize,
                                zoom: zoom!,
                            },
                            React
                        )}
                        <div
                            className={prefix("size-value")}
                            style={{
                                transform: `translate${scaleDirection}(-50%) scale(${zoom})`,
                            }}
                        >
                            {snapSize > 0 ? snapDistFormat(snapSize) : ""}
                        </div>
                    </div>
                );
            });
        })
    );
}
export function renderSnapPoses(
    moveable: MoveableManagerInterface,
    direction: string,
    snapPoses: SnappableRenderType[],
    minPos: number,
    targetPos: number,
    size: number,
    index: number,
    React: Renderer
) {
    const { zoom } = moveable.props;
    return snapPoses.map(({ type, pos }, i) => {
        const renderPos = [0, 0];

        renderPos[index] = minPos;
        renderPos[index ? 0 : 1] = -targetPos + pos;

        return renderInnerGuideline(
            {
                key: `${direction}TargetGuideline${i}`,
                classNames: [prefix("target", "bold", type)],
                posValue: renderPos,
                sizeValue: size,
                zoom: zoom!,
                direction: direction,
            },
            React
        );
    });
}
export function filterElementInnerGuidelines(
    moveable: MoveableManagerInterface<SnappableProps>,
    guidelines: SnapGuideline[],
    index: number,
    targetPos: number[],
    clientPos: number[],
    targetSizes: number[],
) {
    const { isDisplayInnerSnapDigit } = moveable.props;
    const innerGuidelines: SnapGuideline[] = [];
    const otherIndex = index ? 0 : 1;
    const targetContentPos = targetPos[index];
    const targetContentSize = targetSizes[index];
    let gapGuidelines: GapGuideline[] = [];
    let nextGuidelines = guidelines.filter(guideline => {
        const { element, pos, size } = guideline;

        if (
            isDisplayInnerSnapDigit && element
            && pos[index] < targetContentPos && targetContentPos + targetContentSize < pos[index] + size
        ) {
            innerGuidelines.push(guideline);

            const contentPos = pos[index] - targetContentPos;
            const inlinePos = pos[otherIndex] - targetPos[otherIndex];

            gapGuidelines.push({
                ...guideline,
                inner: true,
                gap: contentPos,
                renderPos: index ? [inlinePos, contentPos] : [contentPos, inlinePos],
            });
            gapGuidelines.push({
                ...guideline,
                inner: true,
                gap: pos[index] + size - targetContentPos - targetContentSize,
                renderPos: index ? [inlinePos, targetContentSize] : [targetContentSize, inlinePos],
            });
            return false;
        }
        return true;
    });

    nextGuidelines = nextGuidelines.filter(guideline1 => {
        const {
            element: element1,
            pos: pos1,
            size: size1,
        } = guideline1;
        const contentPos1 = pos1[index];

        if (!element1) {
            return true;
        }
        return nextGuidelines.every(guideline2 => {
            const {
                element: element2,
                pos: pos2,
                size: size2,
            } = guideline2;
            const contentPos2 = pos2[index];
            if (!element2 || guideline1 === guideline2) {
                return true;
            }
            return contentPos1 + size1 <= contentPos2
                || contentPos2 + size2 <= contentPos1
                || (contentPos1 < contentPos2 && contentPos2 + size2 < contentPos1 + size1);
        });
    });
    const groups = groupByElementGuidelines(
        nextGuidelines,
        clientPos[index],
        targetContentSize,
        index,
    );
    gapGuidelines = gapGuidelines.filter(guideline => {
        const gap = guideline.gap!;
        const inlinePos = guideline.pos[otherIndex];

        return groups.every(group => {
            return group.every(groupGuideline => {
                const groupPos = groupGuideline.pos;
                const renderPos = -targetContentPos + groupPos[index];

                if (groupPos[otherIndex] !== inlinePos) {
                    return true;
                }
                if (gap < 0 && renderPos < 0) {
                    return false;
                }
                if (gap > 0 && renderPos > targetSizes[index]) {
                    return false;
                }
                return true;
            });
        });
    });

    return {
        guidelines: nextGuidelines,
        groups,
        gapGuidelines,
    };
}
export function renderGuidelines(
    moveable: MoveableManagerInterface<SnappableProps>,
    direction: string,
    guidelines: SnapGuideline[],
    targetPos: number[],
    React: Renderer
) {
    const { zoom } = moveable.props;

    return guidelines.filter(({ hide }) => {
        return !hide;
    }).map((guideline, i) => {
        const { pos, size, element } = guideline;

        const renderPos = [
            -targetPos[0] + pos[0],
            -targetPos[1] + pos[1],
        ];

        return renderInnerGuideline(
            {
                key: `${direction}Guideline${i}`,
                classNames: element ? [prefix("bold")] : [],
                direction: direction,
                posValue: renderPos,
                sizeValue: size,
                zoom: zoom!,
            },
            React
        );
    });
}

export function renderGapGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    direction: "vertical" | "horizontal",
    gapGuidelines: GapGuideline[],
    snapDistFormat: Required<SnappableOptions>["snapDistFormat"],
    React: any
): any[] {
    const { snapDigit = 0, isDisplaySnapDigit = true, zoom } = moveable.props;
    const scaleDirection = direction === "horizontal" ? "X" : "Y";
    const sizeName = direction === "horizontal" ? "width" : "height";

    return gapGuidelines.map(({ renderPos, gap, className, inner }, i) => {
        const absGap = Math.abs(gap!);
        const snapSize = isDisplaySnapDigit
            ? parseFloat(absGap.toFixed(snapDigit))
            : 0;
        return (
            <div
                key={`${direction}GapGuideline${i}`}
                className={prefix("guideline-group", direction)}
                style={{
                    left: `${renderPos[0]}px`,
                    top: `${renderPos[1]}px`,
                    [sizeName]: `${absGap}px`,
                }}
            >
                {renderInnerGuideline(
                    {
                        direction: direction,
                        classNames: [prefix(inner ? "dashed" : "gap"), className],
                        size: "100%",
                        posValue: [0, 0],
                        sizeValue: absGap,
                        zoom: zoom!,
                    },
                    React
                )}
                <div
                    className={prefix("size-value", "gap")}
                    style={{
                        transform: `translate${scaleDirection}(-50%) scale(${zoom})`,
                    }}
                >
                    {snapSize > 0 ? snapDistFormat(snapSize) : ""}
                </div>
            </div>
        );
    });
}
