import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Resizable", module);


group.add("Resizable & Scalable with fixed direction", {
    app: require("./ReactFixedDirectionApp").default,
    text: require("!!raw-loader!./ReactFixedDirectionApp").default,
});

group.add("Resizable with display: flex", {
    app: require("./ReactFlexApp").default,
    text: require("!!raw-loader!./ReactFlexApp").default,
});
