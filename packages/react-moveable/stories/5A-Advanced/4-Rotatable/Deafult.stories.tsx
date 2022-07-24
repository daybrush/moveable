import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Rotatable", module);


group.add("rotate with custom origin", {
    app: require("./ReactCustomOriginApp").default,
    text: require("!!raw-loader!./ReactCustomOriginApp").default,
});
group.add("rotate with direction controls", {
    app: require("./ReactRotateWithControlsApp").default,
    text: require("!!raw-loader!./ReactRotateWithControlsApp").default,
});
group.add("rotate with resize", {
    app: require("./ReactRotateWithResizeApp").default,
    text: require("!!raw-loader!./ReactRotateWithResizeApp").default,
});
