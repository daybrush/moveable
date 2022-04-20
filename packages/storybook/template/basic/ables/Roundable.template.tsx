import * as React from "react";
import Moveable from "react-moveable";
import { ROUND_TEMPLATE } from "../events.template";
import { number, boolean, object } from "@storybook/addon-knobs";

export default function RoundableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        // translate: [0, 0],
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
            roundable={true}
            {...moveableProps}
            onRound={e => {
                e.target.style.borderRadius = e.borderRadius;
            }}
        />
    </div>);
}

export const ROUNDABLE_PROPS = ["roundable", "roundRelative", "zoom", "origin", "padding"];
export const ROUNDABLE_FRAME = {};
export const ROUNDABLE_TEMPLATE_OPTIONS = {
    ableName: "roundable",
    props: ROUNDABLE_PROPS,
    frame: ROUNDABLE_FRAME,
    events: {
        round: ROUND_TEMPLATE,
    },
};

export const ROUNDABLE_PROPS_TEMPLATE = () => ({
    roundable: boolean("roundable", true),
    roundRelative: boolean("roundRelative", false),
    zoom: number("zoom", 1),
    origin: boolean("origin", true),
    padding: object("padding", { left: 0, top: 0, right: 0, bottom: 0 }),
});
