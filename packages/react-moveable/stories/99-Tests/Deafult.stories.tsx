import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Variable Situations", module);


group.add("No Target", {
    app: require("./ReactNoTargetApp").default,
    path: require.resolve("./ReactNoTargetApp"),
});
group.add("Click a tag", {
    app: require("./ReactATagApp").default,
    path: require.resolve("./ReactATagApp"),
});

group.add("Any native input element", {
    app: require("./ReactInputApp").default,
    path: require.resolve("./ReactInputApp"),
});
group.add("Test Control Box in Safari", {
    app: require("./ReactSafariApp").default,
    path: require.resolve("./ReactSafariApp"),
});
group.add("Test Custom Element Offset", {
    app: require("./ReactCustomElementApp").default,
    path: require.resolve("./ReactCustomElementApp"),
});
group.add("Test Custom Element with Bounds", {
    app: require("./ReactCustomElementBoundsApp").default,
    path: require.resolve("./ReactCustomElementBoundsApp"),
});
group.add("Check drag accuracy when using bounds", {
    app: require("./ReactAccuracyApp").default,
    path: require.resolve("./ReactAccuracyApp"),
});
group.add("Check element guidelines accuracy when zoom is large", {
    app: require("./ReactLargeZoomElementGuidelinesApp").default,
    path: require.resolve("./ReactLargeZoomElementGuidelinesApp"),
});
group.add("Test flex element", {
    app: require("./ReactFlexApp").default,
    path: require.resolve("./ReactFlexApp"),
});
group.add("Test Container with will change", {
    app: require("./ReactWillChangeApp").default,
    path: require.resolve("./ReactWillChangeApp"),
});
group.add("Stop drag if target is select, input, textarea", {
    app: require("./ReactStopDragApp").default,
    path: require.resolve("./ReactStopDragApp"),
});
group.add("Stop Click event's Propagation for dragStart", {
    app: require("./ReactClickApp").default,
    path: require.resolve("./ReactClickApp"),
});
group.add("Nested Moveable's target", {
    app: require("./ReactNestedTargetApp").default,
    path: require.resolve("./ReactNestedTargetApp"),
});
group.add("Zoomed Cursor", {
    app: require("./ReactZoomedCursorApp").default,
    path: require.resolve("./ReactZoomedCursorApp"),
});

group.add("Test performance for large number instances", {
    app: require("./ReactHandleLargeNumberApp").default,
    path: require.resolve("./ReactHandleLargeNumberApp"),
});

group.add("Test overflow: auto target", {
    app: require("./ReactOverflowApp").default,
    path: require.resolve("./ReactOverflowApp"),
});
group.add("Test Drag Target", {
    app: require("./ReactDragTargetApp").default,
    path: require.resolve("./ReactDragTargetApp"),
});
group.add("Test Drag Start Group Manually", {
    app: require("./ReactDragStartGroupApp").default,
    path: require.resolve("./ReactDragStartGroupApp"),
});


group.add("Test Changing Snap Container", {
    app: require("./ReactChangingSnapContainerApp").default,
    path: require.resolve("./ReactChangingSnapContainerApp"),
});

group.add("Test Snap with position: fixed", {
    app: require("./ReactFixedSnapApp").default,
    path: require.resolve("./ReactFixedSnapApp"),
});


group.add("Test css zoomed target", {
    app: require("./ReactZoomedTargetApp").default,
    path: require.resolve("./ReactZoomedTargetApp"),
});




group.add("Test snap for scaled target", {
    app: require("./ReactZoomedSnapApp").default,
    path: require.resolve("./ReactZoomedSnapApp"),
});
