import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Resizable", module);


group.add("Resizable & Scalable with fixed direction", {
    app: require("./ReactFixedDirectionApp").default,
    text: require("!!raw-loader!./ReactFixedDirectionApp").default,
});

group.add("Resizable with display: flex", {
    app: require("./ReactFlexApp").default,
    text: require("!!raw-loader!./ReactFlexApp").default,
});

group.add("Limit Sizes with Group", {
    app: require("./ReactGroupMinSizeApp").default,
    text: require("!!raw-loader!./ReactGroupMinSizeApp").default,
});

group.add("Using Edges and Controls with Draggable, Resizable, and Scalable", {
    app: require("./ReactWithEdgeControlApp").default,
    text: require("!!raw-loader!./ReactWithEdgeControlApp").default,
});
