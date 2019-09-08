import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, MoveableState, MoveableProps, SnapInfo } from "../types";
import Moveable from "../index.umd";
import { OnDrag } from "@daybrush/drag";
import { prefix } from "../utils";
import { MIN_NUM, TINY_NUM } from "../consts";

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
        const snapInfos = this.checkSnaps(moveable, {
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
            dist: verticalDist,
        } = snapInfos.vertical!;

        if (verticalGuildelines.length && verticalDist < TINY_NUM) {
            return verticalGuildelines.map((guideline, i) => {
                const { pos, size } = guideline;

                return <div className={prefix("line")} key={`verticalGuidline${i}`} style={{
                    position: "absolute",
                    top: `${-targetTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    height: `${size}px`,
                }} />;
            });
        }
        return [];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, { datas }: any) {
        const {
            horizontalGuideline = [],
            verticalGuideline = [],
            elementGuildeline = [],
            container,
            snapCenter,
        } = moveable.props;
        const containerRect = (container || document.documentElement).getBoundingClientRect();
        const {
            top: containerTop,
            left: containerLeft,
            width: containerWidth,
            height: containerHeight,
        } = containerRect;

        const guideliens: Guideline[] = [];

        horizontalGuideline!.forEach(pos => {
            guideliens.push({ type: "horizontal", pos: [0, pos], size: containerWidth });
        });
        verticalGuideline!.forEach(pos => {
            guideliens.push({ type: "vertical", pos: [pos, 0], size: containerHeight });
        });
        elementGuildeline!.forEach(el => {
            const rect = el.getBoundingClientRect();
            const { top, left, width, height } = rect;

            const elementHorizontal1 = top - containerTop;
            const elementHorizontal2 = elementHorizontal1 + height;
            const elementVertical1 = left - containerLeft;
            const elementVertical2 = elementVertical1 + width;

            guideliens.push({ type: "vertical", element: el, pos: [elementVertical1, top], size: height });
            guideliens.push({ type: "vertical", element: el, pos: [elementVertical2, top], size: height });
            guideliens.push({ type: "horizontal", element: el, pos: [left, elementHorizontal1], size: width });
            guideliens.push({ type: "horizontal", element: el, pos: [left, elementHorizontal2], size: width });

            if (snapCenter) {
                guideliens.push({
                    type: "vertical",
                    element: el,
                    pos: [(elementVertical1 + elementVertical2) / 2, top],
                    size: height,
                    center: true,
                });
                guideliens.push({
                    type: "horizontal",
                    element: el,
                    pos: [left, (elementHorizontal1 + elementHorizontal2) / 2],
                    size: width,
                    center: true,
                });
            }
        });
        moveable.state.guidelines = guideliens;
        datas.isSnap = true;

        const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = moveable.state;
        const startLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const startRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
        const startTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const startBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);

        datas.startLeft = startLeft;
        datas.startRight = startRight;
        datas.startTop = startTop;
        datas.startBottom = startBottom;
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
        const snapInfos = this.checkSnaps(moveable, {
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

        if (verticalSnapInfo.guidelines.length) {
            // has vertical guidelines
            const offsetX = verticalSnapInfo.offset;

            e.clientX = clientX - offsetX;
            e.distX = distX - offsetX;
        }
        if (horizontallSnapInfo.guidelines.length) {
            // has horizontal guidelines
            const offsetY = horizontallSnapInfo.offset;

            e.clientY = clientY - offsetY;
            e.distY = distY - offsetY;
        }
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
    },
    checkSnap(
        guidelines: Guideline[],
        targetType: "horizontal" | "vertical",
        targetPoses: number[],
        isSnapCenter: boolean,
    ): SnapInfo {
        let snapGuidelines: Guideline[] = [];
        let snapDist = Infinity;
        let snapOffset = 0;
        const isVertical = targetType === "vertical";
        const posType = isVertical ? 0 : 1;

        targetPoses.forEach(targetPos => {
            guidelines.forEach(guideline => {
                const { type, pos, center } = guideline;

                if (!isSnapCenter && center || type !== targetType) {
                    return;
                }
                const offset = targetPos - pos[posType];
                const dist = Math.abs(offset);

                if (dist > 10) {
                    return;
                }
                if (snapDist > dist) {
                    snapDist = dist;
                    snapGuidelines = [];
                }
                if (snapDist === dist) {
                    snapOffset = offset;
                    snapGuidelines.push(guideline);
                }
            });
        });

        return { dist: isFinite(snapDist) ? snapDist : -1, offset: snapOffset, guidelines: snapGuidelines };
    },
    checkSnaps(
        moveable: MoveableManager<SnappableProps, SnappableState>,
        poses: { left?: number, top?: number, bottom?: number, right?: number, center?: number, middle?: number },
        isCenter: boolean,
    ) {
        const { snapCenter, snappable } = moveable.props;
        const guidelines = moveable.state.guidelines;
        const isSnapCenter = snapCenter! && isCenter;

        if (!snappable || !guidelines || !guidelines.length) {
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
            = this.checkSnap(guidelines, "vertical", verticalNames.map(name => poses[name]!), isSnapCenter);
        snapGuidelines.horizontal
            = this.checkSnap(guidelines, "horizontal", horizontalNames.map(name => poses[name]!), isSnapCenter);

        return snapGuidelines;
    },
};
