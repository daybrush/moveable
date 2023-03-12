import { DEFAULT_DRAGGABLE_CONTROLS, DEFAULT_RESIZABLE_CONTROLS } from "../controls/default";
import { makeArgType } from "../utils";
import { add } from "../utils/story";



export default {
    title: "Request ables through a method",
};

export const RequestDraggable = add("Draggable", {
    app: require("./ReactDraggableApp").default,
    path: require.resolve("./ReactDraggableApp"),
    argsTypes: {
        containerScale: makeArgType({
            type: "number",
            description: `<a href="#" target="_blank">Container's scale</a>`,
            defaultValue: 1,
        }),
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

export const RequestResizable = add("Resizable", {
    app: require("./ReactResizableApp").default,
    path: require.resolve("./ReactResizableApp"),
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
});

export const RequestResizableDelta = add("Resizable Delta", {
    app: require("./ReactResizableDeltaApp").default,
    path: require.resolve("./ReactResizableDeltaApp"),
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
});

export const RequestResizableGroup = add("Resizable Group", {
    app: require("./ReactResizableGroupApp").default,
    path: require.resolve("./ReactResizableGroupApp"),
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
});
