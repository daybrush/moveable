import * as React from "react";
import Moveable from "react-moveable";
import { RESIZE_START_TEMPLATE, RESIZE_TEMPLATE } from "../events.template";
import { boolean, number, array, object } from "@storybook/addon-knobs";

export default function ResizableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        width: 100,
        height: 100,
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
            resizable={true}
            {...moveableProps}
            onResizeStart={e => {
                e.set([frame.width, frame.height]);
                e.setOrigin(["%", "%"]);
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onResize={e => {
                frame.width = e.width;
                frame.height = e.height;
                frame.translate = e.drag.beforeTranslate;

                e.target.style.cssText
                    = `transform: translate(${frame.translate[0]}px, ${frame.translate[1]}px);`
                    + `width: ${e.width}px; height: ${e.height}px;`;
            }}
        />
    </div>);
}

export const RESIZABLE_PROPS = [
    "reiszable", "keepRatio", "throttleResize",
    "renderDirections", "edge", "zoom", "origin", "padding",
];
export const RESIZABLE_FRAME = {
    translate: [0, 0],
};

export const RESIZABLE_TEMPLATE_OPTIONS = {
    ableName: "resizable",
    props: RESIZABLE_PROPS,
    frame: RESIZABLE_FRAME,
    events: {
        resizeStart: RESIZE_START_TEMPLATE,
        resize: RESIZE_TEMPLATE,
    },
};
export const RESIZABLE_PROPS_TEMPLATE = () => ({
    reisizable: boolean("resizable", true),
    keepRatio: boolean("keepRatio", false),
    throttleResize: number("throttleResize", 0),
    renderDirections: array("renderDirections", [
        "nw", "n", "ne", "w", "e", "sw", "s", "se",
    ]),
    edge: boolean("edge", false),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
