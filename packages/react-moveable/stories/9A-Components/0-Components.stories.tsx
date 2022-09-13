import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Combination with Other Components", module);


group.add("Use Selecto", {
    app: require("./ReactSelectoApp").default,
    text: require("!!raw-loader!./ReactSelectoApp").default,
});

group.add("Use Selecto with Multiple Group", {
    app: require("./ReactSelectoMultipleGroupApp").default,
    text: require("!!raw-loader!./ReactSelectoMultipleGroupApp").default,
});
