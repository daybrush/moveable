import { DEFAULT_SCROLLABLE_CONTROLS } from "../controls/default";
import { add } from "../utils/story";

export default {
    title: "Support Scroll",
};

export const ScrollingScrollable = add("Use Scrollable", {
    app: require("./ReactScrollableApp").default,
    path: require.resolve("./ReactScrollableApp"),
    argsTypes: {
        ...DEFAULT_SCROLLABLE_CONTROLS,
    },
});
