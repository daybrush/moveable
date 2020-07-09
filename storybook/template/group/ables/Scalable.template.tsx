import * as React from "react";
import Moveable from "react-moveable";
import { SCALE_GROUP_START_TEMPLATE, SCALE_GROUP_TEMPLATE } from "../events.template";
import { SCALABLE_TEMPLATE_OPTIONS } from "../../basic/ables/Scalable.template";

export default function ScalableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frames] = React.useState([
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
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
            scalable={true}
            {...moveableProps}
            onScaleGroupStart={e => {
                e.events.forEach((ev, i) => {
                    ev.set(frames[i].scale);
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onScaleGroup={e => {
                e.events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;
                    frames[i].scale = ev.scale;
                    ev.target.style.transform
                        = `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)`
                        + ` scale(${ev.scale[0], ev.scale[1]})`;
                });
            }}
        />
    </div>);
}
export const GROUP_SCALABLE_FRAME = {
    translate: [0, 0],
    scale: [1, 1],
};
export const GROUP_SCALABLE_TEMPLATE_OPTIONS = {
    ...SCALABLE_TEMPLATE_OPTIONS,
    frame: GROUP_SCALABLE_FRAME,
    events: {
        scaleGroupStart: SCALE_GROUP_START_TEMPLATE,
        scaleGroup: SCALE_GROUP_TEMPLATE,
    },
};
