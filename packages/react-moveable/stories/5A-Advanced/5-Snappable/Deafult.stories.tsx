import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Snappable", module);


group.add("Guidelines with custom styles", {
    app: require("./ReactCustomGuidelinesApp").default,
    path: require.resolve("./ReactCustomGuidelinesApp"),
});

group.add("Element Guidelines with custom styles", {
    app: require("./ReactCustomElementGuidelinesApp").default,
    path: require.resolve("./ReactCustomElementGuidelinesApp"),
});
