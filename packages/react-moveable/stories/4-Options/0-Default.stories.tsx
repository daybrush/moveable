import { expect } from "@storybook/jest";

import { makeArgType, makeOptionLink } from "../utils";
import { add } from "../utils/story";
import "../templates/default.css";
import { pan, wait } from "../utils/testing";

export default {
    title: "Options",
};

export const OptionsResizeObserver = add("useResizeObserver", {
    app: require("./ReactUseResizeObserverApp").default,
    path: require.resolve("./ReactUseResizeObserverApp"),
});

export const OptionsResizeObserverGroup = add("useResizeObserver (Group)", {
    app: require("./ReactUseResizeObserverGroupApp").default,
    path: require.resolve("./ReactUseResizeObserverGroupApp"),
});

export const OptionsResizeObserverIndividualGroup = add("useResizeObserver (Individual Group)", {
    app: require("./ReactUseResizeObserverIndividualGroupApp").default,
    path: require.resolve("./ReactUseResizeObserverIndividualGroupApp"),
});

export const OptionsMutationObserver = add("useMutationObserver", {
    app: require("./ReactUseMutationObserverApp").default,
    path: require.resolve("./ReactUseMutationObserverApp"),
});


export const OptionsPadding = add("padding", {
    app: require("./ReactPaddingApp").default,
    path: require.resolve("./ReactPaddingApp"),
    play: async ({ canvasElement }) => {
        await wait();

        // se direction control
        const seControl = canvasElement.querySelector<HTMLElement>(`.moveable-se`)!;

        await pan({
            target: seControl,
            start: [0, 0],
            end: [100, 50],
            duration: 100,
            interval: 10,
        });
        // width 100 + padding (10 + 20) 130 => 230
        // height 100 + padding (30 + 40) 170 => 220


        const paddingAreas = canvasElement.querySelectorAll<HTMLElement>(`.moveable-padding`);
        const widthLine = canvasElement.querySelector<HTMLElement>(`[data-line-key="render-line-0"]`)!;
        const heightLine = canvasElement.querySelector<HTMLElement>(`[data-line-key="render-line-1"]`)!;

        expect(Math.round(parseFloat(widthLine.style.width))).toBe(230);
        expect(Math.round(parseFloat(heightLine.style.width))).toBe(220);

        // left
        expect(Math.round(paddingAreas[0].getBoundingClientRect().width)).toBe(10);
        // top
        expect(Math.round(paddingAreas[1].getBoundingClientRect().height)).toBe(30);
        // right
        expect(Math.round(paddingAreas[2].getBoundingClientRect().width)).toBe(20);
        // bottom
        expect(Math.round(paddingAreas[3].getBoundingClientRect().height)).toBe(40);
        // expect(canvasElement.querySelector(`[data-line-key="render-line-0"]`)
    },
});

export const OptionsLinePadding = add("linePadding", {
    app: require("./ReactLinePaddingApp").default,
    path: require.resolve("./ReactLinePaddingApp"),
    argsTypes: {
        linePadding: makeArgType({
            type: "number",
            description: makeOptionLink("Moveable", "DefaultOptions", "linePadding"),
            defaultValue: 0,
            value: 10,
        }),
    },
});

export const OptionsControlPadding = add("controlPadding", {
    app: require("./ReactControlPaddingApp").default,
    path: require.resolve("./ReactControlPaddingApp"),
    argsTypes: {
        controlPadding: makeArgType({
            type: "number",
            description: makeOptionLink("Moveable", "DefaultOptions", "controlPadding"),
            defaultValue: 0,
            value: 20,
        }),
    },
});


export const OptionsCheckInput = add("checkInput", {
    app: require("./ReactCheckInputApp").default,
    path: require.resolve("./ReactCheckInputApp"),
});


export const OptionsDragFocusedInput = add("dragFocusedInput", {
    app: require("./ReactDragFocusedInputApp").default,
    path: require.resolve("./ReactDragFocusedInputApp"),
});


export const OptionsViewContainer = add("viewContainer (Cursor is applied in viewer during dragging)", {
    app: require("./ReactViewContainerApp").default,
    path: require.resolve("./ReactViewContainerApp"),
});



export const OptionsPersistData = add("persistData (First render with persisted data)", {
    app: require("./ReactPersistDataApp").default,
    path: require.resolve("./ReactPersistDataApp"),
});

export const OptionsPersistDataGroup = add("persistData (First render with persisted data, group)", {
    app: require("./ReactGroupPersistDataApp").default,
    path: require.resolve("./ReactGroupPersistDataApp"),
});


export const OptionsPersistDataIndividualGroup = add(`persistData (First render with persisted data, individual group)`, {
    app: require("./ReactIndividualGroupPersistDataApp").default,
    path: require.resolve("./ReactIndividualGroupPersistDataApp"),
});

export const OptionsRootContainer = add("rootContainer (css transformed container)", {
    app: require("./ReactTransformedApp").default,
    path: require.resolve("./ReactTransformedApp"),
});

export const OptionsRootContainerZoom = add("rootContainer (css zoomed container)", {
    app: require("./ReactZoomApp").default,
    path: require.resolve("./ReactZoomApp"),
});
export const OptionsAccuratePosition = add("useAccuratePosition (Render in a more accurate position)", {
    app: require("./ReactUseAccuratePositionApp").default,
    path: require.resolve("./ReactUseAccuratePositionApp"),
});
