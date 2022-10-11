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
    text: require("!!raw-loader!./ReactDraggableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});


group.add("Resizable", {
    app: require("./ReactResizableApp").default,
    text: require("!!raw-loader!./ReactResizableApp").default,
    argsTypes: {
        ...DEFAULT_RESIZABLE_CONTROLS,
    },
});


group.add("Scalable", {
    app: require("./ReactScalableApp").default,
    text: require("!!raw-loader!./ReactScalableApp").default,
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
    },
});

group.add("Rotatable", {
    app: require("./ReactRotatableApp").default,
    text: require("!!raw-loader!./ReactRotatableApp").default,
    argsTypes: {
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});


group.add("Warpable", {
    app: require("./ReactWarpableApp").default,
    text: require("!!raw-loader!./ReactWarpableApp").default,
    argsTypes: {
        ...DEFAULT_WARPABLE_CONTROLS,
    },
});


group.add("Clippable", {
    app: require("./ReactClippableApp").default,
    text: require("!!raw-loader!./ReactClippableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_CLIPPABLE_CONTROLS,
    },
});

group.add("Roundable", {
    app: require("./ReactRoundableApp").default,
    text: require("!!raw-loader!./ReactRoundableApp").default,
});
