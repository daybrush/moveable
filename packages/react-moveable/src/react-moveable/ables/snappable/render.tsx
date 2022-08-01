import { throttle } from "@daybrush/utils";
import {
    RenderGuidelineInfo, Renderer, RenderGuidelineInnerInfo,
    MoveableManagerInterface, SnappableProps, SnapGuideline,
    SnappableRenderType, SnappableState,
    SnapDirectionPoses,
} from "../../types";
import { prefix, groupBy } from "../../utils";
import { HORIZONTAL_NAMES_MAP, VERTICAL_NAMES_MAP } from "./utils";

export function renderGuideline(info: RenderGuidelineInfo, React: Renderer): any {
    const { direction, classNames, size, pos, zoom, key } = info;
    const isHorizontal = direction === "horizontal";
    const scaleType = isHorizontal ? "Y" : "X";
    // const scaleType2 = isHorizontal ? "Y" : "X";

    return React.createElement("div", {
        key,
        className: classNames.join(" "),
        style: {
            [isHorizontal ? "width" : "height"]: `${size}`,
            transform: `translate(${pos[0]}, ${pos[1]}) translate${scaleType}(-50%) scale${scaleType}(${zoom})`,
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
export function renderGuidelines(
    moveable: MoveableManagerInterface<SnappableProps>,
    type: "vertical" | "horizontal",
    guidelines: SnapGuideline[],
    targetPos: number[],
    targetRect: SnapDirectionPoses,
    React: Renderer
): any[] {
    const { zoom, isDisplayInnerSnapDigit } = moveable.props;

    const mainNames = type === "horizontal" ? VERTICAL_NAMES_MAP : HORIZONTAL_NAMES_MAP;
    const targetStart = targetRect[mainNames.start]!;
    const targetEnd = targetRect[mainNames.end]!;
    return guidelines.filter(({ hide, elementRect }) => {
        if (hide) {
            return false;
        }
        if (isDisplayInnerSnapDigit && elementRect) {
            // inner
            const rect = elementRect.rect;

            if (rect[mainNames.start]! <= targetStart && targetEnd <= rect[mainNames.end]!) {
                return false;
            }
        }
        return true;
    }).map((guideline, i) => {
        const { pos, size, element, className } = guideline;

        const renderPos = [
            -targetPos[0] + pos[0],
            -targetPos[1] + pos[1],
        ];

        return renderInnerGuideline(
            {
                key: `${type}-default-guideline-${i}`,
                classNames: element ? [prefix("bold"), className] : [prefix("normal"), className],
                direction: type,
                posValue: renderPos,
                sizeValue: size,
                zoom: zoom!,
            },
            React
        );
    });
}

export function renderDigitLine(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    type: "vertical" | "horizontal",
    lineType: "dashed" | "gap",
    index: number,
    gap: number,
    renderPos: number[],
    className: string | undefined,
    React: Renderer,
): any {
    const {
        snapDigit = 0,
        isDisplaySnapDigit = true,
        snapDistFormat = (v: number, type: "vertical" | "horizontal") => {
            // Type can be used render different values.
            if (type === 'vertical') {
                return v;
            }
            return v;
        },
        zoom,
    } = moveable.props;
    const scaleType = type === "horizontal" ? "X" : "Y";
    const sizeName = type === "vertical" ? "height" : "width";
    const absGap = Math.abs(gap!);
    const snapSize = isDisplaySnapDigit
        ? parseFloat(absGap.toFixed(snapDigit))
        : 0;
    return <div
        key={`${type}-${lineType}-guideline-${index}`}
        className={prefix("guideline-group", type)}
        style={{
            left: `${renderPos[0]}px`,
            top: `${renderPos[1]}px`,
            [sizeName]: `${absGap}px`,
        }}
    >
        {renderInnerGuideline(
            {
                direction: type,
                classNames: [prefix(lineType), className],
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
                transform: `translate${scaleType}(-50%) scale(${zoom})`,
            }}
        >
            {snapSize > 0 ? snapDistFormat(snapSize, type) : ""}
        </div>
    </div>;
}

export function groupByElementGuidelines(
    type: "vertical" | "horizontal",
    guidelines: SnapGuideline[],
    targetRect: SnapDirectionPoses,
    isDisplayInnerSnapDigit: boolean,
) {
    const index = type === "vertical" ? 0 : 1;
    const otherIndex = type === "vertical" ? 1 : 0;
    const names = index ? VERTICAL_NAMES_MAP : HORIZONTAL_NAMES_MAP;
    const targetStart = targetRect[names.start]!;
    const targetEnd = targetRect[names.end]!;
    return groupBy(guidelines, (guideline) => {
        return guideline.pos[index];
    }).map(nextGuidelines => {
        const start: SnapGuideline[] = [];
        const end: SnapGuideline[] = [];
        const inner: SnapGuideline[] = [];

        nextGuidelines.forEach(guideline => {
            const element = guideline.element!;
            const rect = guideline.elementRect!.rect;
            if (rect[names.end]! < targetStart) {
                start.push(guideline);
            } else if (targetEnd < rect[names.start]!) {
                end.push(guideline);
            } else if (rect[names.start]! <= targetStart && targetEnd <= rect[names.end]! && isDisplayInnerSnapDigit) {
                const pos = guideline.pos;
                const elementRect1 = { element, rect: { ...rect, [names.end]: rect[names.start]! } };
                const elementRect2 = { element, rect: { ...rect, [names.start]: rect[names.end]! } };
                const nextPos1 = [0, 0];
                const nextPos2 = [0, 0];
                nextPos1[index] = pos[index];
                nextPos1[otherIndex] = pos[otherIndex];

                nextPos2[index] = pos[index];
                nextPos2[otherIndex] = pos[otherIndex] + guideline.size;


                start.push({
                    type,
                    pos: nextPos1,
                    size: 0,
                    elementRect: elementRect1,
                });
                end.push({
                    type,
                    pos: nextPos2,
                    size: 0,
                    elementRect: elementRect2,
                });
                // inner.push(guideline);
            }
        });

        start.sort((a, b) => {
            return b.pos[otherIndex] - a.pos[otherIndex];
        });
        end.sort((a, b) => {
            return a.pos[otherIndex] - b.pos[otherIndex];
        });
        return {
            total: nextGuidelines,
            start,
            end,
            inner,
        };
    });
}
export function renderDashedGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    guidelines: SnapGuideline[],
    targetPos: number[],
    targetRect: SnapDirectionPoses,
    React: Renderer,
): any[] {
    const {
        isDisplayInnerSnapDigit,
    } = moveable.props;
    const rendered: any[] = [];

    (["vertical", "horizontal"] as const).forEach(type => {
        const nextGuidelines = guidelines.filter(guideline => guideline.type === type);
        const index = type === "vertical" ? 1 : 0;
        const otherIndex = index ? 0 : 1;

        const groups = groupByElementGuidelines(type, nextGuidelines, targetRect, isDisplayInnerSnapDigit!);
        const mainNames = index ? HORIZONTAL_NAMES_MAP : VERTICAL_NAMES_MAP;
        const sideNames = index ? VERTICAL_NAMES_MAP : HORIZONTAL_NAMES_MAP;
        const targetStart = targetRect[mainNames.start]!;
        const targetEnd = targetRect[mainNames.end]!;

        groups.forEach(({ total, start, end, inner }) => {
            const sidePos = targetPos[otherIndex] + total[0].pos[otherIndex] - targetRect[sideNames.start]!;

            let prevRect = targetRect;

            start.forEach(guideline => {
                const nextRect = guideline.elementRect!.rect;
                const size = prevRect[mainNames.start]! - nextRect[mainNames.end]!;

                if (size > 0) {
                    const renderPos = [0, 0];

                    renderPos[index] = targetPos[index] + prevRect[mainNames.start]! - targetStart - size;
                    renderPos[otherIndex] = sidePos;

                    rendered.push(renderDigitLine(
                        moveable,
                        type,
                        "dashed",
                        rendered.length,
                        size,
                        renderPos,
                        guideline.className,
                        React
                    ));
                }
                prevRect = nextRect;
            });

            prevRect = targetRect;
            end.forEach(guideline => {
                const nextRect = guideline.elementRect!.rect;
                const size = nextRect[mainNames.start]! - prevRect[mainNames.end]!;

                if (size > 0) {
                    const renderPos = [0, 0];

                    renderPos[index] = targetPos[index] + prevRect[mainNames.end]! - targetStart;
                    renderPos[otherIndex] = sidePos;

                    rendered.push(renderDigitLine(
                        moveable,
                        type,
                        "dashed",
                        rendered.length,
                        size,
                        renderPos,
                        guideline.className,
                        React
                    ));
                }
                prevRect = nextRect;
            });

            inner.forEach(guideline => {
                const nextRect = guideline.elementRect!.rect;

                const size1 = targetStart - nextRect[mainNames.start]!;
                const size2 = nextRect[mainNames.end]! - targetEnd;
                const renderPos1 = [0, 0];
                const renderPos2 = [0, 0];

                renderPos1[index] = targetPos[index] - size1;
                renderPos1[otherIndex] = sidePos;

                renderPos2[index] = targetPos[index] + targetEnd - targetStart;
                renderPos2[otherIndex] = sidePos;

                rendered.push(renderDigitLine(
                    moveable,
                    type,
                    "dashed",
                    rendered.length,
                    size1,
                    renderPos1,
                    guideline.className,
                    React
                ));
                rendered.push(renderDigitLine(
                    moveable,
                    type,
                    "dashed",
                    rendered.length,
                    size2,
                    renderPos2,
                    guideline.className,
                    React
                ));
            });
        });
    });
    return rendered;
}
export function renderGapGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    guidelines: SnapGuideline[],
    targetPos: number[],
    targetRect: SnapDirectionPoses,
    React: any
): any[] {
    const rendered: any[] = [];
    (["horizontal", "vertical"] as const).forEach(type => {
        const nextGuidelines = guidelines.filter(guideline => guideline.type === type);
        const index = type === "vertical" ? 0 : 1;
        const otherIndex = index ? 0 : 1;
        const mainNames = index ? HORIZONTAL_NAMES_MAP : VERTICAL_NAMES_MAP;
        const sideNames = index ? VERTICAL_NAMES_MAP : HORIZONTAL_NAMES_MAP;
        const targetStart = targetRect[mainNames.start]!;
        const targetEnd = targetRect[mainNames.end]!;
        const targetSideStart = targetRect[sideNames.start]!;
        const targetSideEnd = targetRect[sideNames.end]!;


        nextGuidelines.forEach(({ gap, gapRects }) => {
            const sideStartPos = Math.max(
                targetSideStart,
                ...gapRects!.map(({ rect }) => rect[sideNames.start]!),
            );
            const sideEndPos = Math.min(
                targetSideEnd,
                ...gapRects!.map(({ rect }) => rect[sideNames.end]!),
            );
            const sideCenterPos = (sideStartPos + sideEndPos) / 2;

            if (sideStartPos === sideEndPos || sideCenterPos === (targetSideStart + targetSideEnd)/ 2) {
                return;
            }
            gapRects!.forEach(({ rect, className }) => {
                const renderPos = [targetPos[0], targetPos[1]];

                if (rect[mainNames.end]! < targetStart) {
                    renderPos[index] += rect[mainNames.end]! - targetStart;
                } else if (targetEnd < rect[mainNames.start]!) {
                    renderPos[index] += rect[mainNames.start]! - targetStart - gap!;
                } else {
                    return;
                }

                renderPos[otherIndex] += sideCenterPos - targetSideStart;
                rendered.push(renderDigitLine(
                    moveable,
                    index ? "vertical" : "horizontal",
                    "gap",
                    rendered.length,
                    gap!,
                    renderPos,
                    className,
                    React
                ));
            });
        });
    });
    return rendered;
}
