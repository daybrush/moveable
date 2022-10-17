import {
    MoveableManagerInterface, BeforeRenderableProps,
    OnBeforeRenderStart, OnBeforeRender, OnBeforeRenderEnd,
    MoveableGroupInterface, OnBeforeRenderGroupStart,
    OnBeforeRenderGroup, OnBeforeRenderGroupEnd,
} from "../types";
import { fillParams, triggerEvent } from "../utils";
import { convertMatrixtoCSS, createIdentityMatrix } from "@scena/matrix";
import { isArray, splitSpace } from "@daybrush/utils";
import { fillChildEvents } from "../groupUtils";


function isIdentityMatrix(matrix: string, is3d?: boolean) {
    const n = is3d ? 4 : 3;
    const identityMatrix = createIdentityMatrix(n);
    const value = `matrix${is3d ? "3d" : ""}(${identityMatrix.join(",")})`;

    return matrix === value || matrix === `matrix(1,0,0,1,0,0)`;
}
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
    dragRelation: "weak",
    setTransform(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        const {
            is3d,
            target,
            targetMatrix,
        } = moveable.state;
        const transform = target?.style.transform;
        const cssMatrix = is3d
            ? `matrix3d(${targetMatrix.join(",")})`
            : `matrix(${convertMatrixtoCSS(targetMatrix, true)})`;
        const startTransform = !transform || transform === "none" ? cssMatrix : transform;

        e.datas.startTransforms = isIdentityMatrix(startTransform, is3d) ? [] : splitSpace(startTransform);
    },
    resetStyle(e: any) {
        const datas = e.datas;

        datas.nextStyle = {};
        datas.nextTransforms = e.datas.startTransforms;
        datas.nextTransformAppendedIndexes = [];
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
        this.resetStyle(e);

        triggerEvent(moveable, `onBeforeRenderStart`, this.fillDragStartParams(moveable, e));
    },
    drag(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        this.resetStyle(e);
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
            this.resetStyle(childEvent);

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

            this.resetStyle(childEvent);
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
