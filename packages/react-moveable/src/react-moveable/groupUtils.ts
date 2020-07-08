import { Able, MoveableGroupInterface, MoveableManagerInterface } from "./types";
import { IObject, isFunction } from "@daybrush/utils";
import CustomDragger, { setCustomDrag } from "./CustomDragger";
export function triggerChildDragger(
    moveable: MoveableGroupInterface<any, any>,
    able: Able,
    type: string,
    delta: number[],
    e: any,
    isConvert: boolean,
) {
    const isStart = !!type.match(/Start$/g);
    const isEnd = !!type.match(/End$/g);
    const inputEvent = e.inputEvent;
    const isPinch = e.isPinch;
    const datas = e.datas;
    const childs = moveable.moveables.map((child, i) => {
        let childEvent = {};

        if (isStart) {
            childEvent = new CustomDragger().dragStart(delta, inputEvent);
        } else {
            if (!child.state.dragger) {
                child.state.dragger = datas.childDraggers[i];
            }
            childEvent = setCustomDrag(child.state, delta, inputEvent, isPinch, isConvert);
        }
        const result = (able as any)[type]!(child,  { ...childEvent, parentFlag: true });

        if (isEnd) {
            child.state.dragger = null;
        }
        return result;
    });
    if (isStart) {
        datas.childDraggers = moveable.moveables.map(child => child.state.dragger);
    }
    return childs;
}
export function triggerChildAble<T extends Able>(
    moveable: MoveableGroupInterface<any, any>,
    able: T,
    type: keyof T & string,
    datas: IObject<any>,
    eachEvent: ((movebale: MoveableManagerInterface<any, any>, datas: IObject<any>) => any) | IObject<any>,
    callback?: (moveable: MoveableManagerInterface<any, any>, datas: IObject<any>, result: any, index: number) => any,
) {
    const name = able.name!;
    const ableDatas = datas[name] || (datas[name] = []);
    const isEnd = !!type.match(/End$/g);
    const childs = moveable.moveables.map((child, i) => {
        const childDatas = ableDatas[i] || (ableDatas[i] = {});

        const childEvent = isFunction(eachEvent) ? eachEvent(child, childDatas) : eachEvent;
        const result = (able as any)[type]!(child,  { ...childEvent, datas: childDatas, parentFlag: true });

        result && callback && callback(child, childDatas, result, i);

        if (isEnd) {
            child.state.dragger = null;
        }
        return result;
    });

    return childs;
}
