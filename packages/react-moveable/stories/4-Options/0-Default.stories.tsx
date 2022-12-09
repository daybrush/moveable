
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Options", module);


group.add("useResizeObserver", {
    app: require("./ReactUseResizeObserverApp").default,
    path: require.resolve("./ReactUseResizeObserverApp"),
});

group.add("useResizeObserver (Group)", {
    app: require("./ReactUseResizeObserverGroupApp").default,
    path: require.resolve("./ReactUseResizeObserverGroupApp"),
});

group.add("useResizeObserver (Individual Group)", {
    app: require("./ReactUseResizeObserverIndividualGroupApp").default,
    path: require.resolve("./ReactUseResizeObserverIndividualGroupApp"),
});


group.add("checkInput", {
    app: require("./ReactCheckInputApp").default,
    path: require.resolve("./ReactCheckInputApp"),
});

group.add("viewContainer (Cursor is applied in viewer during dragging)", {
    app: require("./ReactViewContainerApp").default,
    path: require.resolve("./ReactViewContainerApp"),
});



group.add("persistData (First render with persisted data)", {
    app: require("./ReactPersistDataApp").default,
    path: require.resolve("./ReactPersistDataApp"),
});

group.add("persistData (First render with persisted data, group)", {
    app: require("./ReactGroupPersistDataApp").default,
    path: require.resolve("./ReactGroupPersistDataApp"),
});


group.add("persistData (First render with persisted data, individual group)", {
    app: require("./ReactIndividualGroupPersistDataApp").default,
    path: require.resolve("./ReactIndividualGroupPersistDataApp"),
});

group.add("rootContainer (css transformed container)", {
    app: require("./ReactTransformedApp").default,
    path: require.resolve("./ReactTransformedApp"),
});

group.add("rootContainer (css zoomed container)", {
    app: require("./ReactZoomApp").default,
    path: require.resolve("./ReactZoomApp"),
});
group.add("useAccuratePosition (Render in a more accurate position)", {
    app: require("./ReactUseAccuratePositionApp").default,
    path: require.resolve("./ReactUseAccuratePositionApp"),
});
