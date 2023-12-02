import { add } from "../utils/story";
import "../common.css";
import "../templates/default.css";
import { expect } from "@storybook/jest";
import { wait } from "../utils/testing";

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


export const SVGGroup = add("SVG Group", {
    app: require("./ReactSVGGroupApp").default,
    text: require("!!raw-loader!./ReactSVGGroupApp").default,
    play: async ({ canvasElement }) => {
        await wait();

        const area = canvasElement.querySelector<HTMLElement>(".moveable-area")!;

        expect(area.style.width).toBe("191px");
        expect(area.style.height).toBe("57px");
        expect(area.style.transform).toBe("translate(0px, 0px) rotate(0deg) scale(1, 1)");
    },
});


export const SVGOrigin = add("SVGPathElement with center origin", {
    app: require("./ReactOriginApp").default,
    text: require("!!raw-loader!./ReactOriginApp").default,
});


export const SVGFillboxOrigin = add("SVGPathElement with center origin and transform fill-box", {
    app: require("./ReactOriginFillboxApp").default,
    text: require("!!raw-loader!./ReactOriginFillboxApp").default,
});




export const SVGForeignObject = add("SVGForeignObject", {
    app: require("./ReactSVGForeignObjectApp").default,
    text: require("!!raw-loader!./ReactSVGForeignObjectApp").default,
});


export const SVGForeignObjectInner = add("SVGForeignObject div", {
    app: require("./ReactSVGForeignObjectInnerApp").default,
    text: require("!!raw-loader!./ReactSVGForeignObjectInnerApp").default,
});
