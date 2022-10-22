import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Clippable", module);


group.add("Clip & Snap", {
    app: require("./ReactClippableApp").default,
    path: require.resolve("./ReactClippableApp"),
});

group.add("keepRatio for both clippable and resizeable", {
    app: require("./ReactClippableResizableKeepRatioApp").default,
    path: require.resolve("./ReactClippableResizableKeepRatioApp"),
});
