import {
    DEFAULT_DRAGGABLE_CONTROLS, DEFAULT_ORIGIN_DRAGGABLE_CONTROLS, DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { makeGroup } from "../utils/story";

export default {
    title: "Able Combination",
};

const { add } = makeGroup("2-Combination");

export const CombinationDraggableResizableRotatble = add("Draggable & Resizable & Rotatable", {
    appName: "ReactDraggableResizableRotatableApp",
    app: require("./react/ReactDraggableResizableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const CombinationDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    appName: "ReactDraggableScalableRotatableApp",
    app: require("./react/ReactDraggableScalableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const CombinationDraggableOriginRotatable = add("Draggable & OriginDraggable & Rotatable", {
    appName: "ReactDraggableOriginDraggableRotatableApp",
    app: require("./react/ReactDraggableOriginDraggableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});

export const CombinationAllInOne = add("All In One", {
    appName: "ReactAllInOneApp",
    app: require("./react/ReactAllInOneApp").default,
    argsTypes: {
        ...DEFAULT_ORIGIN_DRAGGABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
