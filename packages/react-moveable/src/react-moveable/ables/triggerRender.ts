import MoveableManager from "../MoveableManager";
import { triggerEvent } from "../utils";
import { IObject } from "@daybrush/utils";

export function triggerRenderStart(
    moveable: MoveableManager<any>,
    eventAffix: string,
    { clientX, clientY, datas, isPinch }: any,
) {
    const params: IObject<any> = {
        clientX,
        clientY,
        datas,
        target: moveable.state.target!,
        isPinch: !!isPinch,
    };

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}Start`, params);
}
export function triggerRender(
    moveable: MoveableManager<any>,
    eventAffix: string,
    { clientX, clientY, datas, isPinch }: any,
) {
    const params: IObject<any> = {
        clientX,
        clientY,
        datas,
        target: moveable.state.target!,
        isPinch: !!isPinch,
    };

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}`, params);
}
export function triggerRenderEnd(
    moveable: MoveableManager<any>,
    eventAffix: string,
    { clientX, clientY, datas, isPinch, isDrag }: any,
) {
    const params: IObject<any> = {
        clientX,
        clientY,
        datas,
        target: moveable.state.target!,
        isPinch: !!isPinch,
        isDrag,
    };

    if (eventAffix === "Group") {
        params.targets = moveable.props.targets;
    }
    triggerEvent(moveable, `onRender${eventAffix}End`, params);
}
