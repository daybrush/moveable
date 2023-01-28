import { DEFAULT_SCROLLABLE_CONTROLS } from "../controls/default";
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Support Scroll", module);


group.add("Use Scrollable", {
    app: require("./ReactScrollableApp").default,
    path: require.resolve("./ReactScrollableApp"),
    argsTypes: {
        ...DEFAULT_SCROLLABLE_CONTROLS,
    },
});

// group.add("Use Scrollable (Scroll)", {
//     app: require("./ReactScrollableScrollApp").default,
//     path: require.resolve("./ReactScrollableScrollApp"),
// });
