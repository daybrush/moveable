import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, SnapInfo } from "../types";
import { OnDrag, OnDragStart } from "@daybrush/drag";
import { prefix } from "../utils";
import { directionCondition } from "../groupUtils";

function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    isSnapCenter?: boolean,
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
            const offset = targetPos - pos[posType];
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
function checkSnaps(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    snapThreshold: number,
    poses: {
        left?: number,
        top?: number,
        bottom?: number,
        right?: number,
        center?: number,
        middle?: number,
    },
    isCenter?: boolean,
) {
    const { snapCenter } = moveable.props;
    const guidelines = moveable.state.guidelines;
    const isSnapCenter = snapCenter! && isCenter;

    if (!guidelines || !guidelines.length) {
        return false;
    }
    const snapGuidelines: {
        vertical?: SnapInfo,
        horizontal?: SnapInfo,
    } = {};

    let verticalNames: Array<"left" | "center" | "right"> = ["left", "right"];
    let horizontalNames: Array<"top" | "middle" | "bottom"> = ["top", "bottom"];

    if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
    }

    verticalNames = verticalNames.filter(name => name in poses);
    horizontalNames = horizontalNames.filter(name => name in poses);

    snapGuidelines.vertical
        = checkSnap(guidelines, "vertical", verticalNames.map(name => poses[name]!), snapThreshold, isSnapCenter);
    snapGuidelines.horizontal
        = checkSnap(guidelines, "horizontal", horizontalNames.map(name => poses[name]!), snapThreshold, isSnapCenter);

    return snapGuidelines;
}
function checkSnapPosition(
    guidelines: Guideline[],
    snapThreshold: number,
    prevPos: number,
    startPos: number,
    e: any,
    isHorizontal: boolean,
) {
    const posName = isHorizontal ? "Y" : "X";
    const {
        [`dist${posName}`] : dist,
        [`delta${posName}`] : delta,
        datas,
    } = e;
    const {
        [`prevDist${posName}`]: prevDist = 0,
    } = datas;

    if (dist || delta) {
        const rightSnapInfo = checkSnap(guidelines, isHorizontal ? "horizontal" : "vertical", [prevPos], snapThreshold);

        if (rightSnapInfo.isSnap) {
            // has  guidelines
            const isMove = prevPos - startPos !== 0;
            const offset = rightSnapInfo.offset;
            const scale = isMove ? (prevPos - offset - startPos) / (prevPos - startPos) : 0;
            const dist2 = scale * prevDist;
            const scale2 = dist2 ? dist / dist2 : dist;

            if (Math.abs(isMove ? (prevPos - startPos) * (scale2 - scale) : dist - dist2) < 10) {
                e[`dist${posName}`] = dist2;
                return true;
            }
        }
    }
    return false;
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
        const snapInfos = checkSnaps(moveable, 1, {
            left,
            right,
            top,
            bottom,
            center,
            middle,
        }, true);

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
                )} key={`horizontalTargetGuidline${i}`} style={{
                    top: `${-targetTop + pos}px`,
                    left: `${0}px`,
                    width: `${right - left}px`,
                }} />;
            }),
            ...verticalGuildelines.map((guideline, i) => {
                const { pos, size } = guideline;

                return <div className={prefix("line", "vertical", "guideline")} key={`verticalGuidline${i}`} style={{
                    top: `${-targetTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    height: `${size}px`,
                }} />;
            }),
            ...horizontalGuidelines.map((guideline, i) => {
                const { pos, size } = guideline;

                return <div className={prefix(
                    "line", "horizontal", "guideline",
                )} key={`horizontalGuidline${i}`} style={{
                    top: `${-targetTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    width: `${size}px`,
                }} />;
            }),
        ];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        this.snapStart(moveable, e);
    },
    drag(moveable: MoveableManager<SnappableProps, SnappableState>, e: OnDrag) {
        const { clientX, clientY, datas, distX, distY } = e;
        if (!datas.isSnap) {
            return false;
        }
        const left = datas.startLeft + distX;
        const right = datas.startRight + distX;
        const center = (left + right) / 2;
        const top = datas.startTop + distY;
        const bottom = datas.startBottom + distY;
        const middle = (top + bottom) / 2;
        const { snapThreshold = 5 } = moveable.props;
        const snapInfos = checkSnaps(moveable, snapThreshold, {
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
        this.snapStart(moveable, e);
    },
    dragControl(moveable: MoveableManager<SnappableProps, SnappableState>, e: OnDrag) {
        const { datas } = e;
        const { snapThreshold = 10 } = moveable.props;
        const guidelines = moveable.state.guidelines;

        if (!datas.isSnap || !guidelines || !guidelines.length) {
            return false;
        }

        const { startLeft, startTop, startRight, startBottom } = datas;
        const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = moveable.state;
        const prevLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const prevRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
        const prevTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const prevBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);

        if (!checkSnapPosition(guidelines, snapThreshold, prevLeft, startLeft, e, false)) {
            checkSnapPosition(guidelines, snapThreshold, prevRight, startRight, e, false);
        }
        if (!checkSnapPosition(guidelines, snapThreshold, prevTop, startTop, e, true)) {
            checkSnapPosition(guidelines, snapThreshold, prevBottom, startBottom, e, true);
        }

        datas.prevDistX = e.distX;
        datas.prevDistY = e.distY;
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
    },
    snapStart(moveable: MoveableManager<SnappableProps, SnappableState>, { datas }: OnDragStart) {
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
        state.guidelines = guideliens;
        datas.isSnap = true;

        const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = state;
        const startLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const startRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
        const startTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const startBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);

        datas.startLeft = startLeft;
        datas.startRight = startRight;
        datas.startTop = startTop;
        datas.startBottom = startBottom;
    },
};
