import { getDist } from "@daybrush/utils";

export function wait(time = 100) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function mouseEventMock(startRect: { left: number; top: number; }, offsetRect: number[]) {
    return {
        buttons: 1,
        screenX: startRect.left + offsetRect[0],
        screenY: startRect.top + offsetRect[1],
        clientX: startRect.left + offsetRect[0],
        clientY: startRect.top + offsetRect[1],
        offsetX: offsetRect[0],
        offsetY: offsetRect[1],
        bubbles: true,
        cancelable: true,
    };
}

export function rotate(options: {
    duration?: number,
    interval?: number,
    target: HTMLElement,
    start: number,
    end: number,
    baseTarget: HTMLElement,
}) {
    const {
        target,
        baseTarget,
        start: startDeg,
        end: endDeg = startDeg,
    } = options;
    const {
        left,
        top,
        width,
        height,
    } = target.getBoundingClientRect();
    const {
        width: baseWidth,
        height: baseHeight,
        left: baseLeft,
        top: baseTop,
    } = baseTarget.getBoundingClientRect();

    const origin = [
        baseLeft + baseWidth / 2,
        baseTop + baseHeight / 2,
    ];

    const dist = getDist([
        left + width / 2,
        top + height / 2,
    ], origin);

    return userAction({
        ...options,
        calc: (index, count) => {
            const progress = index ? index / count : 0;
            const nextDeg = (startDeg + (endDeg - startDeg) * progress) / 180 * Math.PI;

            return [
                origin[0] + Math.sin(nextDeg) * dist - left,
                origin[1] - Math.cos(nextDeg) * dist - top,
            ];
        },
    });
}

export function pan(options: {
    duration?: number,
    interval?: number,
    target: HTMLElement,
    start: number[],
    end?: number[],
}) {
    const {
        start,
        end = start,
    } = options;
    return userAction({
        ...options,
        calc: (index, count) => {
            if (index === 0) {
                return start;
            } else if (index === count) {
                return end;
            }

            return [
                start[0] + (end[0] - start[0]) / count * index,
                start[1] + (end[1] - start[1]) / count * index,
            ];
        },
    });
}

export function userAction(options: {
    duration?: number,
    interval?: number,
    target: HTMLElement,
    calc: (index: number, count: number) => number[],
}) {
    const {
        duration = 0,
        interval = duration,
        target,
        calc,
    } = options;
    const startRect = target.getBoundingClientRect();
    const count = duration ? Math.floor(duration / interval) : 0;
    const mousedown = new MouseEvent("mousedown", mouseEventMock(startRect, calc(0, count)));

    // start
    target.dispatchEvent(mousedown);

    // pan
    for (let i = 1; i <= count; ++i) {
        setTimeout(() => {
            const mousemove = new MouseEvent("mousemove", mouseEventMock(startRect, calc(i, count)));

            target.dispatchEvent(mousemove);
        }, interval * i);
    }

    // end
    return new Promise<void>(resolve => {
        setTimeout(() => {
            const mosueup = new MouseEvent("mouseup", mouseEventMock(startRect, calc(count, count)));

            target.dispatchEvent(mosueup);
            resolve();
        }, options.duration);
    });
}

export function findMoveable(canasElement: HTMLElement) {
    return canasElement.querySelector<HTMLElement>(".moveable-control-box")!;
}
