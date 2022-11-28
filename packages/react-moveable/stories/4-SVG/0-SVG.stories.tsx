import { makeStoryGroup } from "../utils/story";
import "../common.css";
import "../templates/default.css";

const group = makeStoryGroup("SVG", module);


group.add("SVGPathElement", {
    app: require("./ReactPathApp").default,
    text: require("!!raw-loader!./ReactPathApp").default,
});
group.add("SVGSVGElement", {
    app: require("./ReactSVGSVGApp").default,
    text: require("!!raw-loader!./ReactSVGSVGApp").default,
});

group.add("Circle", {
    app: require("./ReactSVGCircleApp").default,
    text: require("!!raw-loader!./ReactSVGCircleApp").default,
});

group.add("Line", {
    app: require("./ReactSVGLineApp").default,
    text: require("!!raw-loader!./ReactSVGLineApp").default,
});

group.add("SVGElement with G tag", {
    app: require("./ReactSVGGApp").default,
    text: require("!!raw-loader!./ReactSVGGApp").default,
});

group.add("SVGElement with target G tag", {
    app: require("./ReactSVGTargetGApp").default,
    text: require("!!raw-loader!./ReactSVGTargetGApp").default,
});
