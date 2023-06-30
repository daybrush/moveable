import { expect } from "@storybook/jest";

import { makeArgType, makeOptionLink } from "../utils";
import { makeGroup } from "../utils/story";
import "../templates/default.css";
import { pan, wait } from "../utils/testing";

export default {
    title: "Options",
};

const { add } = makeGroup("4-Options");


export const OptionsResizeObserver = add("useResizeObserver", {
    appName: "ReactUseResizeObserverApp",
    app: require("./react/ReactUseResizeObserverApp").default,
});

export const OptionsResizeObserverGroup = add("useResizeObserver (Group)", {
    appName: "ReactUseResizeObserverGroupApp",
    app: require("./react/ReactUseResizeObserverGroupApp").default,
});

export const OptionsResizeObserverIndividualGroup = add("useResizeObserver (Individual Group)", {
    app: require("./react/ReactUseResizeObserverIndividualGroupApp").default,
    appName: "ReactUseResizeObserverIndividualGroupApp",
});

export const OptionsMutationObserver = add("useMutationObserver", {
    app: require("./react/ReactUseMutationObserverApp").default,
    appName: "ReactUseMutationObserverApp",
});


export const OptionsPadding = add("padding", {
    app: require("./react/ReactPaddingApp").default,
    appName: "ReactPaddingApp",
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
    app: require("./react/ReactLinePaddingApp").default,
    appName: "ReactLinePaddingApp",
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
    app: require("./react/ReactControlPaddingApp").default,
    appName: "ReactControlPaddingApp",
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
    app: require("./react/ReactCheckInputApp").default,
    appName: "ReactCheckInputApp",
});


export const OptionsDragFocusedInput = add("dragFocusedInput", {
    app: require("./react/ReactDragFocusedInputApp").default,
    appName: "ReactDragFocusedInputApp",
});


export const OptionsViewContainer = add("viewContainer (Cursor is applied in viewer during dragging)", {
    app: require("./react/ReactViewContainerApp").default,
    appName: "ReactViewContainerApp",
});



export const OptionsPersistData = add("persistData (First render with persisted data)", {
    app: require("./react/ReactPersistDataApp").default,
    appName: "ReactPersistDataApp",
});

export const OptionsPersistDataGroup = add("persistData (First render with persisted data, group)", {
    app: require("./react/ReactGroupPersistDataApp").default,
    appName: "ReactGroupPersistDataApp",
});


export const OptionsPersistDataIndividualGroup = add(`persistData (First render with persisted data, individual group)`, {
    app: require("./react/ReactIndividualGroupPersistDataApp").default,
    appName: "ReactIndividualGroupPersistDataApp",
});

export const OptionsRootContainer = add("rootContainer (css transformed container)", {
    app: require("./react/ReactTransformedApp").default,
    appName: "ReactTransformedApp",
});

export const OptionsRootContainerZoom = add("rootContainer (css zoomed container)", {
    app: require("./react/ReactZoomApp").default,
    appName: "ReactZoomApp",
});
export const OptionsAccuratePosition = add("useAccuratePosition (Render in a more accurate position)", {
    app: require("./react/ReactUseAccuratePositionApp").default,
    appName: "ReactUseAccuratePositionApp",
});



export const OptionsDragTarget = add("other dragTarget", {
    app: require("./react/ReactDragTargetApp").default,
    appName: "ReactDragTargetApp",
});
