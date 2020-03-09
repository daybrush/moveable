import * as React from "react";
import Moveable from "react-moveable";

export default function ScalableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        scale: [1, 1],
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
            scalable={true}
            {...moveableProps}
            onScaleStart={e => {
                e.set(frame.scale);
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onScale={e => {
                frame.scale = e.scale;
                frame.translate = e.drag.beforeTranslate;

                e.target.style.cssText
                    = `transform: translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
                    + ` scale(${e.scale[0]}, ${e.scale[1]})`;
            }}
        />
    </div>);
}

export const SCALABLE_PROPS = ["keepRatio", "throttleScale", "renderDirections", "edge", "zoom", "origin"];
export const SCALABLE_FRAME = {
    translate: [0, 0],
    scale: [1, 1],
};
