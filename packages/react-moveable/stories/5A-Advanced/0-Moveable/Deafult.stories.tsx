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

group.add("Cursor is applied in viewer during dragging.", {
    app: require("./ReactViewContainerApp").default,
    path: require.resolve("./ReactViewContainerApp"),
});
