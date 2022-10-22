import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Rotatable", module);


group.add("rotate with custom origin", {
    app: require("./ReactCustomOriginApp").default,
    path: require.resolve("./ReactCustomOriginApp"),
});
group.add("rotate with direction controls", {
    app: require("./ReactRotateWithControlsApp").default,
    path: require.resolve("./ReactRotateWithControlsApp"),
});
group.add("rotate with resize", {
    app: require("./ReactRotateWithResizeApp").default,
    path: require.resolve("./ReactRotateWithResizeApp"),
});
