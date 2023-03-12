import {
    DEFAULT_DRAGGABLE_CONTROLS, DEFAULT_ORIGIN_DRAGGABLE_CONTROLS, DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { add } from "../utils/story";

export default {
    title: "Able Combination",
};

export const CombinationDraggableResizableRotatble = add("Draggable & Resizable & Rotatable", {
    app: require("./ReactDraggableResizableRotatableApp").default,
    path: require.resolve("./ReactDraggableResizableRotatableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const CombinationDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    app: require("./ReactDraggableResizableRotatableApp").default,
    path: require.resolve("./ReactDraggableResizableRotatableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const CombinationDraggableOriginRotatable = add("Draggable & OriginDraggable & Rotatable", {
    app: require("./ReactDraggableOriginDraggableRotatableApp").default,
    path: require.resolve("./ReactDraggableOriginDraggableRotatableApp"),
    argsTypes: {
        ...DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});

export const CombinationAllInOne = add("All In One", {
    app: require("./ReactAllInOneApp").default,
    path: require.resolve("./ReactAllInOneApp"),
    argsTypes: {
        ...DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
