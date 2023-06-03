import { expect } from "@storybook/jest";
import {
    DEFAULT_BOUNDS_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_INNER_BOUNDS_CONTROLS,
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_SNAPPABLE_CONTROLS,
    DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS,
    DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
    DEFAULT_SNAP_CONTAINER_CONTROLS,
    DEFAULT_SNAP_GRID_CONTROLS,
} from "../controls/default";
import { makeArgType, makeLink } from "../utils";
import { add } from "../utils/story";
import { pan, wait } from "../utils/testing";


export default {
    title: "Snap & Bound",
};

export const SnapGuidelines = add("Snap Guidelines", {
    app: require("./ReactSnapGuidelinesApp").default,
    path: require.resolve("./ReactSnapGuidelinesApp"),
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
    },
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target")!;

        // from: left 100, top 150
        // to: left 52, top 2
        // result: left 49, top -1
        await pan({
            target,
            start: [0, 0],
            end: [-48, -148],
            duration: 20,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(-51px, -151px)");
    },
});

export const SnapElements = add("Snap Elements", {
    app: require("./ReactSnapElementsApp").default,
    path: require.resolve("./ReactSnapElementsApp"),
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS,
    },
});


export const SnapGrid = add("Snap Grid", {
    app: require("./ReactSnapGridApp").default,
    path: require.resolve("./ReactSnapGridApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_SNAP_GRID_CONTROLS,
    },
});

export const SnapBoundDragScale = add("Bound Drag & Scale", {
    app: require("./ReactBoundScalableApp").default,
    path: require.resolve("./ReactBoundScalableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});

export const SnapBoundDragResize = add("Bound Drag & Resize", {
    app: require("./ReactBoundResizableApp").default,
    path: require.resolve("./ReactBoundResizableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});


export const SnapDragRotate = add("Bound Drag & Rotate", {
    app: require("./ReactBoundRotatableApp").default,
    path: require.resolve("./ReactBoundRotatableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});

export const SnapDragRotateGroup = add("Bound Drag & Rotate Group", {
    app: require("./ReactBoundRotatableGroupApp").default,
    path: require.resolve("./ReactBoundRotatableGroupApp"),
});

export const SnapSnapContainer = add("Use snapContainer option", {
    app: require("./ReactSnapContainerApp").default,
    path: require.resolve("./ReactSnapContainerApp"),
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAP_CONTAINER_CONTROLS,
        ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

export const SnapInnerBoundResize = add("inner bound with resize", {
    app: require("./ReactInnerBoundResizableApp").default,
    path: require.resolve("./ReactInnerBoundResizableApp"),
    argsTypes: {
        ...DEFAULT_INNER_BOUNDS_CONTROLS,
    },
});

export const SnapMaxiumDistance = add("Set maximum distance for guidelines", {
    app: require("./ReactMaxSnapElementApp").default,
    path: require.resolve("./ReactMaxSnapElementApp"),
    argsTypes: {
        maxSnapElementGuidelineDistance: makeArgType({
            type: "number",
            description: makeLink("Snappable", "maxSnapElementGuidelineDistance"),
            defaultValue: 100,
        }),
        maxSnapElementGapDistance: makeArgType({
            type: "number",
            description: makeLink("Snappable", "maxSnapElementGapDistance"),
            defaultValue: 80,
        }),
    },
});


export const SnapElementsGroup = add("Snap Elements (group)", {
    app: require("./ReactSnapElementsGroupApp").default,
    path: require.resolve("./ReactSnapElementsGroupApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const moveable = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;
        const target = canvasElement.querySelector<HTMLElement>(".moveable-area")!;

        await pan({
            target,
            start: [0, 0],
            end: [-118, -118],
            duration: 20,
            interval: 10,
        });
        expect(moveable.style.transform).toBe("translate3d(-1px, -1px, 0px)");
    },
});


export const SnapRotations = add("Snap Rotations", {
    app: require("./ReactSnapRotationsApp").default,
    path: require.resolve("./ReactSnapRotationsApp"),
    // play: async ({ canvasElement }) => {
    //     await wait();
    //     const moveable = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;
    //     const target = canvasElement.querySelector<HTMLElement>(".moveable-area")!;

    //     await pan({
    //         target,
    //         start: [0, 0],
    //         end: [-118, -118],
    //         duration: 20,
    //         interval: 10,
    //     });
    //     expect(moveable.style.transform).toBe("translate3d(-1px, -1px, 0px)");
    // },
});


// export * from "./9-maxSnapElement.stories";
