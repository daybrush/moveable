import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Resizable", module);


group.add("Resizable & Scalable with fixed direction", {
    app: require("./ReactFixedDirectionApp").default,
    path: require.resolve("./ReactFixedDirectionApp"),
});

group.add("Resizable with display: flex", {
    app: require("./ReactFlexApp").default,
    path: require.resolve("./ReactFlexApp"),
});

group.add("Limit Sizes with Group", {
    app: require("./ReactGroupMinSizeApp").default,
    path: require.resolve("./ReactGroupMinSizeApp"),
});

group.add("Using Edges and Controls with Draggable, Resizable, and Scalable", {
    app: require("./ReactWithEdgeControlApp").default,
    path: require.resolve("./ReactWithEdgeControlApp"),
});
