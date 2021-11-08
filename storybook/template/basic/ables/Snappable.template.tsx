import { boolean, number, array, object } from "@storybook/addon-knobs";

export const SNAPPABLE_PROPS = [
    "snappable",
];
export const SNAP_PROPS = [
    ...SNAPPABLE_PROPS,
    "verticalGuidelines",
    "horizontalGuidelines",
    "snapThreshold",
    "isDisplaySnapDigit",
    "snapGap",
    "snapDirections",
    "elementSnapDirections",
    "snapDigit",
];

export const BOUNDS_PROPS = [
    ...SNAPPABLE_PROPS,
    "bounds",
];
export const INNER_BOUNDS_PROPS = [
    ...SNAPPABLE_PROPS,
    "innerBounds",
];
export const SNAP_PROPS_TEMPLATE = () => ({
    snappable: boolean("snappable", true),
    verticalGuidelines: object("verticalGuidelines", [0, 200, 400]),
    horizontalGuidelines: object("horizontalGuidelines", [0, 200, 400]),
    snapThreshold: number("snapThreshold", 5),
    isDisplaySnapDigit: boolean("isDisplaySnapDigit", true),
    snapGap: boolean("snapGap", true),
    snapDirections: object("snapDirections", { top: true, right: true, bottom: true, left: true }),
    elementSnapDirections: object("elementSnapDirections", { top: true, right: true, bottom: true, left: true }),
    snapDigit: number("snapDigit", 0),
});

export const BOUNDS_PROPS_TEMPLATE = () => ({
    snappable: boolean("snappable", true),
    bounds: object("bounds", { left: 40, top: 40, right: 600, bottom: 430 }),
});

export const INNER_BOUNDS_PROPS_TEMPLATE = () => ({
    snappable: boolean("snappable", true),
    innerBounds: object("innerBounds", {
        left: 340,
        top: 240,
        width: 70,
        height: 70,
    }),
});
