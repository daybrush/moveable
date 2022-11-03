import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Moveable Settings", module);


group.add("Target with position: fixed;", {
    app: require("./ReactPositionFixedApp").default,
    path: require.resolve("./ReactPositionFixedApp"),
});

group.add("Select Form", {
    app: require("./ReactSelectFormApp").default,
    path: require.resolve("./ReactSelectFormApp"),
});

group.add("Static Body", {
    app: require("./ReactNoRelativeApp").default,
    path: require.resolve("./ReactNoRelativeApp"),
});
