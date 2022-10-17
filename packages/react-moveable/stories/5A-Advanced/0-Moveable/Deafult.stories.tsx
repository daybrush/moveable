import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Moveable Settings", module);


group.add("Target with position: fixed;", {
    app: require("./ReactPositionFixedApp").default,
    text: require("!!raw-loader!./ReactPositionFixedApp").default,
});

group.add("Select Form", {
    app: require("./ReactSelectFormApp").default,
    text: require("!!raw-loader!./ReactSelectFormApp").default,
});

group.add("Cursor is applied in viewer during dragging.", {
    app: require("./ReactViewContainerApp").default,
    text: require("!!raw-loader!./ReactViewContainerApp").default,
});
