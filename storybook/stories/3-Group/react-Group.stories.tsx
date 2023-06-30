import {
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import {
    DEFAULT_GROUPPABLE_GROUP_CONTROLS,
    DEFAULT_RESIZABLE_GROUP_CONTROLS,
    DEFAULT_SCALABLE_GROUP_CONTROLS,
} from "../controls/group";
import { makeGroup } from "../utils/story";
import { expect } from "@storybook/jest";
import { userEvent } from "@storybook/testing-library";
import { pan, rotate, wait } from "../utils/testing";
import { throttle } from "@daybrush/utils";

export default {
    title: "Group",
};

const { add } = makeGroup("3-Group");

export const GroupDraggableResizableRotatable = add("Draggable & Resizable & Rotatable", {
    appName: "ReactDraggableResizableRotatableApp",
    app: require("./react/ReactDraggableResizableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_GROUP_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();

        const areaElement = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-area`)!;
        const targets = canvasElement.querySelectorAll<HTMLElement>(".target")!;


        await pan({
            target: areaElement,
            start: [0, 0],
            end: [10, 10],
            duration: 100,
            interval: 10,
        });


        const resizeControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-direction="e"]`)!;

        await pan({
            target: resizeControl,
            start: [0, 0],
            end: [140, 100],
            duration: 100,
            interval: 10,
        });

        expect(areaElement.style.width).toBe("420px");
        expect(areaElement.style.height).toBe("345px");
        targets.forEach(target => {
            expect(target.style.width).toBe("150px");
        });

        await rotate({
            target: canvasElement.querySelector<HTMLElement>(`.moveable-rotation-control`)!,
            start: 0,
            end: 90,
            duration: 100,
            interval: 10,
            baseTarget: canvasElement.querySelector<HTMLElement>(`.moveable-origin`)!,
        });


        expect(targets[0].style.transform).toBe(`translate(242.5px, -85px) rotate(90deg)`);
        expect(targets[1].style.transform).toBe(`translate(32.5px, 165px) rotate(90deg)`);
        expect(targets[2].style.transform).toBe(`translate(-12.5px, -125px) rotate(90deg)`);


        expect(areaElement.style.width).toBe("420px");
        expect(areaElement.style.height).toBe("345px");
    },
});
export const GroupDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    appName: "ReactDraggableScalableRotatableApp",
    app: require("./react/ReactDraggableScalableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_SCALABLE_GROUP_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});


export const GroupAllInOne = add("All in One", {
    appName: "ReactAllInOneApp",
    app: require("./react/ReactAllInOneApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const GroupMultipleGroup = add("Multiple Group", {
    appName: "ReactMultipleGroupApp",
    app: require("./react/ReactMultipleGroupApp").default,
    play: async ({ canvasElement }) => {
        await wait();

        const areaElement = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-area`)!;

        await rotate({
            target: canvasElement.querySelector<HTMLElement>(`.moveable-rotation-control`)!,
            start: 0,
            end: 90,
            duration: 100,
            interval: 10,
            baseTarget: canvasElement.querySelector<HTMLElement>(`.moveable-origin`)!,
        });

        const { left, top, width, height } = areaElement.getBoundingClientRect();
        expect(throttle(parseFloat(areaElement.style.width), 0.1)).toBe(298.3);
        expect(throttle(parseFloat(areaElement.style.height), 0.1)).toBe(266.6);

        expect(throttle(left, 0.1)).toBe(133.4);
        expect(throttle(top, 0.1)).toBe(151.7);
        expect(throttle(width, 0.1)).toBe(266.9);
        expect(throttle(height, 0.1)).toBe(298.5);

        // click
        await wait();
        userEvent.click(canvasElement.querySelector("button")!);

        expect(throttle(parseFloat(areaElement.style.width), 0.1)).toBe(266.5);
        expect(throttle(parseFloat(areaElement.style.height), 0.1)).toBe(298.3);
        expect(areaElement.style.transform).toBe("translate(0px, 0px) rotate(0deg) scale(1, 1)");
    },
});

export const GroupRoundableGroup = add("Roundable Group", {
    appName: "ReactRoundableGroupApp",
    app: require("./react/ReactRoundableGroupApp").default,
    play: async ({ canvasElement }) => {
        await wait();

        const targets = canvasElement.querySelectorAll<HTMLElement>(".target")!;

        // round control
        const radius0Control = canvasElement.querySelector<HTMLElement>(`.moveable-control-box [data-radius-index="0"]`)!;

        await pan({
            target: radius0Control,
            start: [0, 0],
            end: [20, 0],
            duration: 100,
            interval: 10,
        });
        targets.forEach(target => {
            expect(target.style.borderRadius).toBe("30px");
        });
    },
});
