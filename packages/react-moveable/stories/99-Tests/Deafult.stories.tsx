import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Test Codes", module);


group.add("Select .moveable-area", {
    app: require("./ReactGroupDragAreaApp").default,
    text: require("!!raw-loader!./ReactGroupDragAreaApp").default,
});
