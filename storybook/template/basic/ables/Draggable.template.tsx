import * as React from "react";
import Moveable from "react-moveable";

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
        children = <div className="target">Target</div>,
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
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

export const DRAGGABLE_PROPS = ["throttleDrag", "throttleDragRotate", "zoom", "origin", "padding"];
export const DRAGGABLE_FRAME = {
    translate: [0, 0],
};
