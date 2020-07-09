import * as React from "react";
import Moveable from "react-moveable";
import { DRAG_START_TEMPLATE, DRAG_TEMPLATE } from "../events.template";
import { number, boolean, object } from "@storybook/addon-knobs";

export default function DraggableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        translate: [0, 0],
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
            {...moveableProps}
            onDragStart={e => {
                e.set(frame.translate);
            }}
            onDrag={e => {
                frame.translate = e.beforeTranslate;
                e.target.style.transform
                    = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
            }}
        />
    </div>);
}

export const DRAGGABLE_PROPS = ["draggable", "throttleDrag", "startDragRotate", "throttleDragRotate", "zoom", "origin", "padding"];
export const DRAGGABLE_FRAME = {
    translate: [0, 0],
};
export const DRAGGABLE_TEMPLATE_OPTIONS = {
    ableName: "draggable",
    props: DRAGGABLE_PROPS,
    frame: DRAGGABLE_FRAME,
    events: {
        dragStart: DRAG_START_TEMPLATE,
        drag: DRAG_TEMPLATE,
    },
};

export const DRAGGABLE_PROPS_TEMPLATE = () => ({
    draggable: boolean("draggable", true),
    throttleDrag: number("throttleDrag", 0),
    throttleDragRotate: number("throttleDragRotate", 0),
    startDragRotate: number("startDragRotate", 0),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
