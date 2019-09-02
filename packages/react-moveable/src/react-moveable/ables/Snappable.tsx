import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, prefix } from "../utils";
import { minus, sum } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag, OnDragGroup, OnDragGroupStart, Renderer, SnappableProps } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { hasClass } from "@daybrush/utils";

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps>, React: Renderer): any[] {
        return [];
    },
};
