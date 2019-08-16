import MoveableGroup from "./MoveableGroup";
import { Able } from "./types";
import MoveableManager from "./MoveableManager";

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
export function getCustomDragEvent(
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
    });
    const { prevX, prevY, startX, startY } = e;

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
        datas,
        inputEvent,
    };
}
