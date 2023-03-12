import { add } from "../../utils/story";


export default {
    title: "Advacned Resizable",
};

export const AdvancedResizableFixedDirection = add("Resizable & Scalable with fixed direction", {
    app: require("./ReactFixedDirectionApp").default,
    path: require.resolve("./ReactFixedDirectionApp"),
});

export const AdvancedResizableFlex = add("Resizable with display: flex", {
    app: require("./ReactFlexApp").default,
    path: require.resolve("./ReactFlexApp"),
});

export const AdvancedResizableGroupMinSize = add("Limit Sizes with Group", {
    app: require("./ReactGroupMinSizeApp").default,
    path: require.resolve("./ReactGroupMinSizeApp"),
});

export const AdvancedResizableEdgeControl = add("Using Edges and Controls with Draggable, Resizable, and Scalable", {
    app: require("./ReactWithEdgeControlApp").default,
    path: require.resolve("./ReactWithEdgeControlApp"),
});
