import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState } from "../types";

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const guidelines = moveable.state.guidelines || [];

        return [];
    },
    dragStart(moveable: MoveableManager<SnappableProps>) {
        const { horizontalGuideline, verticalGuideline, elementGuildeline, container } = moveable.props;
        const containerRect = (container || document.documentElement).getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = containerRect;

        elementGuildeline!.forEach(el => {
            const rect = el.getBoundingClientRect();

            const elementVertical1 = rect.top - containerTop;
            const elementVertical2 = elementVertical1 + rect.height;
            const elementHorizontal1 = rect.left - containerLeft;
            const elementHorizontal2 = elementHorizontal1 + rect.width;
        });
    },
    drag() {

    },
    dragEnd() {

    },
};
