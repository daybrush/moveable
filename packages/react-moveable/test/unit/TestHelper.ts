import MoveableManager from "../../src/react-moveable/MoveableManager";
import { getRad, createRotateMatrix, caculate, minus, sum } from "@moveable/matrix";

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

export function rotateStart(moveable: MoveableManager) {
    const rotationElement = moveable.controlBox.getElement().querySelector<HTMLElement>(".moveable-rotation")!;

    const { left, top, width, height } = rotationElement.getBoundingClientRect();
    const clientX = left + width / 2;
    const clientY = top + height / 2;
    const { rotationPos, origin } = moveable.state;
    const absoluteOrigin = [
        clientX - rotationPos[0] + origin[0],
        clientY - rotationPos[1] + origin[1],
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
    const client = sum(absoluteOrigin, [offsetX, offsetY]);

    dispatchEvent(rotationElement, "mousemove", client);
}
export async function rotateEnd(startInfo: any[]) {
    const [rotationElement] = startInfo;

    dispatchEvent(rotationElement, "mouseup", [0, 0]);
}
