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
    hideDefaultLines: makeArgType({
        type: "boolean",
        description: makeLink("Moveable", "hideDefaultLines"),
        defaultValue: false,
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
    edge: makeArgType({
        type: "array",
        description: makeLink("Resizable", "edge"),
        defaultValue: [],
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
        defaultValue: 1,
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
                "none",
            ],
        },
    }),
};
export const DEFAULT_WARPABLE_CONTROLS = {
    warpable: makeArgType({
        type: "boolean",
        description: makeLink("Warpable", "warpable"),
        defaultValue: true,
    }),
    renderDirections: makeArgType({
        type: "array",
        description: makeLink("Warpable", "renderDirections"),
        defaultValue: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
    }),
};

export const DEFAULT_SNAPPABLE_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    snapDirections: makeArgType({
        type: "object",
        description: makeLink("Snappable", "snapDirections"),
        defaultValue: { top: true, left: true, bottom: true, right: true },
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
    snapDirections: makeArgType({
        type: "object",
        description: makeLink("Snappable", "snapDirections"),
        defaultValue: { top: true, left: true, bottom: true, right: true, center: true, middle: true },
    }),
    elementSnapDirections: makeArgType({
        type: "object",
        description: makeLink("Snappable", "elementSnapDirections"),
        defaultValue: { top: true, left: true, bottom: true, right: true, center: true, middle: true },
    }),
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
    isDisplayInnerSnapDigit: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "isDisplayInnerSnapDigit"),
        defaultValue: false,
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

export const DEFAULT_SNAP_CONTAINER_CONTROLS = {
    snapContainer: makeArgType({
        type: "text",
        description: makeLink("Snappable", "snapContainer"),
        defaultValue: ".snapContainer",
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
        defaultValue: { left: 0, top: 0, right: 0, bottom: 0, position: "css" },
    }),
};
export const DEFAULT_INNER_BOUNDS_CONTROLS = {
    snappable: makeArgType({
        type: "boolean",
        description: makeLink("Snappable", "snappable"),
        defaultValue: true,
    }),
    innerBounds: makeArgType({
        type: "object",
        description: makeLink("Snappable", "innerBounds"),
        defaultValue: { left: 0, top: 0, width: 100, height: 100 },
    }),
};



export const DEFAULT_ORIGIN_DRAGGABLE_CONTROLS = {
    originDraggable: makeArgType({
        type: "boolean",
        description: makeLink("OriginDraggable", "originDraggable"),
        defaultValue: true,
    }),
    originRelative: makeArgType({
        type: "boolean",
        description: makeLink("OriginDraggable", "originRelative"),
        defaultValue: true,
    }),
};


export const DEFAULT_CLIPPABLE_CONTROLS = {
    clippable: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "clippable"),
        defaultValue: true,
    }),
    clipRelative: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "clipRelative"),
        defaultValue: false,
    }),
    clipArea: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "clipArea"),
        defaultValue: false,
    }),
    dragWithClip: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "dragWithClip"),
        defaultValue: 0,
    }),
    defaultClipPath: makeArgType({
        type: "inline-radio",
        description: makeLink("Clippable", "defaultClipPath"),
        defaultValue: "inset",
        control: {
            options: [
                "circle",
                "inset",
                "ellipse",
                "rect",
                "polygon",
            ],
        },
    }),
    clipTargetBounds: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "clipTargetBounds"),
        defaultValue: false,
    }),
    keepRatio: makeArgType({
        type: "boolean",
        description: makeLink("Clippable", "keepRatio"),
        defaultValue: false,
    }),
};
