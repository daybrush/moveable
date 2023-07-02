import { Able, MoveableGroupInterface, MoveableManagerInterface, MoveableManagerState } from "./types";
import CustomGesto, { setCustomDrag } from "./gesto/CustomGesto";
import { getAbsolutePosesByState } from "./utils";
import { calculate, createRotateMatrix } from "@scena/matrix";
import { getPosByDirection } from "./gesto/GestoUtils";

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
            isRequestChild: true,
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
    ableName: string,
) {
    const isStart = !!type.match(/Start$/g);
    const isEnd = !!type.match(/End$/g);
    const isPinch = e.isPinch;
    const datas = e.datas;
    const events = fillChildEvents(moveable, able.name, e);
    const moveables = moveable.moveables;
    const childs = events.map((ev, i) => {
        const childMoveable = moveables[i];
        const state = childMoveable.state as MoveableManagerState<any>;
        const gestos = state.gestos;
        let childEvent: any = ev;

        if (isStart) {
            childEvent = new CustomGesto(ableName).dragStart(delta, ev);
        } else {


            if (!gestos[ableName]) {
                gestos[ableName] = datas.childGestos[i];
            }
            if (!gestos[ableName]) {
                return;
            }
            childEvent = setCustomDrag(ev, state, delta, isPinch, isConvert, ableName);
        }
        const result = (able as any)[type]!(childMoveable,  { ...childEvent, parentFlag: true });

        if (isEnd) {
            gestos[ableName] = null;
        }
        return result;
    });
    if (isStart) {
        datas.childGestos = moveables.map(child => child.state.gestos[ableName]);
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
            childMoveable.state.gestos = {};
        }
        return result;
    });

    return childs;
}


export function startChildDist(
    moveable: MoveableGroupInterface,
    child: MoveableManagerInterface,
    parentDatas: any,
    childEvent: any,
) {
    const fixedDirection = parentDatas.fixedDirection;
    const fixedPosition = parentDatas.fixedPosition;

    const startPositions = childEvent.datas.startPositions || getAbsolutePosesByState(child.state);
    const pos = getPosByDirection(startPositions, fixedDirection);
    const [originalX, originalY] = calculate(
        createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
        [pos[0] - fixedPosition[0], pos[1] - fixedPosition[1], 1],
        3,
    );
    childEvent.datas.originalX = originalX;
    childEvent.datas.originalY = originalY;

    return childEvent;
}
