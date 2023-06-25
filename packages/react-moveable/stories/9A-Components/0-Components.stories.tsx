import { add } from "../utils/story";


export default {
    title: "Combination with Other Components",
};

export const ComponentsSelecto = add("Use Selecto", {
    app: require("./ReactSelectoApp").default,
    path: require.resolve("./ReactSelectoApp"),
});

export const ComponentsSelectoWithMultipleGroup = add("Use Selecto with Multiple Group", {
    app: require("./ReactSelectoMultipleGroupApp").default,
    path: require.resolve("./ReactSelectoMultipleGroupApp"),
});

export const ComponentsSelectoWithGroupUngroup = add("Use Selecto with Group & Ungroup", {
    app: require("./ReactSelectoMultipleGroupUngroupApp").default,
    path: require.resolve("./ReactSelectoMultipleGroupUngroupApp"),
});


export const ComponentsSelectoWithNestedGroup = add("Use Selecto with Nested Group", {
    app: require("./ReactSelectoNestedGroupApp").default,
    path: require.resolve("./ReactSelectoNestedGroupApp"),
});





export const ComponentsInfiniteViewer = add("Use Infinite Viewer", {
    app: require("./ReactInfiniteViewerApp").default,
    path: require.resolve("./ReactInfiniteViewerApp"),
});
