import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Test Codes", module);


group.add("No Target", {
    app: require("./ReactNoTargetApp").default,
    text: require("!!raw-loader!./ReactNoTargetApp").default,
});
group.add("Click a tag", {
    app: require("./ReactATagApp").default,
    text: require("!!raw-loader!./ReactATagApp").default,
});
group.add("Limit Sizes with Group", {
    app: require("./ReactGroupMinSizeApp").default,
    text: require("!!raw-loader!./ReactGroupMinSizeApp").default,
});
group.add("Any native input element", {
    app: require("./ReactInputApp").default,
    text: require("!!raw-loader!./ReactInputApp").default,
});
group.add("Test Control Box in Safari", {
    app: require("./ReactSafariApp").default,
    text: require("!!raw-loader!./ReactSafariApp").default,
});
