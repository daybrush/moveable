import { add } from "../../utils/story";


export default {
    title: "Advacned Scalable",
};

export const AdvancedScalableMinMax = add("Scalable with min, max size", {
    app: require("./ReactScalableMinMaxApp").default,
    path: require.resolve("./ReactScalableMinMaxApp"),
});
