import {
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import { makeGroup } from "../utils/story";


export default {
    title: "Individual Group",
};


const { add } = makeGroup("3-IndividualGroup");


export const IndividualGroupDraggableScalableRotatable = add("Draggable & Scalable & Rotatable", {
    appName: "ReactDraggableScalableRotatableApp",
    app: require("./react/ReactDraggableScalableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});

export const IndividualGroupGroupableProps = add("Use Individual Groupable Props", {
    appName: "ReactIndividualGroupablePropsApp",
    app: require("./react/ReactIndividualGroupablePropsApp").default,
});
