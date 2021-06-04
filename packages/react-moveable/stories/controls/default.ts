import { makeArgType, makeLink } from "../utils";

export const SCALE_CONTROLS = {
    "containerScale": makeArgType({
        type: "number",
        description: "container's scale",
        defaultValue: 1,
    }),
};

export const DEFAULT_CONTROLS = {
    padding: makeArgType({
        type: "object",
        description: makeLink("Moveable", "padding"),
        defaultValue: { left: 0, top: 0, right: 0, bottom: 0 },
    }),
};

export const DEFAULT_DRAGGABLE_CONTROLS = {
    draggable: makeArgType({
        type: "boolean",
        description: makeLink("Draggable", "draggable"),
        defaultValue: true,
    }),
    throttleDrag: makeArgType({
        type: "number",
        description: makeLink("Draggable", "throttleDrag"),
        defaultValue: 1,
    }),
    edgeDraggable: makeArgType({
        type: "boolean",
        description: makeLink("Draggable", "edgeDraggable"),
        defaultValue: false,
    }),
    throttleDragRotate: makeArgType({
        type: "number",
        description: makeLink("Draggable", "throttleDragRotate"),
        defaultValue: 0,
    }),
    startDragRotate: makeArgType({
        type: "number",
        description: makeLink("Draggable", "startDragRotate"),
        defaultValue: 0,
    }),
};

export const DEFAULT_RESIZABLE_CONTROLS = {
    resizable: makeArgType({
        type: "boolean",
        description: makeLink("Resizable", "resizable"),
        defaultValue: true,
    }),
    maxWidth: makeArgType({
        type: "text",
        description: makeLink("Resizable", "OnResizeStart"),
        defaultValue: "auto",
    }),
    maxHeight: makeArgType({
        type: "text",
        description: makeLink("Resizable", "OnResizeStart"),
        defaultValue: "auto",
    }),
    minWidth: makeArgType({
        type: "text",
        description: makeLink("Resizable", "OnResizeStart"),
        defaultValue: "auto",
    }),
    minHeight: makeArgType({
        type: "text",
        description: makeLink("Resizable", "OnResizeStart"),
        defaultValue: "auto",
    }),
    keepRatio: makeArgType({
        type: "boolean",
        description: makeLink("Resizable", "keepRatio"),
        defaultValue: false,
    }),
    throttleResize: makeArgType({
        type: "number",
        description: makeLink("Resizable", "throttleResize"),
        defaultValue: 0,
    }),
    renderDirections: makeArgType({
        type: "array",
        description: makeLink("Resizable", "renderDirections"),
        defaultValue: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
    }),
};

export const DEFAULT_SCALABLE_CONTROLS = {
    scalable: makeArgType({
        type: "boolean",
        description: makeLink("Scalable", "scalable"),
        defaultValue: true,
    }),
    keepRatio: makeArgType({
        type: "boolean",
        description: makeLink("Scalable", "keepRatio"),
        defaultValue: false,
    }),
    throttleScale: makeArgType({
        type: "number",
        description: makeLink("Scalable", "throttleScale"),
        defaultValue: 0,
    }),
    renderDirections: makeArgType({
        type: "array",
        description: makeLink("Scalable", "renderDirections"),
        defaultValue: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
    }),
};

export const DEFAULT_ROTATABLE_CONTROLS = {
    rotatable: makeArgType({
        type: "boolean",
        description: makeLink("Rotatable", "rotatable"),
        defaultValue: true,
    }),
    throttleRotate: makeArgType({
        type: "number",
        description: makeLink("Rotatable", "throttleRotate"),
        defaultValue: 0,
    }),
    rotationPosition: makeArgType({
        type: "inline-radio",
        description: makeLink("Rotatable", "rotationPosition"),
        defaultValue: "top",
        control: {
            options: [
                "top",
                "left",
                "right",
                "bottom",
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "left-top",
                "right-top",
                "left-bottom",
                "right-bottom",
            ],
        },
    }),
};
// snapCenter: Boolean,
// snapHorizontal: Boolean,
// snapVertical: Boolean,
// snapElement: Boolean,
// snapGap: Boolean,
// snapGridWidth: Number,
// snapGridHeight: Number,
// isDisplaySnapDigit: Boolean,
// snapDigit: Number,
// snapThreshold: Number,
// horizontalGuidelines: Array,
// verticalGuidelines: Array,
// elementGuidelines: Array,

export const DEFAULT_SNAPPABLE_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    snapCenter: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snapCenter"),
        defaultValue: false,
    }),
    snapHorizontal: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snapHorizontal"),
        defaultValue: true,
    }),
    snapVertical: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snapVertical"),
        defaultValue: true,
    }),
    snapThreshold: makeArgType({
        type: "number",
        description: makeLink("Snappable", "snapThreshold"),
        defaultValue: 5,
    }),
};
export const DEFAULT_SNAPPABLE_GUIDELINES_CONTROLS = {
    verticalGuidelines: makeArgType({
        type: "object",
        description: makeLink("Snappable", "verticalGuidelines"),
        defaultValue: [0, 100, 200, 400, 500],
    }),
    horizontalGuidelines: makeArgType({
        type: "object",
        description: makeLink("Snappable", "horizontalGuidelines"),
        defaultValue: [0, 100, 200, 400, 500],
    }),
};
export const DEFAULT_SNAPPABLE_ELEMENTS_CONTROLS = {
    snapGap: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snapGap"),
        defaultValue: true,
    }),
    isDisplaySnapDigit: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "isDisplaySnapDigit"),
        defaultValue: true,
    }),
    snapDigit: makeArgType({
        type: "number",
        description: makeLink("Snappable", "snapDigit"),
        defaultValue: 0,
    }),
};
export const DEFAULT_SNAP_GRID_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    snapGridWidth: makeArgType({
        type: "number",
        description: makeLink("Snappable", "snapGridWidth"),
        defaultValue: 10,
    }),
    snapGridHeight: makeArgType({
        type: "number",
        description: makeLink("Snappable", "snapGridHeight"),
        defaultValue: 10,
    }),
};
export const DEFAULT_BOUNDS_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    bounds: makeArgType({
        type: "object",
        description: makeLink("Snappable", "bounds"),
        defaultValue: { left: 0, top: 0, right: 500, bottom: 500 },
    }),
};
export const DEFAULT_INNER_BOUNDS_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    bounds: makeArgType({
        type: "object",
        description: makeLink("Snappable", "bounds"),
        defaultValue: { left: 0, top: 0, right: 500, bottom: 500 },
    }),
};
