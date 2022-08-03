
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Options", module);


group.add("useResizeObserver", {
    app: require("./ReactUseResizeObserverApp").default,
    text: require("!!raw-loader!./ReactUseResizeObserverApp").default,
});

group.add("useResizeObserver (Group)", {
    app: require("./ReactUseResizeObserverGroupApp").default,
    text: require("!!raw-loader!./ReactUseResizeObserverGroupApp").default,
});

group.add("useResizeObserver (Individual Group)", {
    app: require("./ReactUseResizeObserverIndividualGroupApp").default,
    text: require("!!raw-loader!./ReactUseResizeObserverIndividualGroupApp").default,
});


group.add("checkInput option", {
    app: require("./ReactCheckInputApp").default,
    text: require("!!raw-loader!./ReactCheckInputApp").default,
});