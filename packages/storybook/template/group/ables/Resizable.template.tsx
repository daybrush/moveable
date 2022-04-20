import * as React from "react";
import Moveable from "react-moveable";
import { RESIZE_GROUP_START_TEMPLATE, RESIZE_GROUP_TEMPLATE } from "../events.template";
import { RESIZABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Resizable.template";

export default function ResizableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frames] = React.useState([
        { translate: [0, 0] },
        { translate: [0, 0] },
        { translate: [0, 0] },
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
            resizable={true}
            {...moveableProps}
            onResizeGroupStart={e => {
                e.events.forEach((ev, i) => {
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onResizeGroup={e => {
                e.events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;
                    ev.target.style.width = `${ev.width}px`;
                    ev.target.style.height = `${ev.height}px`;
                    ev.target.style.transform
                        = `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)`;
                });
            }}
        />
    </div>);
}

export const GROUP_RESIZABLE_TEMPLATE_OPTIONS = {
    ...RESIZABLE_TEMPLATE_OPTIONS,
    events: {
        resizeGroupStart: RESIZE_GROUP_START_TEMPLATE,
        resizeGroup: RESIZE_GROUP_TEMPLATE,
    },
};
