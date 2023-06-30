import { add } from "../utils/story";
import "../common.css";
import "../templates/default.css";
import { expect } from "@storybook/jest";
import { wait } from "../utils/testing";

export default {
    title: "SVG",
};

export const SVGPathElement = add("SVGPathElement", {
    appName: "ReactPathApp",
    app: require("./react/ReactPathApp").default,
});
export const SVGSVGElement = add("SVGSVGElement", {
    appName: "ReactSVGSVGApp",
    app: require("./react/ReactSVGSVGApp").default,
});

export const SVGCircle = add("Circle", {
    appName: "ReactSVGCircleApp",
    app: require("./react/ReactSVGCircleApp").default,
});

export const SVGLine = add("Line", {
    appName: "ReactSVGLineApp",
    app: require("./react/ReactSVGLineApp").default,
});

export const SVGG = add("SVGElement with G tag", {
    appName: "ReactSVGGApp",
    app: require("./react/ReactSVGGApp").default,
});

export const SVGTargetG = add("SVGElement with target G tag", {
    appName: "ReactSVGTargetGApp",
    app: require("./react/ReactSVGTargetGApp").default,
});


export const SVGGroup = add("SVG Group", {
    appName: "ReactSVGGroupApp",
    app: require("./react/ReactSVGGroupApp").default,
    play: async ({ canvasElement }) => {
        await wait();

        const area = canvasElement.querySelector<HTMLElement>(".moveable-area")!;

        expect(area.style.width).toBe("191px");
        expect(area.style.height).toBe("57px");
        expect(area.style.transform).toBe("translate(0px, 0px) rotate(0deg) scale(1, 1)");
    },
});


export const SVGOrigin = add("SVGPathElement with center origin", {
    appName: "ReactOriginApp",
    app: require("./react/ReactOriginApp").default,
});
