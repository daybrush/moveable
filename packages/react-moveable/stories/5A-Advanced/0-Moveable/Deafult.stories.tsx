import { add } from "../../utils/story";

export default {
    title: "Advanced Moveable Settings",
};

export const AdancedMoveablePositionFixed = add("Target with position: fixed;", {
    app: require("./ReactPositionFixedApp").default,
    path: require.resolve("./ReactPositionFixedApp"),
});

export const AdancedMoveableSelectForm = add("Select Form", {
    app: require("./ReactSelectFormApp").default,
    path: require.resolve("./ReactSelectFormApp"),
});

export const AdancedMoveableNoRelative = add("Static Body", {
    app: require("./ReactNoRelativeApp").default,
    path: require.resolve("./ReactNoRelativeApp"),
});
