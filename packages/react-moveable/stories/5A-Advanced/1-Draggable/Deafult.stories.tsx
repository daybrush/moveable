import { makeStoryGroup } from "../../utils/story";


const group = makeStoryGroup("Advanced Draggable", module);


group.add("edgeDraggable with edge", {
    app: require("./ReactEdgeDraggableWithEdgeApp").default,
    path: require.resolve("./ReactEdgeDraggableWithEdgeApp"),
});
