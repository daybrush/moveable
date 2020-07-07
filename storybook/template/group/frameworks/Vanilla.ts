import { previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE } from "storybook-addon-preview";
import { IObject } from "@daybrush/utils";

export const GROUP_VANILLA_TEMPLATE = ({
    ableName,
    props,
    frame,
    events,
}: {
    ableName: string,
    props: any[],
    frame: any,
    events: IObject<any>,

}) => previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: [].slice.call(document.querySelectorAll(".target")),
    ${ableName}: true,
${DEFAULT_PROPS_TEMPLATE(props)}
});
let frames = [{
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 4 })}
}, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 4 })}
}, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 4 })}
}];
moveable${Object.keys(events).map(name => `.on("${name}", ${events[name](CODE_TYPE.ARROW)})`).join("")};
`;
