import { add } from "../../utils/story";


export default {
    title: "Adavanced Clippable",
};

export const AdvancedClippable = add("Clippable with Drag, Resize, Rotate", {
    app: require("./ReactClippableApp").default,
    path: require.resolve("./ReactClippableApp"),
});


export const AdvancedClippableClippedArea = add("Drag, Resize, Rotate with Clipped Area (Testing)", {
    app: require("./ReactClippedAreaApp").default,
    path: require.resolve("./ReactClippedAreaApp"),
});


export const AdvancedClippableClipSnap = add("Clip & Snap", {
    app: require("./ReactClipSnapApp").default,
    path: require.resolve("./ReactClipSnapApp"),
});

export const AdvancedClippableResizableKeepRatio = add("keepRatio for both clippable and resizeable", {
    app: require("./ReactClippableResizableKeepRatioApp").default,
    path: require.resolve("./ReactClippableResizableKeepRatioApp"),
});
