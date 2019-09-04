import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState } from "../types";

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const guidelines = moveable.state.guidelines || [];

        return [];
    },
    dragStart(moveable: MoveableManager<SnappableProps>) {
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

        const guideliens: any[] = [];

        horizontalGuideline!.forEach(pos => {
            guideliens.push({ type: "horizontal", element: null,  pos: [0, pos], size: containerWidth });
        });
        verticalGuideline!.forEach(pos => {
            guideliens.push({ type: "vertical", element: null,  pos: [pos, 0], size: containerHeight });
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
                });
                guideliens.push({
                    type: "horizontal",
                    element: el,
                    pos: [left, (elementHorizontal1 + elementHorizontal2) / 2],
                    size: width,
                });
            }
        });
    },
    drag() {

    },
    dragEnd() {

    },
};
