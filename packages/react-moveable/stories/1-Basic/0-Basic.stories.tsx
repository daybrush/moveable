import {
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
    DEFAULT_WARPABLE_CONTROLS,
    DEFAULT_CLIPPABLE_CONTROLS,
} from "../controls/default";
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Basic", module);


group.add("Draggable", {
    app: require("./ReactDraggableApp").default,
    path: require.resolve("./ReactDraggableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});


group.add("Resizable", {
    app: require("./ReactResizableApp").default,
    path: require.resolve("./ReactResizableApp"),
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
});


group.add("Scalable", {
    app: require("./ReactScalableApp").default,
    path: require.resolve("./ReactScalableApp"),
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
    },
});

group.add("Rotatable", {
    app: require("./ReactRotatableApp").default,
    path: require.resolve("./ReactRotatableApp"),
    argsTypes: {
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});


group.add("Warpable", {
    app: require("./ReactWarpableApp").default,
    path: require.resolve("./ReactWarpableApp"),
    argsTypes: {
        ...DEFAULT_WARPABLE_CONTROLS,
    },
});


group.add("Clippable", {
    app: require("./ReactClippableApp").default,
    path: require.resolve("./ReactClippableApp"),
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_CLIPPABLE_CONTROLS,
    },
});

group.add("Roundable", {
    app: require("./ReactRoundableApp").default,
    path: require.resolve("./ReactRoundableApp"),
});
