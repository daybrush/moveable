import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Clippable", module);



group.add("Clippable with Drag, Resize, Rotate", {
    app: require("./ReactClippableApp").default,
    path: require.resolve("./ReactClippableApp"),
});


group.add("Drag, Resize, Rotate with Clipped Area", {
    app: require("./ReactClippedAreaApp").default,
    path: require.resolve("./ReactClippedAreaApp"),
});


group.add("Clip & Snap", {
    app: require("./ReactClipSnapApp").default,
    path: require.resolve("./ReactClipSnapApp"),
});

group.add("keepRatio for both clippable and resizeable", {
    app: require("./ReactClippableResizableKeepRatioApp").default,
    path: require.resolve("./ReactClippableResizableKeepRatioApp"),
});
