import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Test Codes", module);


group.add("Select .moveable-area", {
    app: require("./ReactGroupDragAreaApp").default,
    text: require("!!raw-loader!./ReactGroupDragAreaApp").default,
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
