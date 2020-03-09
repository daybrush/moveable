import * as React from "react";
import Moveable from "react-moveable";

export default function RotatableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        rotate: 0,
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
            rotatable={true}
            {...moveableProps}
            onRotateStart={e => {
                e.set(frame.rotate);
            }}
            onRotate={e => {
                frame.rotate = e.beforeRotate;

                e.target.style.cssText = `transform: rotate(${e.rotate}deg)`;
            }}
        />
    </div>);
}

export const ROTATABLE_PROPS = ["throttleRotate", "rotationPosition", "zoom", "origin"];
export const ROTATABLE_FRAME = {
    rotate: 0,
};
