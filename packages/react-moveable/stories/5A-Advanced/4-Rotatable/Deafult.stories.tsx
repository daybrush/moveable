import { rotate, wait } from "@/stories/utils/testing";
import { add } from "../../utils/story";
import { expect } from "@storybook/jest";


export default {
    title: "Advanced Rotatable",
};

export const AdvancedRotatableCustomOrigin = add("rotate with custom origin", {
    app: require("./ReactCustomOriginApp").default,
    path: require.resolve("./ReactCustomOriginApp"),
});

export const AdvancedRotatableRotateWithControls = add("rotate with direction controls", {
    app: require("./ReactRotateWithControlsApp").default,
    path: require.resolve("./ReactRotateWithControlsApp"),
});

export const AdvancedRotatableRotateWithResize = add("rotate with resize", {
    app: require("./ReactRotateWithResizeApp").default,
    path: require.resolve("./ReactRotateWithResizeApp"),
});

export const AdvancedSetRotation = add("customize the rotation value ", {
    app: require("./ReactSetRotationApp").default,
    path: require.resolve("./ReactSetRotationApp"),
    play: async ({ canvasElement }) => {
        await wait();

        const target = canvasElement.querySelector<HTMLElement>(".target.rotatable")!;
        const rotationControl = canvasElement.querySelector<HTMLElement>(`.moveable-control-box .moveable-rotation-control`)!;

        await rotate({
            target: rotationControl,
            start: 0,
            end: 70,
            duration: 100,
            interval: 10,
            baseTarget: target,
        });
        expect(target.style.transform).toBe("translate(0px, 0px) rotate(90deg)");
    },
});
