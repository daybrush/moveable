import * as React from "react";
import Moveable from "react-moveable";
import { SCALE_START_TEMPLATE, SCALE_TEMPLATE } from "../events.template";
import { boolean, number, array, object } from "@storybook/addon-knobs";

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

export const SCALABLE_PROPS = ["keepRatio", "throttleScale", "renderDirections", "edge", "zoom", "origin", "padding"];
export const SCALABLE_FRAME = {
    translate: [0, 0],
    scale: [1, 1],
};
export const SCALABLE_TEMPLATE_OPTIONS = {
    ableName: "scalable",
    props: SCALABLE_PROPS,
    frame: SCALABLE_FRAME,
    events: {
        scaleStart: SCALE_START_TEMPLATE,
        scale: SCALE_TEMPLATE,
    },
};

export const SCALABLE_PROPS_TEMPLATE = () => ({
    keepRatio: boolean("keepRatio", false),
    throttleScale: number("throttleScale", 0),
    renderDirections: array("renderDirections", [
        "nw", "n", "ne", "w", "e", "sw", "s", "se",
    ]),
    edge: boolean("edge", false),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
