import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, MoveableState, MoveableProps } from "../types";

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const guidelines = moveable.state.guidelines || [];

        return [];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>) {
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
    },
    drag() {

    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
    },
    checkSnap(
        guidelines: Guideline[],
        targetType: "horizontal" | "vertical",
        targetPos: number,
        isSnapCenter: boolean,
    ): [number, Guideline[]] {
        let snapGuidelines: Guideline[] = [];
        let snapDist = Infinity;
        const isVertical = targetType === "vertical";
        const posType = isVertical ? 0 : 1;

        guidelines.forEach(guideline => {
            const { type, pos, center } = guideline;

            if (!isSnapCenter && center || type !== targetType) {
                return;
            }
            const dist = Math.abs(pos[posType] - targetPos);

            if (snapDist > dist) {
                snapDist = dist;
                snapGuidelines = [];
            }
            if (snapDist === dist) {
                snapGuidelines.push(guideline);
            }
        });

        return [snapDist, snapGuidelines];
    },
    checkSnaps(
        moveable: MoveableManager<SnappableProps, SnappableState>,
        { left, top, width, height }: { left: number, top: number, width: number, height: number },
        isCenter: boolean,
    ) {
        const { snapCenter, snappable } = moveable.props;
        const guidelines = moveable.state.guidelines;
        const isSnapCenter = snapCenter! && isCenter;

        if (!snappable || !guidelines || !guidelines.length) {
            return false;
        }
        const snapGuidelines: Guideline[][][] = [[], []];
        const snapDists: number[][] = [[], []];

        [0, 1].forEach(i => {
            // 0 : vertical, 1: horionztal
            const start = i ? top : left;
            const size = i ? height : width;
            const targetPoses = isSnapCenter
                ? [start, start + size / 2, start + size]
                : [start, start + size];

            targetPoses.forEach((targetPos, j) => {
                [
                    snapDists[i][j],
                    snapGuidelines[i][j],
                ] = this.checkSnap(guidelines, i ? "horizontal" : "vertical", targetPos, isSnapCenter);
            });
        });
    },
};
