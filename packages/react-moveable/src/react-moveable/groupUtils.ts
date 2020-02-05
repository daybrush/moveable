import MoveableGroup from "./MoveableGroup";
import { Able } from "./types";
import MoveableManager from "./MoveableManager";
import { hasClass, IObject, isFunction } from "@daybrush/utils";
import { prefix } from "./utils";

export function triggerChildAble<T extends Able>(
    moveable: MoveableGroup,
    able: T,
    type: keyof T & string,
    datas: IObject<any>,
    eachEvent: ((movebale: MoveableManager, datas: IObject<any>) => any) | IObject<any>,
    callback?: (moveable: MoveableManager<any>, datas: IObject<any>, result: any, index: number) => any,
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
export function directionCondition(e: any) {
    if (e.isRequest) {
        return e.parentDirection!!;
    }
    return hasClass(e.inputEvent.target, prefix("direction"));
}
