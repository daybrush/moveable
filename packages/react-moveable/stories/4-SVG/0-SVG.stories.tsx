import { add } from "../utils/story";
import "../common.css";
import "../templates/default.css";

export default {
    title: "SVG",
};

export const SVGPathElement = add("SVGPathElement", {
    app: require("./ReactPathApp").default,
    text: require("!!raw-loader!./ReactPathApp").default,
});
export const SVGSVGElement = add("SVGSVGElement", {
    app: require("./ReactSVGSVGApp").default,
    text: require("!!raw-loader!./ReactSVGSVGApp").default,
});

export const SVGCircle = add("Circle", {
    app: require("./ReactSVGCircleApp").default,
    text: require("!!raw-loader!./ReactSVGCircleApp").default,
});

export const SVGLine = add("Line", {
    app: require("./ReactSVGLineApp").default,
    text: require("!!raw-loader!./ReactSVGLineApp").default,
});

export const SVGG = add("SVGElement with G tag", {
    app: require("./ReactSVGGApp").default,
    text: require("!!raw-loader!./ReactSVGGApp").default,
});

export const SVGTargetG = add("SVGElement with target G tag", {
    app: require("./ReactSVGTargetGApp").default,
    text: require("!!raw-loader!./ReactSVGTargetGApp").default,
});


export const SVGOrigin = add("SVGPathElement with center origin", {
    app: require("./ReactOriginApp").default,
    text: require("!!raw-loader!./ReactOriginApp").default,
});
