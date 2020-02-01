import MoveableManager from "../../src/react-moveable/MoveableManager";
import {  createRotateMatrix, caculate, minus, plus } from "@moveable/matrix";
import { RotatableProps } from "../../src/react-moveable";
import { getClientRect } from "../../src/react-moveable/utils";

export async function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function dispatchEvent(target: HTMLElement | SVGElement, type: string, client: number[]) {
    target.dispatchEvent(new MouseEvent(type, {
        clientX: client[0],
        clientY: client[1],
        cancelable: true,
        bubbles: true,
    }));
}
export function mousedown(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mousedown", client);
}
export function mousemove(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mousemove", client);
}
export function mouseup(target: HTMLElement | SVGElement, client: number[]) {
    dispatchEvent(target, "mouseup", client);
}

export function rotateStart(moveable: MoveableManager<RotatableProps>) {
    const rotationElement = moveable.controlBox.getElement().querySelector<HTMLElement>(".moveable-rotation")!;

    const { left, top, width, height } = rotationElement.getBoundingClientRect();
    const clientX = left + width / 2;
    const clientY = top + height / 2;
    const { origin } = moveable.state;
    const rect = getClientRect(moveable.controlBox.getElement());
    const absoluteOrigin = [
        rect.left + origin[0],
        rect.top + origin[1],
    ];
    const client = [clientX, clientY];
    mousedown(rotationElement, client);

    return [rotationElement, client, absoluteOrigin];
}
export async function rotate(startInfo: any[], deg: number) {
    const [rotationElement, startClient, absoluteOrigin] = startInfo;

    const rad = deg / 180 * Math.PI;

    const m = createRotateMatrix(rad, 3);
    const dist = minus(startClient, absoluteOrigin);
    const [offsetX, offsetY] = caculate(m, [dist[0], dist[1], 1]);
    const client = plus(absoluteOrigin, [offsetX, offsetY]);

    dispatchEvent(rotationElement, "mousemove", client);
}
export async function rotateEnd(startInfo: any[]) {
    const [rotationElement] = startInfo;

    dispatchEvent(rotationElement, "mouseup", [0, 0]);
}
