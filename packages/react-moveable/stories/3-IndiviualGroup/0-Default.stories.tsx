import {
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Individual Group", module);


group.add("Draggable & Scalable & Rotatable", {
    app: require("./ReactDraggableScalableRotatableApp").default,
    path: require.resolve("./ReactDraggableScalableRotatableApp"),
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

group.add("Use Individual Groupable Props", {
    app: require("./ReactIndividualGroupablePropsApp").default,
    path: require.resolve("./ReactIndividualGroupablePropsApp"),
});
