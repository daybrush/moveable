import * as React from "react";
import Moveable from "react-moveable";
import { ROTATE_START_TEMPLATE, ROTATE_TEMPLATE } from "../events.template";
import { number, radios, boolean, object } from "@storybook/addon-knobs";

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

export const ROTATABLE_PROPS = ["throttleRotate", "rotationPosition", "zoom", "origin", "padding"];
export const ROTATABLE_FRAME = {
    rotate: 0,
};
export const ROTATABLE_TEMPLATE_OPTIONS = {
    ableName: "rotatable",
    props: ROTATABLE_PROPS,
    frame: ROTATABLE_FRAME,
    events: {
        rotateStart: ROTATE_START_TEMPLATE,
        rotate: ROTATE_TEMPLATE,
    },
};

export const ROTATABLE_PROPS_TEMPLATE = () => ({
    throttleRotate: number("throttleRotate", 0),
    rotationPosition: radios("rotationPosition", {
        "top": "top",
        "left": "left",
        "right": "right",
        "bottom": "bottom",
        "top-left": "top-left",
        "top-right": "top-right",
        "bottom-left": "bottom-left",
        "bottom-right": "bottom-right",
        "left-top": "left-top",
        "right-top": "right-top",
        "left-bottom": "left-bottom",
        "right-bottom": "right-bottom",
    }, "top"),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
