import { add } from "../../utils/story";


export default {
    title: "Advanced Rotatable",
};

export const AdvancedRotatableCustomOrigin = add("rotate with custom origin", {
    app: require("./ReactCustomOriginApp").default,
    path: require.resolve("./ReactCustomOriginApp"),
});

export const AdvancedRotatableRotateWithControls = add("rotate with direction controls", {
    app: require("./ReactRotateWithControlsApp").default,
    path: require.resolve("./ReactRotateWithControlsApp"),
});

export const AdvancedRotatableRotateWithResize = add("rotate with resize", {
    app: require("./ReactRotateWithResizeApp").default,
    path: require.resolve("./ReactRotateWithResizeApp"),
});
