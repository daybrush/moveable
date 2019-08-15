import MoveableGroup from "./MoveableGroup";
import { Able } from "./types";

export function triggerChildAble<T extends Able>(
    moveable: MoveableGroup,
    able: T,
    type: keyof T,
    e: any,
) {
    const name = able.name!;
    const datas = e.datas;
    const ableDatas = datas[name] || (datas[name] = []);

    return moveable.moveables.map((child, i) => {
        const childDatas = ableDatas[i] || (ableDatas[i] = {});

        return (able as any)[type]!(child, { ...e, datas: childDatas, parentFlag: true });
    });
}
