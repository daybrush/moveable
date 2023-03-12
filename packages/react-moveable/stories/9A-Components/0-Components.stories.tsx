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


export const ComponentsInfiniteViewer = add("Use Infinite Viewer", {
    app: require("./ReactInfiniteViewerApp").default,
    path: require.resolve("./ReactInfiniteViewerApp"),
});
