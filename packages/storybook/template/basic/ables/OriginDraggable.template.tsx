import * as React from "react";
import Moveable from "react-moveable";
import {
    DRAG_ORIGIN_RENDER_TEMPLATE, DRAG_ORIGIN_START_TEMPLATE,
    DRAG_ORIGIN_DRAG_TEMPLATE, DRAG_ORIGIN_ROTATE_START_TEMPLATE,
    DRAG_ORIGIN_ROTATE_TEMPLATE, DRAG_ORIGIN_DRAG_START_TEMPLATE, DRAG_ORIGIN_TEMPLATE
} from "../events.template";
import { boolean } from "@storybook/addon-knobs";
import { ROTATABLE_PROPS, ROTATABLE_PROPS_TEMPLATE } from "./Rotatable.template";
import { DRAGGABLE_PROPS, DRAGGABLE_PROPS_TEMPLATE } from "./Draggable.template";
import { removeDuplicate } from "../../utils";

export default function OriginDraggableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        translate: [0, 0],
        rotate: 0,
        transformOrigin: "50% 50%",
    });
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".target")!);
    }, []);

    const {
        rootChildren = d => d,
        description,
        children = <div className="target">Target</div>,
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
        {description}
        {children}
        <Moveable
            target={target}
            draggable={true}
            originDraggable={true}
            rotatable={true}
            {...moveableProps}
            onDragStart={e => {
                e.set(frame.translate);
            }}
            onDrag={e => {
                frame.translate = e.beforeTranslate;
            }}
            onRotateStart={e => {
                e.set(frame.rotate);
            }}
            onRotate={e => {
                frame.rotate = e.beforeRotate;
            }}
            onDragOriginStart={e => {
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onDragOrigin={e => {
                frame.translate = e.drag.beforeTranslate;
                frame.transformOrigin = e.transformOrigin;
            }}
            onRender={e => {
                e.target.style.transformOrigin = frame.transformOrigin;
                e.target.style.transform
                    = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
                    + ` rotate(${frame.rotate}deg)`;
            }}
        />
    </div>);
}

export const ORIGIN_DRAGGABLE_PROPS = removeDuplicate([
    "originDraggable",
    "originRelative",
    ...DRAGGABLE_PROPS,
    ...ROTATABLE_PROPS,
]);

export const ORIGIN_DRAGGABLE_FRAME = {
    translate: [0, 0],
    rotate: 0,
    transformOrigin: "50% 50%",
};
export const ORIGIN_DRAGGABLE_TEMPLATE_OPTIONS = {
    ableName: "originDraggable",
    props: ORIGIN_DRAGGABLE_PROPS,
    frame: ORIGIN_DRAGGABLE_FRAME,
    events: {
        dragOriginStart: DRAG_ORIGIN_START_TEMPLATE,
        dragOrigin: DRAG_ORIGIN_TEMPLATE,
        dragStart: DRAG_ORIGIN_DRAG_START_TEMPLATE,
        drag: DRAG_ORIGIN_DRAG_TEMPLATE,
        rotateStart: DRAG_ORIGIN_ROTATE_START_TEMPLATE,
        rotate: DRAG_ORIGIN_ROTATE_TEMPLATE,
        render: DRAG_ORIGIN_RENDER_TEMPLATE,
    },
};

export const ORIGIN_DRAGGABLE_PROPS_TEMPLATE = () => {
    return {
        originDraggable: boolean("originDraggable", true),
        originRelative: boolean("originRelative", true),
        ...DRAGGABLE_PROPS_TEMPLATE(),
        ...ROTATABLE_PROPS_TEMPLATE(),
    };
};
