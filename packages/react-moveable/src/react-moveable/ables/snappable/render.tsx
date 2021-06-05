import {
    RenderGuidelineInfo, Renderer, RenderGuidelineInnerInfo,
    MoveableManagerInterface, SnappableProps, SnapGuideline,
    SnappableOptions, SnappableRenderType, GapGuideline, SnappableState,
} from "../../types";
import { prefix, flat } from "../../utils";

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
        pos: info.pos || info.posValue.map(v => `${v}px`),
    }, React);
}

export function renderElementGroup(
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
    targetSizes: number[],
) {
    const { isDisplayInnerSnapDigit } = moveable.props;
    const innerGuidelines: SnapGuideline[] = [];
    const gapGuidelines: GapGuideline[] = [];
    const nextGuidelines =  guidelines.filter(guideline => {
        const { element, pos, size } = guideline;

        if (
            isDisplayInnerSnapDigit && element
            && pos[index] < targetPos[index] && targetPos[index] + targetSizes[index] < pos[index] + size
        ) {
            innerGuidelines.push(guideline);

            const startPos = pos[index] - targetPos[index];
            const endPos = targetSizes[index];
            const contentPos = index ? pos[0] - targetPos[0] : pos[1] - targetPos[1];

            gapGuidelines.push({
                ...guideline,
                inner: true,
                gap: startPos,
                renderPos: index ? [contentPos, startPos] : [startPos, contentPos],
            });
            gapGuidelines.push({
                ...guideline,
                inner: true,
                gap: pos[index] + size - targetPos[index] - targetSizes[index],
                renderPos: index ? [contentPos, endPos] : [endPos, contentPos],
            });
            return false;
        }
        return true;
    });

    return {
        guidelines: nextGuidelines,
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
                        classNames: [prefix(inner ? "bold" : "gap"), className],
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
