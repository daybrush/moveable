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
import { add } from "../utils/story";

export default {
    title: "Group",
};

export const GroupDraggableResizableRotatable = add("Draggable & Resizable & Rotatable", {
    app: require("./ReactDraggableResizableRotatableApp").default,
    path: require.resolve("./ReactDraggableResizableRotatableApp"),
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_GROUP_CONTROLS,
    },
});
export const GroupDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    app: require("./ReactDraggableScalableRotatableApp").default,
    path: require.resolve("./ReactDraggableScalableRotatableApp"),
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_SCALABLE_GROUP_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});


export const GroupAllInOne = add("All in One", {
    app: require("./ReactAllInOneApp").default,
    path: require.resolve("./ReactAllInOneApp"),
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
export const GroupMultipleGroup = add("Multiple Group", {
    app: require("./ReactMultipleGroupApp").default,
    path: require.resolve("./ReactMultipleGroupApp"),
});

export const GroupRoundableGroup = add("Roundable Group", {
    app: require("./ReactRoundableGroupApp").default,
    path: require.resolve("./ReactRoundableGroupApp"),
});
