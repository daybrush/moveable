import {
    DEFAULT_RESIZABLE_CONTROLS,
    DEFAULT_ROTATABLE_CONTROLS,
    DEFAULT_DRAGGABLE_CONTROLS,
    DEFAULT_SCALABLE_CONTROLS,
} from "../controls/default";
import {
    DEFAULT_GROUPPABLE_GROUP_CONTROLS,
    DEFAULT_RESIZABLE_GROUP_CONTROLS,
    DEFAULT_SCALABLE_GROUP_CONTROLS,
} from "../controls/group";
import { makeStoryGroup } from "../utils/story";


const group = makeStoryGroup("Group", module);


group.add("Draggable & Resizable & Rotatable", {
    app: require("./ReactDraggableResizableRotatableApp").default,
    text: require("!!raw-loader!./ReactDraggableResizableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_RESIZABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_RESIZABLE_GROUP_CONTROLS,
    },
});
group.add("Draggable & Scalable & Rotatable", {
    app: require("./ReactDraggableScalableRotatableApp").default,
    text: require("!!raw-loader!./ReactDraggableScalableRotatableApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_SCALABLE_GROUP_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
    },
});


group.add("All in One", {
    app: require("./ReactAllInOneApp").default,
    text: require("!!raw-loader!./ReactAllInOneApp").default,
    argsTypes: {
        ...DEFAULT_GROUPPABLE_GROUP_CONTROLS,
        ...DEFAULT_DRAGGABLE_CONTROLS,
        ...DEFAULT_SCALABLE_CONTROLS,
        ...DEFAULT_ROTATABLE_CONTROLS,
    },
});
group.add("Multiple Group", {
    app: require("./ReactMultipleGroupApp").default,
    text: require("!!raw-loader!./ReactMultipleGroupApp").default,
});
