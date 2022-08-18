import { makeStoryGroup } from "../utils/story";
import "../common.css";
import "../templates/default.css";
import { SCALE_CONTROLS, DEFAULT_DRAGGABLE_CONTROLS } from "../controls/default";

const group = makeStoryGroup("SVG", module);


group.add("Draggable(SVGPathElement)", {
    app: require("./apps/ReactPathDraggableApp").default,
    text: require("!!raw-loader!./apps/ReactPathDraggableApp").default,
    argsTypes: {
        ...SCALE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});
group.add("Draggable(SVGSVGElement)", {
    app: require("./apps/ReactSVGDraggableApp").default,
    text: require("!!raw-loader!./apps/ReactSVGDraggableApp").default,
    argsTypes: {
        ...SCALE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

group.add("Draggable & Rotatable(Circle)", {
    app: require("./apps/ReactSVGDraggableRotatableApp").default,
    text: require("!!raw-loader!./apps/ReactSVGDraggableRotatableApp").default,
});

group.add("SVGElement with G tag", {
    app: require("./apps/ReactSVGGApp").default,
    text: require("!!raw-loader!./apps/ReactSVGGApp").default,
});

group.add("SVGElement with target G tag", {
    app: require("./apps/ReactSVGTargetGApp").default,
    text: require("!!raw-loader!./apps/ReactSVGTargetGApp").default,
});