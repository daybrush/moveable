import * as React from "react";
import Moveable from "react-moveable";
import { CLIP_TEMPLATE, DRAG_START_TEMPLATE, DRAG_TEMPLATE } from "../events.template";

export default function ClippableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        translate: [0, 0],
    });
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".target")!);
    }, []);

    const {
        rootChildren = d => d,
        children = <div className="target">Target</div>,
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
        {children}
        <Moveable
            target={target}
            dragArea={true}
            draggable={true}
            clippable={true}
            {...moveableProps}
            onDragStart={e => {
                e.set(frame.translate);
            }}
            onDrag={e => {
                frame.translate = e.beforeTranslate;
                e.target.style.transform
                    = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
            }}
            onClip={e => {
                if (e.clipType === "rect") {
                    e.target.style.clip = e.clipStyle;
                } else {
                    e.target.style.clipPath = e.clipStyle;
                }
            }}
        />
    </div>);
}

export const CLIPPABLE_PROPS = ["draggable", "clipRelative", "clipArea", "dragArea", "dragWithClip", "defaultClipPath", "zoom", "origin", "padding"];
export const CLIPPABLE_FRAME = {
    translate: [0, 0],
    clipStyle: "inset",
};
export const CLIPPABLE_TEMPLATE_OPTIONS = {
    ableName: "clippable",
    props: CLIPPABLE_PROPS,
    frame: CLIPPABLE_FRAME,
    events: {
        dragStart: DRAG_START_TEMPLATE,
        drag: DRAG_TEMPLATE,
        clip: CLIP_TEMPLATE,
    },
};
