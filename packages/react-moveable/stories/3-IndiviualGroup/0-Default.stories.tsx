import {
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { add } from "../utils/story";


export default {
    title: "Individual Group",
};

export const IndividualGroupDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    app: require("./ReactDraggableScalableRotatableApp").default,
    path: require.resolve("./ReactDraggableScalableRotatableApp"),
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

export const IndividualGroupGroupableProps = add("Use Individual Groupable Props", {
    app: require("./ReactIndividualGroupablePropsApp").default,
    path: require.resolve("./ReactIndividualGroupablePropsApp"),
});
