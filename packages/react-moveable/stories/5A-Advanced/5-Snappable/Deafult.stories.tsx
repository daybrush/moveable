import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Snappable", module);


group.add("Guidelines with custom styles", {
    app: require("./ReactCustomGuidelinesApp").default,
    text: require("!!raw-loader!./ReactCustomGuidelinesApp").default,
});
