import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Combination with Other Components", module);


group.add("Use Selecto", {
    app: require("./ReactSelectoApp").default,
    path: require.resolve("./ReactSelectoApp"),
});

group.add("Use Selecto with Multiple Group", {
    app: require("./ReactSelectoMultipleGroupApp").default,
    path: require.resolve("./ReactSelectoMultipleGroupApp"),
});


group.add("Use Infinite Viewer", {
    app: require("./ReactInfiniteViewerApp").default,
    path: require.resolve("./ReactInfiniteViewerApp"),
});
