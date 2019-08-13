import React from "react";
import { refs, ref } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";
import { prefix } from "../utils";

export default {
    name: "groupable",
    render(moveable: MoveableGroup) {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        const { left, top } = moveable.state;
        const position = { left, top };

        return [...targets.map((target, i) => {
            return <MoveableManager
                key={i}
                ref={refs(moveable, "moveables", i)}
                target={target}
                origin={false}
                parentMoveable={moveable}
                parentPosition={position} />;
        }),
        <div key="groupTarget" ref={ref(this, "groupTargetElement")} className={prefix("group")} />,
        ];
    },
};
