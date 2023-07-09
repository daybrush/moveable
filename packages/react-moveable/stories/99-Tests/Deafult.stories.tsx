import { splitBracket, splitComma } from "@daybrush/utils";
import { add } from "../utils/story";
import { findMoveable, pan, wait } from "../utils/testing";
import { expect } from "@storybook/jest";

export default {
    title: "Variable Situations",
};

export const TestsNoTarget = add("No Target", {
    app: require("./ReactNoTargetApp").default,
    path: require.resolve("./ReactNoTargetApp"),
});
export const TestsClickATag = add("Click a tag", {
    app: require("./ReactATagApp").default,
    path: require.resolve("./ReactATagApp"),
});

export const TestsInput = add("Any native input element", {
    app: require("./ReactInputApp").default,
    path: require.resolve("./ReactInputApp"),
});
export const TestsSafari = add("Test Control Box in Safari", {
    app: require("./ReactSafariApp").default,
    path: require.resolve("./ReactSafariApp"),
});
export const TestsCustomElement = add("Test Custom Element Offset", {
    app: require("./ReactCustomElementApp").default,
    path: require.resolve("./ReactCustomElementApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const moveableElement = findMoveable(canvasElement);

        expect(moveableElement.style.transform).toBe("translate3d(60px, 192px, 0px)");
    },
});
export const TestsCustomElementBounds = add("Test Custom Element with Bounds", {
    app: require("./ReactCustomElementBoundsApp").default,
    path: require.resolve("./ReactCustomElementBoundsApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const customElement = canvasElement.querySelector("custom-element")!;
        const innerMoveable = customElement!.shadowRoot!.querySelector<HTMLElement>(".moveable-control-box")!;

        expect(innerMoveable.style.transform).toBe("translate3d(50px, 50px, 0px)");
    },
});
export const TestsAccuracy = add("Check drag accuracy when using bounds", {
    app: require("./ReactAccuracyApp").default,
    path: require.resolve("./ReactAccuracyApp"),
});

export const TestsLargeZoom = add("Check element guidelines accuracy when zoom is large", {
    app: require("./ReactLargeZoomElementGuidelinesApp").default,
    path: require.resolve("./ReactLargeZoomElementGuidelinesApp"),
});

export const TestsFlex = add("Test flex element", {
    app: require("./ReactFlexApp").default,
    path: require.resolve("./ReactFlexApp"),
});

export const TestsWillChange = add("Test Container with will change", {
    app: require("./ReactWillChangeApp").default,
    path: require.resolve("./ReactWillChangeApp"),
});

export const TestsStopDrag = add("Stop drag if target is select, input, textarea", {
    app: require("./ReactStopDragApp").default,
    path: require.resolve("./ReactStopDragApp"),
});

export const TestsClick = add("Stop Click event's Propagation for dragStart", {
    app: require("./ReactClickApp").default,
    path: require.resolve("./ReactClickApp"),
});

export const TestsNestedTarget = add("Nested Moveable's target", {
    app: require("./ReactNestedTargetApp").default,
    path: require.resolve("./ReactNestedTargetApp"),
});

export const TestsZoomedCursor = add("Zoomed Cursor", {
    app: require("./ReactZoomedCursorApp").default,
    path: require.resolve("./ReactZoomedCursorApp"),
});

export const TestsHandleLargeNumber = add("Test performance for large number instances", {
    app: require("./ReactHandleLargeNumberApp").default,
    path: require.resolve("./ReactHandleLargeNumberApp"),
});

export const TestsOverflow = add("Test overflow: auto target", {
    app: require("./ReactOverflowApp").default,
    path: require.resolve("./ReactOverflowApp"),
});

export const TestsDragtarget = add("Test Drag Target", {
    app: require("./ReactDragTargetApp").default,
    path: require.resolve("./ReactDragTargetApp"),
});

export const TestsDragStart = add("Test Drag Start Group Manually", {
    app: require("./ReactDragStartGroupApp").default,
    path: require.resolve("./ReactDragStartGroupApp"),
});

export const TestsChangingSnapContainer = add("Test Changing Snap Container", {
    app: require("./ReactChangingSnapContainerApp").default,
    path: require.resolve("./ReactChangingSnapContainerApp"),
});

export const TestsFixedSnap = add("Test Snap with position: fixed", {
    app: require("./ReactFixedSnapApp").default,
    path: require.resolve("./ReactFixedSnapApp"),
});


export const TestsZoomedTarget = add("Test css zoomed target", {
    app: require("./ReactZoomedTargetApp").default,
    path: require.resolve("./ReactZoomedTargetApp"),
});


export const TestsTRSTarget = add("Test css translate & rotate & scale target", {
    app: require("./ReactTRSTargetApp").default,
    path: require.resolve("./ReactTRSTargetApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const controlBox = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;


        // x1 => x2
        const line1 = controlBox.querySelector<HTMLElement>(`[data-line-key="render-line-0"]`)!;
        // y1 => y2
        const line2 = controlBox.querySelector<HTMLElement>(`[data-line-key="render-line-1"]`)!;

        // 100x 200
        expect(line1.style.width).toBe("100px");
        expect(line2.style.width).toBe("200px");
        expect(splitComma(splitBracket(controlBox.style.transform).value!).map(v => {
            return parseInt(v, 10);
        })).toEqual([243, 248, 0]);

        await pan({
            target,
            start: [0, 0],
            end: [100, 0],
            duration: 100,
            interval: 10,
        });
        expect(splitComma(splitBracket(target.style.transform).value!).map(v => {
            return parseInt(v, 10);
        })).toEqual([186, -25]);
        expect(splitComma(splitBracket(controlBox.style.transform).value!).map(v => {
            return parseInt(v, 10);
        })).toEqual([343, 248, 0]);
    },
});

export const TestsZoomedSnap = add("Test snap for scaled target", {
    app: require("./ReactZoomedSnapApp").default,
    path: require.resolve("./ReactZoomedSnapApp"),
});

export const TestsRequestBounds = add("Test request with bounds", {
    app: require("./ReactRequestBoundsApp").default,
    path: require.resolve("./ReactRequestBoundsApp"),
});

export const TestsRotateClippable = add("Test rotate & clippable", {
    app: require("./ReactRotateClippableApp").default,
    path: require.resolve("./ReactRotateClippableApp"),
});


export const TestsAccurateElementGuidelines = add("Test Accurate Element Guidelines", {
    app: require("./ReactAccurateElementGuidelineApp").default,
    path: require.resolve("./ReactAccurateElementGuidelineApp"),
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target2")!;
        // const controlBox = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;

        await pan({
            target,
            start: [0, 0],
            end: [-1, -1],
            duration: 10,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(0px, 0px)");
        // expect(controlBox.style.transform).toBe("translate3d(200px, 200px, 0px)");
    },
});

export const TestsAccurateElementGuidelines2 = add("Test Accurate Element Guidelines 0.2", {
    app: require("./ReactAccurateElementGuideline2App").default,
    path: require.resolve("./ReactAccurateElementGuideline2App"),
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target2")!;

        await pan({
            target,
            start: [0, 0],
            end: [-1, -1],
            duration: 10,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(0px, 0px)");
    },
});

export const TestDragAPI = add("Test Drag API", {
    app: require("./ReactDragAPIApp").default,
    path: require.resolve("./ReactDragAPIApp"),
});


export const TestChangeTargetsOnClick = add("Test Change Target on Click Group", {
    app: require("./ReactChangeTargetsOnClickApp").default,
    path: require.resolve("./ReactChangeTargetsOnClickApp"),
});



export const TestScalableKeepRatio = add("Even if the size is 0, the ratio is maintained.", {
    app: require("./ReactScalableKeepRatioApp").default,
    path: require.resolve("./ReactScalableKeepRatioApp"),
});



export const TestIframe = add("Test Iframe", {
    app: require("./ReactIframeApp").default,
    path: require.resolve("./ReactIframeApp"),
});


export const TestTranslate50 = add("Test translate(-50%, -50%)", {
    app: require("./ReactTranslate50App").default,
    path: require.resolve("./ReactTranslate50App"),
    play: async ({ canvasElement }) => {
        await wait();
        const target = canvasElement.querySelector<HTMLElement>(".target")!;
        const controlBox = canvasElement.querySelector<HTMLElement>(".moveable-control-box")!;

        expect(controlBox.style.transform).toBe("translate3d(50px, 100px, 0px)");
        await pan({
            target,
            start: [0, 0],
            end: [100, 0],
            duration: 100,
            interval: 10,
        });
        expect(target.style.transform).toBe("translate(50px, -50px)");
        expect(controlBox.style.transform).toBe("translate3d(150px, 100px, 0px)");
    },
});
