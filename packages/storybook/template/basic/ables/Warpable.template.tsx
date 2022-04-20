import * as React from "react";
import Moveable from "react-moveable";
import { WARP_START_TEMPLATE, WARP_TEMPLATE } from "../events.template";
import { boolean, number, array, object } from "@storybook/addon-knobs";

export default function RotatableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
    });
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".target")!);
    }, []);

    const {
        rootChildren = d => d,
        children = <div className="target">Target</div>,
        description,
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
        {description}
        {children}
        <Moveable
            target={target}
            warpable={true}
            {...moveableProps}
            onWarpStart={e => {
                e.set(frame.matrix);
            }}
            onWarp={e => {
                frame.matrix = e.matrix;

                e.target.style.cssText = `transform: matrix3d(${e.matrix.join(",")})`;
            }}
        />
    </div>);
}

export const WARPABLE_PROPS = ["warpable", "renderDirections", "edge", "zoom", "origin", "padding"];
export const WARPABLE_FRAME = {
    matrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ],
};
export const WARPABLE_TEMPLATE_OPTIONS = {
    ableName: "warpable",
    props: WARPABLE_PROPS,
    frame: WARPABLE_FRAME,
    events: {
        warpStart: WARP_START_TEMPLATE,
        warp: WARP_TEMPLATE,
    },
};
export const WARPABLE_PROPS_TEMPLATE = () => ({
    warpable: boolean("warpable", true),
    renderDirections: array("renderDirections", [
        "nw", "n", "ne", "w", "e", "sw", "s", "se",
    ]),
    edge: boolean("edge", false),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
