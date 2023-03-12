import { add } from "../utils/story";



export default {
    title: "Support Tree Shaking",
};


export const TreeShaking = add("Use only Draggable, Resizable, Rotatable", {
    app: require("./TreeShakingApp").default,
    path: require.resolve("./TreeShakingApp"),
});
