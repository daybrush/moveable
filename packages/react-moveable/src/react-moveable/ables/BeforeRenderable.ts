import {
    MoveableManagerInterface, BeforeRenderableProps,
    OnBeforeRenderStart, OnBeforeRender, OnBeforeRenderEnd,
    MoveableGroupInterface, OnBeforeRenderGroupStart,
    OnBeforeRenderGroup, OnBeforeRenderGroupEnd,
} from "../types";
import { fillParams, triggerEvent } from "../utils";
import { convertMatrixtoCSS } from "@scena/matrix";
import { isArray, splitSpace } from "@daybrush/utils";
import { fillChildEvents } from "../groupUtils";

export default {
    isPinch: true,
    name: "beforeRenderable",
    props: {
    } as const,
    events: {
        onBeforeRenderStart: "beforeRenderStart",
        onBeforeRender: "beforeRender",
        onBeforeRenderEnd: "beforeRenderEnd",
        onBeforeRenderGroupStart: "beforeRenderGroupStart",
        onBeforeRenderGroup: "beforeRenderGroup",
        onBeforeRenderGroupEnd: "beforeRenderGroupEnd",
    } as const,
    setTransform(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        const {
            is3d,
            targetMatrix,
        } = moveable.state;
        const cssMatrix = is3d
            ? `matrix3d(${targetMatrix.join(",")})`
            : `matrix(${convertMatrixtoCSS(targetMatrix, true)})`;
        e.datas.startTransforms = [cssMatrix];
    },
    resetTransform(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        e.datas.nextTransforms = e.datas.startTransforms;
        e.datas.nextTransformAppendedIndexes = [];
    },
    fillDragStartParams(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return fillParams<OnBeforeRenderStart>(moveable, e, {
            setTransform: (transform: string | string[]) => {
                e.datas.startTransforms = isArray(transform) ? transform : splitSpace(transform);
            },
            isPinch: !!e.isPinch,
        });
    },
    fillDragParams(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return fillParams<OnBeforeRender>(moveable, e, {
            isPinch: !!e.isPinch,
        });
    },
    dragStart(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        this.setTransform(moveable, e);

        triggerEvent(moveable, `onBeforeRenderStart`, this.fillDragStartParams(moveable, e));
    },
    drag(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        this.resetTransform(moveable, e);

        triggerEvent(moveable, `onBeforeRender`, fillParams<OnBeforeRender>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    dragEnd(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderEnd`, fillParams<OnBeforeRenderEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
        }));
    },
    dragGroupStart(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        this.dragStart(moveable, e);

        const events = fillChildEvents(moveable, "beforeRenderable", e);
        const moveables = moveable.moveables;
        const params = events.map((childEvent, i) => {
            const childMoveable = moveables[i];

            this.setTransform(childMoveable, childEvent);
            return this.fillDragStartParams(childMoveable, childEvent);
        });
        triggerEvent(moveable, `onBeforeRenderGroupStart`, fillParams<OnBeforeRenderGroupStart>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
            setTransform() { },
            events: params,
        }));
    },
    dragGroup(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        this.drag(moveable, e);

        const events = fillChildEvents(moveable, "beforeRenderable", e);
        const moveables = moveable.moveables;
        const params = events.map((childEvent, i) => {
            const childMoveable = moveables[i];

            this.resetTransform(childMoveable, childEvent);
            return this.fillDragParams(childMoveable, childEvent);
        });

        triggerEvent(moveable, `onBeforeRenderGroup`, fillParams<OnBeforeRenderGroup>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
            events: params,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        this.dragEnd(moveable, e);

        triggerEvent(moveable, `onBeforeRenderGroupEnd`, fillParams<OnBeforeRenderGroupEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
            targets: moveable.props.targets,
        }));
    },
    dragControlStart(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.dragStart(moveable, e);
    },
    dragControl(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.drag(moveable, e);
    },
    dragControlEnd(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.dragEnd(moveable, e);
    },
    dragGroupControlStart(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroupStart(moveable, e);
    },
    dragGroupControl(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroup(moveable, e);
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroupEnd(moveable, e);
    },
} as const;
