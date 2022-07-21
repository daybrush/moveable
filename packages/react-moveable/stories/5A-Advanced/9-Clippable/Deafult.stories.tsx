import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Clippable", module);


group.add("Clip & Snap", {
    app: require("./ReactClippableApp").default,
    text: require("!!raw-loader!./ReactClippableApp").default,
});

group.add("keepRatio for both clippable and resizeable", {
    app: require("./ReactClippableResizableKeepRatioApp").default,
    text: require("!!raw-loader!./ReactClippableResizableKeepRatioApp").default,
});
