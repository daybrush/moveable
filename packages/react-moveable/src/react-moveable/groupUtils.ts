import { Able, MoveableGroupInterface, MoveableManagerInterface } from "./types";
import CustomGesto, { setCustomDrag } from "./gesto/CustomGesto";

export function fillChildEvents(
    moveable: MoveableGroupInterface<any, any>,
    name: string,
    e: any,
): any[] {
    const datas = e.originalDatas;

    datas.groupable = datas.groupable || {};

    const groupableDatas = datas.groupable;

    groupableDatas.childDatas = groupableDatas.childDatas || [];

    const childDatas = groupableDatas.childDatas;

    return moveable.moveables.map((_, i) => {
        childDatas[i] = childDatas[i] || {};
        childDatas[i][name] = childDatas[i][name] || {};

        return {
            ...e,
            datas: childDatas[i][name],
            originalDatas: childDatas[i],
        };
    });
}
export function triggerChildGesto(
    moveable: MoveableGroupInterface<any, any>,
    able: Able,
    type: string,
    delta: number[],
    e: any,
    isConvert: boolean,
) {
    const isStart = !!type.match(/Start$/g);
    const isEnd = !!type.match(/End$/g);
    const isPinch = e.isPinch;
    const datas = e.datas;
    const events = fillChildEvents(moveable, able.name, e);

    const moveables = moveable.moveables;
    const childs = events.map((ev, i) => {
        const childMoveable = moveables[i];
        let childEvent: any = ev;

        if (isStart) {
            childEvent = new CustomGesto().dragStart(delta, ev);
        } else {
            if (!childMoveable.state.gesto) {
                childMoveable.state.gesto = datas.childGestos[i];
            }
            childEvent = setCustomDrag(ev, childMoveable.state, delta, isPinch, isConvert);
        }
        const result = (able as any)[type]!(childMoveable,  { ...childEvent, parentFlag: true });

        if (isEnd) {
            childMoveable.state.gesto = null;
        }
        return result;
    });
    if (isStart) {
        datas.childGestos = moveables.map(child => child.state.gesto);
    }
    return childs;
}
export function triggerChildAbles<T extends Able>(
    moveable: MoveableGroupInterface<any, any>,
    able: T,
    type: keyof T & string,
    e: any,
    eachEvent: (movebale: MoveableManagerInterface<any, any>, ev: any) => any = (_, ev) => ev,
    callback?: (moveable: MoveableManagerInterface<any, any>, ev: any, result: any, index: number) => any,
) {
    const isEnd = !!type.match(/End$/g);
    const events = fillChildEvents(moveable, able.name, e);
    const moveables = moveable.moveables;
    const childs = events.map((ev, i) => {
        const childMoveable = moveables[i];
        let childEvent = ev;

        childEvent = eachEvent(childMoveable, ev);

        const result = (able as any)[type]!(childMoveable,  { ...childEvent, parentFlag: true });

        result && callback && callback(childMoveable, ev, result, i);

        if (isEnd) {
            childMoveable.state.gesto = null;
        }
        return result;
    });

    return childs;
}
