import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Make Custom Able", module);


group.add("DimensionViewable", {
    app: require("./ReactDimensionViewableApp").default,
    path: require.resolve("./ReactDimensionViewableApp"),
});

group.add("Editable", {
    app: require("./ReactEditableApp").default,
    path: require.resolve("./ReactEditableApp"),
});

group.add("Custom Rotatable", {
    app: require("./ReactCustomRotatableApp").default,
    path: require.resolve("./ReactCustomRotatableApp"),
});

group.add("Mouse Enter & Leave", {
    app: require("./ReactMouseEnterLeaveApp").default,
    path: require.resolve("./ReactMouseEnterLeaveApp"),
});
