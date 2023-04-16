import {
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_WARPABLE_CONTROLS,
    DEFAULT_CLIPPABLE_CONTROLS,
} from "../controls/default";
import { expect } from "@storybook/jest";

import { add } from "../utils/story";
import { pan, pinch, rotate, wait } from "../utils/testing";
import { throttle } from "@daybrush/utils";


export default {
    title: "Basic",
};

export const BasicDraggable = add("Draggable", {
    app: require("./ReactDraggableApp").default,
    path: require.resolve("./ReactDraggableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const controlBox = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;

        expect(controlBox.style.transform).toBe("translate3d(100px, 150px, 0px)");
        await pan({
            target,
            start: [0, 0],
            end: [100, 0],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(100px, 0px)");
        expect(controlBox.style.transform).toBe("translate3d(200px, 150px, 0px)");
    },
});

export const BasicResizable = add("Resizable", {
    app: require("./ReactResizableApp").default,
    path: require.resolve("./ReactResizableApp"),
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const resizeControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-direction="se"]`)!;

        await pan({
            target: resizeControl,
            start: [0, 0],
            end: [100, 100],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(0px, 0px)");
        expect(target.style.width).toBe("200px");
        expect(target.style.height).toBe("200px");
    },
});


export const BasicScalable = add("Scalable", {
    app: require("./ReactScalableApp").default,
    path: require.resolve("./ReactScalableApp"),
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const resizeControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-direction="se"]`)!;

        await pan({
            target: resizeControl,
            start: [0, 0],
            end: [50, 100],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(25px, 50px) scale(1.5, 2)");
    },
});
export const BasicScalableKeepRatioTest = add("Scalable keepRatio Test", {
    app: require("./ReactScalableApp").default,
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
    },
    args: {
        keepRatio: true,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const resizeControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-direction="nw"]`)!;

        await pan({
            target: resizeControl,
            start: [0, 0],
            end: [300, 300],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(150px, 150px) scale(-2, -2)");
    },
});

export const BaiscRotatable = add("Rotatable", {
    app: require("./ReactRotatableApp").default,
    path: require.resolve("./ReactRotatableApp"),
    argsTypes: {
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const rotationControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-rotation-control`)!;

        await rotate({
            target: rotationControl,
            start: 0,
            end: 90,
            duration: 100,
            interval: 10,
            baseTarget: target,
        });
        expect(target.style.transform).toBe("translate(0px, 0px) rotate(90deg)");
    },
});


export const BasicWarpable = add("Warpable", {
    app: require("./ReactWarpableApp").default,
    path: require.resolve("./ReactWarpableApp"),
    argsTypes: {
        ...DEFAULT_WARPABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const seControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-direction="se"]`)!;

        await pan({
            target: seControl,
            start: [0, 0],
            end: [10, 10],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe(`matrix3d(1.04545, 0.0454545, 0, -0.000909091, 0.0454545, 1.04545, 0, -0.000909091, 0, 0, 1, 0, 0, 0, 0, 1)`);
    },
});


export const BasicClippable = add("Clippable", {
    app: require("./ReactClippableApp").default,
    path: require.resolve("./ReactClippableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_CLIPPABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const seControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-clip-index="4"]`)!;

        await pan({
            target: seControl,
            start: [0, 0],
            end: [-40, -40],
            duration: 100,
            interval: 10,
        });
        expect(target.style.clipPath).toBe(`inset(0px 40px 40px 0px)`);
    },
});

export const BasicRoundable = add("Roundable", {
    app: require("./ReactRoundableApp").default,
    path: require.resolve("./ReactRoundableApp"),
    play: async ({ canvasElement }) => {
        await wait();

        const targets = canvasElement.querySelectorAll<HTMLElement>(".target")!;
        const moveables = canvasElement.querySelectorAll<HTMLElement>(".moveable-control-box")!;

        // first
        const radius0Control = moveables[0].querySelector<HTMLElement>(`[data-radius-index="0"]`)!;

        await pan({
            target: radius0Control,
            start: [0, 0],
            end: [10, 0],
            duration: 100,
            interval: 10,
        });
        expect(targets[0].style.borderRadius).toBe(`35px`);


        // second
        const radius1Control = moveables[1].querySelector<HTMLElement>(`[data-radius-index="1"]`)!;

        await pan({
            target: radius1Control,
            start: [0, 0],
            end: [-10, 0],
            duration: 100,
            interval: 10,
        });
        expect(targets[1].style.borderRadius).toBe(`25px 33px`);
    },
});

export const BasicOriginDraggable = add("OriginDraggable", {
    app: require("./ReactOriginDraggableApp").default,
    path: require.resolve("./ReactOriginDraggableApp"),
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const rotationControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-rotation-control`)!;

        await rotate({
            target: rotationControl,
            start: 0,
            end: 60,
            duration: 100,
            interval: 10,
            baseTarget: target,
        });

        const clientRect1 = target.getBoundingClientRect();
        const originControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-origin`)!;

        await pan({
            target: originControl,
            start: [0, 0],
            end: [30, 30],
            duration: 100,
            interval: 10,
        });

        const clientRect2 = target.getBoundingClientRect();
        expect(throttle(clientRect1.left, 0.1)).toBe(throttle(clientRect2.left, 0.1));
        expect(throttle(clientRect1.top, 0.1)).toBe(throttle(clientRect2.top, 0.1));
    },
});



export const BasicPinchable = add("Pinchable", {
    app: require("./ReactPinchableApp").default,
    path: require.resolve("./ReactPinchableApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        // const controlBox = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;

        await pinch({
            target,
            start: [0, 0],
            end: [100, 0],
            startOffset: [100, 0],
            endOffset: [-200, 0],
            duration: 100,
            interval: 10,
        });

        expect(target.style.transform).toBe(`translate(100px, 0px) rotate(-180deg) scale(2, 2)`);
    },
});
