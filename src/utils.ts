import { Able, DefaultProps } from "react-moveable/types";
import { getElementInfo as getElementInfoFunction, makeAble as makeAbleFunction } from "react-moveable";

export function getElementInfo(
    target: SVGElement | HTMLElement,
    container?: SVGElement | HTMLElement | null,
    rootContainer?: SVGElement | HTMLElement | null | undefined,
) {
    return getElementInfoFunction(target, container, rootContainer);
};
export function makeAble<
    Name extends string,
    AbleObject extends Partial<Able<any, any>>,
    Props extends DefaultProps<Name, AbleObject>,
>(name: Name, able: AbleObject) {
    return makeAbleFunction<Name, AbleObject, Props>(name, able);
}
