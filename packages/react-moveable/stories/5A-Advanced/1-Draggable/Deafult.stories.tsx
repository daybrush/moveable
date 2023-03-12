import { add } from "../../utils/story";


export default {
    title: "advanced Draggable",
};

export const AdvancedDraggableEdgeDraggable = add("edgeDraggable with edge", {
    app: require("./ReactEdgeDraggableWithEdgeApp").default,
    path: require.resolve("./ReactEdgeDraggableWithEdgeApp"),
});
