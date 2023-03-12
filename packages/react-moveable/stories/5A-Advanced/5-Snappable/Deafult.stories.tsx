import { add } from "../../utils/story";


export default {
    title: "Advanced Snappable",
};

export const AdvancedSnappableCustomGuidelines = add("Guidelines with custom styles", {
    app: require("./ReactCustomGuidelinesApp").default,
    path: require.resolve("./ReactCustomGuidelinesApp"),
});

export const AdvancedSnappableCustomElementGuidelines = add("Element Guidelines with custom styles", {
    app: require("./ReactCustomElementGuidelinesApp").default,
    path: require.resolve("./ReactCustomElementGuidelinesApp"),
});
