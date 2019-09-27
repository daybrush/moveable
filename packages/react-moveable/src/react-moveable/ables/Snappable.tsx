import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, SnapInfo } from "../types";
import { OnDrag, OnDragStart } from "@daybrush/drag";
import { prefix, throttle } from "../utils";
import { directionCondition } from "../groupUtils";
import { isUndefined } from "@daybrush/utils";

function snapStart(moveable: MoveableManager<SnappableProps, SnappableState>, { datas }: OnDragStart) {
    const state = moveable.state;
    if (state.guidelines && state.guidelines.length) {
        return;
    }

    const {
        horizontalGuidelines = [],
        verticalGuidelines = [],
        elementGuildelines = [],
        container,
        snapCenter,
    } = moveable.props;

    if (!horizontalGuidelines.length && !verticalGuidelines.length && !elementGuildelines.length) {
        return;
    }

    const containerRect = (container || document.documentElement).getBoundingClientRect();
    const {
        top: containerTop,
        left: containerLeft,
        width: containerWidth,
        height: containerHeight,
    } = containerRect;

    const guideliens: Guideline[] = [];

    horizontalGuidelines!.forEach(pos => {
        guideliens.push({ type: "horizontal", pos: [0, pos], size: containerWidth });
    });
    verticalGuidelines!.forEach(pos => {
        guideliens.push({ type: "vertical", pos: [pos, 0], size: containerHeight });
    });
    elementGuildelines!.forEach(el => {
        const rect = el.getBoundingClientRect();
        const { top, left, width, height } = rect;

        const elementTop = top - containerTop;
        const elementBottom = elementTop + height;
        const elementLeft = left - containerLeft;
        const elementRight = elementLeft + width;

        guideliens.push({ type: "vertical", element: el, pos: [elementLeft, elementTop], size: height });
        guideliens.push({ type: "vertical", element: el, pos: [elementRight, elementTop], size: height });
        guideliens.push({ type: "horizontal", element: el, pos: [elementLeft, elementTop], size: width });
        guideliens.push({ type: "horizontal", element: el, pos: [elementLeft, elementBottom], size: width });

        if (snapCenter) {
            guideliens.push({
                type: "vertical",
                element: el,
                pos: [(elementLeft + elementRight) / 2, elementTop],
                size: height,
                center: true,
            });
            guideliens.push({
                type: "horizontal",
                element: el,
                pos: [elementLeft, (elementTop + elementBottom) / 2],
                size: width,
                center: true,
            });
        }
    });

    const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = state;
    const startLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
    const startRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
    const startTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
    const startBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);

    state.guidelines = guideliens;
    state.startLeft = startLeft;
    state.startRight = startRight;
    state.startTop = startTop;
    state.startBottom = startBottom;
}

function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    isSnapCenter?: boolean,
    throttleSnap: number = 0,
): SnapInfo {
    let snapGuidelines: Guideline[] = [];
    let snapDist = Infinity;
    let snapOffset = 0;
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPoses = targetPoses.filter(targetPos => {
        return guidelines.filter(guideline => {
            const { type, pos, center } = guideline;

            if ((!isSnapCenter && center) || type !== targetType) {
                return false;
            }
            const offset = throttle(targetPos, throttleSnap) - throttle(pos[posType], throttleSnap);
            const dist = Math.abs(offset);

            if (dist > snapThreshold) {
                return false;
            }
            if (snapDist > dist) {
                snapDist = dist;
                snapGuidelines = [];
            }
            if (snapDist === dist) {
                snapOffset = offset;
                snapGuidelines.push(guideline);
            }
            return true;
        }).length;
    });

    return {
        isSnap: !!snapGuidelines.length,
        dist: isFinite(snapDist) ? snapDist : -1,
        offset: snapOffset,
        guidelines: snapGuidelines,
        snapPoses,
    };
}
export function checkSnaps(
    moveable: MoveableManager<SnappableProps, SnappableState>,
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
    const {
        snapCenter,
        snapThreshold = isUndefined(customSnapThreshold) ? 5 : customSnapThreshold,
    } = moveable.props;
    const guidelines = moveable.state.guidelines;
    const isSnapCenter = snapCenter! && isCenter;

    if (!guidelines || !guidelines.length) {
        return false;
    }
    let verticalNames: Array<"left" | "center" | "right"> = ["left", "right"];
    let horizontalNames: Array<"top" | "middle" | "bottom"> = ["top", "bottom"];

    if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
    }
    verticalNames = verticalNames.filter(name => name in rect);
    horizontalNames = horizontalNames.filter(name => name in rect);

    return {
        vertical:
            checkSnap(guidelines, "vertical", verticalNames.map(name => rect[name]!), snapThreshold, isSnapCenter),
        horizontal:
            checkSnap(guidelines, "horizontal", horizontalNames.map(name => rect[name]!), snapThreshold, isSnapCenter),
    };
}

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = moveable.state;

        const left = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const right = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
        const top = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const bottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);
        const center = (left + right) / 2;
        const middle = (top + bottom) / 2;
        const snapInfos = checkSnaps(moveable, {
            left,
            right,
            top,
            bottom,
            center,
            middle,
        }, true, 1);

        if (!snapInfos) {
            return [];
        }
        const {
            guidelines: verticalGuildelines,
            snapPoses: verticalSnapPoses,
        } = snapInfos.vertical!;
        const {
            guidelines: horizontalGuidelines,
            snapPoses: horizontalSnapPoses,
        } = snapInfos.horizontal!;

        return [
            ...verticalSnapPoses.map((pos, i) => {
                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    "target",
                    "bold",
                )} key={`verticalTargetGuidline${i}`} style={{
                    top: `${0}px`,
                    left: `${-targetLeft + pos}px`,
                    height: `${bottom - top}px`,
                }} />;
            }),
            ...horizontalSnapPoses.map((pos, i) => {
                return <div className={prefix(
                    "line",
                    "horizontal",
                    "guideline",
                    "target",
                    "bold",
                )} key={`horizontalTargetGuidline${i}`} style={{
                    top: `${-targetTop + pos}px`,
                    left: `${0}px`,
                    width: `${right - left}px`,
                }} />;
            }),
            ...verticalGuildelines.map((guideline, i) => {
                const { pos, size, element } = guideline;

                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    element ? "bold" : "",
                )} key={`verticalGuidline${i}`} style={{
                    top: `${-targetTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    height: `${size}px`,
                }} />;
            }),
            ...horizontalGuidelines.map((guideline, i) => {
                const { pos, size, element } = guideline;

                return <div className={prefix(
                    "line",
                    "horizontal",
                    "guideline",
                    element ? "bold" : "",
                )} key={`horizontalGuidline${i}`} style={{
                    top: `${-targetTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    width: `${size}px`,
                }} />;
            }),
        ];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        snapStart(moveable, e);
    },
    drag(moveable: MoveableManager<SnappableProps, SnappableState>, e: OnDrag) {
        const { clientX, clientY, distX, distY } = e;
        const {
            guidelines,
            startLeft,
            startTop,
            startBottom,
            startRight,
        } = moveable.state;

        if (!guidelines || !guidelines.length) {
            return false;
        }
        const left = startLeft + distX;
        const right = startRight + distX;
        const center = (left + right) / 2;
        const top = startTop + distY;
        const bottom = startBottom + distY;
        const middle = (top + bottom) / 2;

        const snapInfos = checkSnaps(moveable, {
            left,
            right,
            top,
            bottom,
            center,
            middle,
        }, true);

        if (!snapInfos) {
            return;
        }
        const verticalSnapInfo = snapInfos.vertical!;
        const horizontallSnapInfo = snapInfos.horizontal!;

        if (verticalSnapInfo.isSnap) {
            // has vertical guidelines
            const offsetX = verticalSnapInfo.offset;

            e.clientX = clientX - offsetX;
            e.distX = distX - offsetX;
        }
        if (horizontallSnapInfo.isSnap) {
            // has horizontal guidelines
            const offsetY = horizontallSnapInfo.offset;

            e.clientY = clientY - offsetY;
            e.distY = distY - offsetY;
        }
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
    },
    dragControlCondition: directionCondition,
    dragControlStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        snapStart(moveable, e);
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.dragEnd(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        snapStart(moveable, e);
    },
    dragGroup(moveable: any, e: any) {
        this.drag(moveable, e);
    },
    dragGroupEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    dragGroupControlStart(moveable: any, e: any) {
        snapStart(moveable, e);
    },
    dragGroupControlEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    unset(moveable: any) {
        this.dragEnd(moveable);
    },
};
