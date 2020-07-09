import { number, text } from "@storybook/addon-knobs";

export const GROUP_PROPS = ["defaultGroupRotate", "defaultGroupOrigin"];

export const GROUP_PROPS_TEMPLATE = () => ({
    defaultGroupRotate: number("defaultGroupRotate", 0),
    defaultGroupOrigin: text("defaultGroupOrigin", "50% 50%"),
});
