import * as React from "react";
import Moveable from "react-moveable";
import { ROTATE_GROUP_START_TEMPLATE, ROTATE_GROUP_TEMPLATE } from "../events.template";
import { ROTATABLE_TEMPLATE_OPTIONS, ROTATABLE_PROPS } from "../../basic/ables/Rotatable.template";
import { GROUP_PROPS } from "./Groupable.template";
import { boolean } from "@storybook/addon-knobs";

export default function RotatableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frames] = React.useState([
        { translate: [0, 0], rotate: 0 },
        { translate: [0, 0], rotate: 0 },
        { translate: [0, 0], rotate: 0 },
    ]);
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement>(".target")!));
    }, []);

    const {
        rootChildren = d => d,
        description,
        children = [
            <div className="target target1">Target1</div>,
            <div className="target target2">Target2</div>,
            <div className="target target3">Target3</div>,
        ],
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
        {description}
        {children}
        <Moveable
            target={target}
            rotatable={true}
            {...moveableProps}
            onRotateGroupStart={e => {
                e.events.forEach((ev, i) => {
                    ev.set(frames[i].rotate);
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onRotateGroup={e => {
                e.events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;
                    frames[i].rotate = ev.beforeRotate;
                    ev.target.style.transform
                        = `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)`
                        + ` rotate(${ev.beforeRotate}deg)`;
                });
            }}
        />
    </div>);
}
export const GROUP_ROTATABLE_FRAME = {
    translate: [0, 0],
    rotate: 0,
};
export const GROUP_ROTATABLE_PROPS = [...GROUP_PROPS, "originDraggable", "originRelative", ...ROTATABLE_PROPS];
export const GROUP_ROTATABLE_TEMPLATE_OPTIONS = {
    ...ROTATABLE_TEMPLATE_OPTIONS,
    props: GROUP_ROTATABLE_PROPS,
    frame: GROUP_ROTATABLE_FRAME,
    events: {
        rotateGroupStart: ROTATE_GROUP_START_TEMPLATE,
        rotateGroup: ROTATE_GROUP_TEMPLATE,
    },
};

export const GROUP_ROTATABLE_PROPS_TEMPLATE = () => ({
    originDraggable: boolean("originDraggable", true),
    originRelative: boolean("originRelative", true),
});
