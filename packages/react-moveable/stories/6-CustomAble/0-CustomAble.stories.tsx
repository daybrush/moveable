import { add } from "../utils/story";

export default {
    title: "Make Custom Able",
};

export const CustomAbleDimensionViewable = add("DimensionViewable", {
    app: require("./ReactDimensionViewableApp").default,
    path: require.resolve("./ReactDimensionViewableApp"),
});

export const CustomAbleEditable = add("Editable", {
    app: require("./ReactEditableApp").default,
    path: require.resolve("./ReactEditableApp"),
});

export const CustomAbleRotatble = add("Custom Rotatable", {
    app: require("./ReactCustomRotatableApp").default,
    path: require.resolve("./ReactCustomRotatableApp"),
});

export const CustomAbleMouseEnterLeave = add("Mouse Enter & Leave", {
    app: require("./ReactMouseEnterLeaveApp").default,
    path: require.resolve("./ReactMouseEnterLeaveApp"),
});


export const CustomAbleDragTarget = add("DragTarget", {
    app: require("./ReactDragTargetAbleApp").default,
    path: require.resolve("./ReactDragTargetAbleApp"),
});
