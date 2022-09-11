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
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Snap & Bound", module);


group.add("Snap Guidelines", {
    app: require("./ReactSnapGuidelinesApp").default,
    text: require("!!raw-loader!./ReactSnapGuidelinesApp").default,
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
    },
});

group.add("Snap Elements", {
    app: require("./ReactSnapElementsApp").default,
    text: require("!!raw-loader!./ReactSnapElementsApp").default,
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
    },
});


group.add("Snap Grid", {
    app: require("./ReactSnapGridApp").default,
    text: require("!!raw-loader!./ReactSnapGridApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_SNAP_GRID_CONTROLS,
    },
});

group.add("Bound Drag & Scale", {
    app: require("./ReactBoundScalableApp").default,
    text: require("!!raw-loader!./ReactBoundScalableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});

group.add("Bound Drag & Resize", {
    app: require("./ReactBoundResizableApp").default,
    text: require("!!raw-loader!./ReactBoundResizableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});


group.add("Bound Drag & Rotate", {
    app: require("./ReactBoundRotatableApp").default,
    text: require("!!raw-loader!./ReactBoundRotatableApp").default,
    argsTypes: {
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
    },
});

group.add("Bound Drag & Rotate Group", {
    app: require("./ReactBoundRotatableGroupApp").default,
    text: require("!!raw-loader!./ReactBoundRotatableGroupApp").default,
});

group.add("Use snapContainer option", {
    app: require("./ReactSnapContainerApp").default,
    text: require("!!raw-loader!./ReactSnapContainerApp").default,
    argsTypes: {
        ...DEFAULT_SNAPPABLE_CONTROLS,
        ...DEFAULT_SNAP_CONTAINER_CONTROLS,
        ...DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS,
        ...DEFAULT_BOUNDS_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

group.add("inner bound with resize", {
    app: require("./ReactInnerBoundResizableApp").default,
    text: require("!!raw-loader!./ReactInnerBoundResizableApp").default,
    argsTypes: {
        ...DEFAULT_INNER_BOUNDS_CONTROLS,
    },
});

group.add("Set maximum distance for guidelines", {
    app: require("./ReactMaxSnapElementApp").default,
    text: require("!!raw-loader!./ReactMaxSnapElementApp").default,
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



// export * from "./9-maxSnapElement.stories";
