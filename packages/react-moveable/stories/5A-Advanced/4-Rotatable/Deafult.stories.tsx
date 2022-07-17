import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Rotatable", module);


group.add("rotate with custom origin", {
    app: require("./ReactCustomOriginApp").default,
    text: require("!!raw-loader!./ReactCustomOriginApp").default,
});
