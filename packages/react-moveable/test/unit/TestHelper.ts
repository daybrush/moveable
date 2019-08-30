export async function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function mousedown(target: HTMLElement | SVGElement) {
    const rect = target.getBoundingClientRect();

    const clientX = rect.left + rect.width;
    const clientY = rect.top + rect.height;

    target.dispatchEvent(new MouseEvent("mousedown", {
        clientX,
        clientY,
        bubbles: true,
    }));
}
