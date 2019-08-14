import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent } from "../utils";
import { minus } from "../matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, GroupableProps } from "../types";
import MoveableGroup from "../MoveableGroup";
import Draggable from "./Draggable";
import Moveable from "..";
import { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";
import { triggerChildAble } from "../groupUtils";

export default {
    name: "draggable",
    dragStart(
        moveable: MoveableGroup,
        e: OnDragStart,
    ) {
        triggerChildAble(moveable, Draggable, "dragStart", e);

        const { clientX, clientY } = e;

        triggerEvent(moveable, "onGroupDragStart", {
            targets: moveable.props.targets,
            clientX,
            clientY,
        });
    },
    drag(
        moveable: MoveableGroup,
        e: OnDrag,
    ) {

        const events = triggerChildAble(moveable, Draggable, "drag", e);
        const params = Draggable.drag(moveable, e);

        if (!params) {
            return;
        }
        const nextParams = {
            targets: moveable.props.targets,
            events,
            ...params,
        };

        triggerEvent(moveable, "onGroupDrag", nextParams);
        return params;
    },
    dragEnd(moveable: MoveableGroup, e: OnDragEnd) {
        const { clientX, clientY, isDrag } = e;

        triggerChildAble(moveable, Draggable, "dragEnd", e);
        triggerEvent(moveable, "onGroupDragEnd", {
            targets: moveable.props.targets,
            isDrag,
            clientX,
            clientY,
        });

        return isDrag;
    },
};
