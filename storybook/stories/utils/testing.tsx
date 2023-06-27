import { average, getDist } from "@daybrush/utils";

export function wait(time = 100) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function mouseEventMock(
    startRect: { left: number; top: number; },
    offsetRect: number[]
) {
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
                [
                    origin[0] + Math.sin(nextDeg) * dist - left,
                    origin[1] - Math.cos(nextDeg) * dist - top,
                ],
            ];
        },
    });
}

export function pinch(options: {
    duration?: number,
    interval?: number,
    target: HTMLElement,
    start?: number[],
    end?: number[],
    startOffset?: number[],
    endOffset: number[],
}) {
    const {
        start = [0, 0],
        end = start,
        startOffset = [0, 0],
        endOffset,
    } = options;
    return userAction({
        isTouch: true,
        ...options,
        calc: (index, count) => {
            if (index === 0) {
                return [
                    [start[0] + startOffset[0], start[1] + startOffset[1]],
                    [start[0] - startOffset[0], start[1] - startOffset[1]],
                ];
            } else if (index === count) {
                return [
                    [end[0] + endOffset[0], end[1] + endOffset[1]],
                    [end[0] - endOffset[0], end[1] - endOffset[1]],
                ];
            }

            const center = [
                start[0] + (end[0] - start[0]) / count * index,
                start[1] + (end[1] - start[1]) / count * index,
            ];
            const centerOffset = [
                startOffset[0] + (endOffset[0] - startOffset[0]) / count * index,
                startOffset[1] + (endOffset[1] - startOffset[1]) / count * index,
            ];
            return [
                [
                    center[0] + centerOffset[0],
                    center[1] + centerOffset[1],
                ],
                [
                    center[0] - centerOffset[0],
                    center[1] - centerOffset[1],
                ],
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
    isTouch?: boolean;
}) {
    const {
        start,
        end = start,
    } = options;
    return userAction({
        ...options,
        calc: (index, count) => {
            if (index === 0) {
                return [start];
            } else if (index === count) {
                return [end];
            }

            return [[
                start[0] + (end[0] - start[0]) / count * index,
                start[1] + (end[1] - start[1]) / count * index,
            ]];
        },
    });
}

export function mouseEventMocks(startRect: DOMRect, poses: number[][]) {
    return poses.map(pos => mouseEventMock(startRect, pos));
}
export function getCenterEventMock(startRect: DOMRect, clients: Array<{ offsetX: number; offsetY: number; }>) {
    const centerPos = [
        average(clients.map(client => client.offsetX)),
        average(clients.map(client => client.offsetY)),
    ];
    return mouseEventMock(startRect, centerPos);
}

function getMockEvent(eventType: string, startRect: DOMRect, poses: number[][]) {
    const isTouch = eventType.includes("touch");
    const moveClients = mouseEventMocks(startRect, poses);
    const moveClient = getCenterEventMock(startRect, moveClients);

    const event = new MouseEvent(eventType, moveClient);
    if (isTouch) {
        (event as any).touches = moveClients;
    }
    return event;
}
export function userAction(options: {
    duration?: number,
    interval?: number,
    target: HTMLElement,
    calc: (index: number, count: number) => number[][],
    isTouch?: boolean
}) {
    const {
        duration = 0,
        interval = duration,
        target,
        calc,
        isTouch,
    } = options;
    const startRect = target.getBoundingClientRect();
    const count = duration ? Math.floor(duration / interval) : 0;
    const startEvent = getMockEvent(isTouch ? "touchstart" : "mousedown", startRect, calc(0, count));

    if (isTouch) {
        (startEvent as any).changedTouches = (startEvent as any).touches;
    }

    // start
    target.dispatchEvent(startEvent);

    // pan
    for (let i = 1; i <= count; ++i) {
        setTimeout(() => {
            const moveEvent = getMockEvent(isTouch ? "touchmove" : "mousemove", startRect, calc(i, count));

            target.dispatchEvent(moveEvent);
        }, interval * i);
    }

    // end
    return new Promise<void>(resolve => {
        setTimeout(() => {
            const endEvent = getMockEvent(isTouch ? "touchend" : "mouseup", startRect, calc(count, count));

            target.dispatchEvent(endEvent);
            resolve();
        }, options.duration);
    });
}

export function findMoveable(canasElement: HTMLElement) {
    return canasElement.querySelector<HTMLElement>(".moveable-control-box")!;
}
