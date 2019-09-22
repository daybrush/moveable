import MoveableGroup from "./MoveableGroup";
import { Able } from "./types";
import MoveableManager from "./MoveableManager";
import { hasClass } from "@daybrush/utils";
import { prefix } from "./utils";

export function triggerChildAble<T extends Able>(
    moveable: MoveableGroup,
    able: T,
    type: keyof T,
    e: any,
    callback?: (moveable: MoveableManager<any>, datas: any, result: any, index: number) => any,
) {
    const name = able.name!;
    const datas = e.datas;
    const ableDatas = datas[name] || (datas[name] = []);

    return moveable.moveables.map((child, i) => {
        const childDatas = ableDatas[i] || (ableDatas[i] = {});

        const result = (able as any)[type]!(child, { ...e, datas: childDatas, parentFlag: true });

        result && callback && callback(child, childDatas, result, i);
        return result;
    });
}
export function getCustomEvent(datas: any) {
    return datas.custom;
}

export function setCustomEventDelta(
    deltaX: number,
    deltaY: number,
    datas: any,
    inputEvent: any,
) {
    const e = getCustomEvent(datas);

    if (e) {
        return setCustomEvent(e.prevX + deltaX, e.prevY + deltaY, datas, inputEvent);
    }

    return setCustomEvent(deltaX, deltaY, datas, inputEvent);
}

export function setCustomEvent(
    clientX: number,
    clientY: number,
    datas: any,
    inputEvent: any,
) {
    const e = datas.custom || (datas.custom = {
        startX: clientX,
        startY: clientY,
        prevX: clientX,
        prevY: clientY,
        isDrag: false,
        datas: {},
    });
    const { prevX, prevY, startX, startY, datas: customDatas } = e;

    e.prevX = clientX;
    e.prevY = clientY;

    if (clientX !== prevX || clientY !== prevY) {
        e.isDrag = true;
    }
    return {
        clientX,
        clientY,
        distX: clientX - startX,
        distY: clientY - startY,
        deltaX: clientX - prevX,
        deltaY: clientY - prevY,
        isDrag: e.isDrag,
        datas: customDatas,
        inputEvent,
        parentEvent: true,
    };
}

export function directionCondition(target: HTMLElement | SVGElement) {
    return hasClass(target, prefix("direction"));
}
