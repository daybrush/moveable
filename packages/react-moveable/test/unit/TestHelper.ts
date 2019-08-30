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
