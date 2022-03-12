import { getNextTransformText } from "../gesto/GestoUtils";
import { fillChildEvents } from "../groupUtils";
import {
    MoveableManagerInterface, RenderableProps, OnRenderStart, OnRender,
    OnRenderEnd, MoveableGroupInterface,
    OnRenderGroupStart, OnRenderGroup, OnRenderGroupEnd,
} from "../types";
import { triggerEvent, fillParams } from "../utils";

export default {
    name: "renderable",
    props: {
    } as const,
    events: {
        onRenderStart: "renderStart",
        onRender: "render",
        onRenderEnd: "renderEnd",
        onRenderGroupStart: "renderGroupStart",
        onRenderGroup: "renderGroup",
        onRenderGroupEnd: "renderGroupEnd",
    } as const,
    dragRelation: "weak",
    dragStart(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderStart`, fillParams<OnRenderStart>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    drag(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRender`, this.fillDragParams(moveable, e));
    },
    dragAfter(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        if (e.resultCount) {
            return this.drag(moveable, e);
        }
    },
    dragEnd(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderEnd`, this.fillDragEndParams(moveable, e));
    },
    dragGroupStart(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderGroupStart`, fillParams<OnRenderGroupStart>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
        }));
    },
    dragGroup(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        const events = fillChildEvents(moveable, "beforeRenderable", e);
        const moveables = moveable.moveables;
        const params = events.map((childEvent, i) => {
            const childMoveable = moveables[i];

            return this.fillDragParams(childMoveable, childEvent);
        });

        triggerEvent(moveable, `onRenderGroup`, fillParams<OnRenderGroup>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
            transform: getNextTransformText(e),
            events: params,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        const events = fillChildEvents(moveable, "beforeRenderable", e);
        const moveables = moveable.moveables;
        const params = events.map((childEvent, i) => {
            const childMoveable = moveables[i];

            return this.fillDragEndParams(childMoveable, childEvent);
        });

        triggerEvent(moveable, `onRenderGroupEnd`, fillParams<OnRenderGroupEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
            targets: moveable.props.targets,
            events: params,
        }));
    },
    dragControlStart(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.dragStart(moveable, e);
    },
    dragControl(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.drag(moveable, e);
    },
    dragControlAfter(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.dragAfter(moveable, e);
    },
    dragControlEnd(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.dragEnd(moveable, e);
    },
    dragGroupControlStart(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroupStart(moveable, e);
    },
    dragGroupControl(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroup(moveable, e);
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroupEnd(moveable, e);
    },
    fillDragParams(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return fillParams<OnRender>(moveable, e, {
            isPinch: !!e.isPinch,
            transform: getNextTransformText(e),
        });
    },
    fillDragEndParams(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return fillParams<OnRenderEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
        });
    },
} as const;
