import MoveableManager from "../MoveableManager";
import { triggerEvent, fillParams } from "../utils";
import { IObject } from "@daybrush/utils";

export function triggerRenderStart(
    moveable: MoveableManager<any>,
    eventAffix: string,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.isPinch,
    });

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}Start`, params);
}
export function triggerRender(
    moveable: MoveableManager<any>,
    eventAffix: string,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.isPinch,
    });

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}`, params);
}
export function triggerRenderEnd(
    moveable: MoveableManager<any>,
    eventAffix: string,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.sPinch,
    });

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}End`, params);
}
