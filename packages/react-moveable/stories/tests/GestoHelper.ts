export function mousedown(target: HTMLElement, [clientX, clientY]: number[]) {
    const event = new MouseEvent("mousedown", {
        clientX,
        clientY,
    });
    target.dispatchEvent(event);
}

export function getMouseInit(startRect: { left: number, top: number }, offset: number[]) {
    return {
        buttons: 1,
        screenX: startRect.left + offset[0],
        screenY: startRect.top + offset[1],
        clientX: startRect.left + offset[0],
        clientY: startRect.top + offset[1],
        offsetX: offset[0],
        offsetY: offset[1],
        bubbles: true,
        cancelable: true,
    };
}
export function dispatchDrag(
    target: HTMLElement,
    offset: number[],
    [distX, distY]: number[],
    options: { duration: number, interval: number } = { duration: 50, interval: 5 },
) {
    const startRect = target.getBoundingClientRect();
    const mousedown = new MouseEvent("mousedown", getMouseInit(startRect, offset));
    target.dispatchEvent(mousedown);

    const count = Math.floor(options.duration / options.interval);
    for (let i = 1; i <= count; ++i) {
        dispatchMouseMove(target, getMouseInit(startRect, [
            offset[0] + distX / count * i,
            offset[1] + distY / count * i,
        ]), options.interval * i);
    }
    return new Promise<void>(resolve => {
        setTimeout(() => {
            const mosueup = new MouseEvent("mouseup", getMouseInit(startRect, [offset[0] + distX, offset[1] + distY]));

            target.dispatchEvent(mosueup);
            resolve();
        }, options.duration);
    });
}

export async function dispatchMouseMove(target: HTMLElement, moustInit: any, time: number) {
    setTimeout(() => {
        const mousemove = new MouseEvent("mousemove", moustInit);

        target.dispatchEvent(mousemove);
    }, time);
}
