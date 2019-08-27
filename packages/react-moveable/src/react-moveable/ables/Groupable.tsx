import { refs, ref } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";
import { prefix } from "../utils";
import { Renderer } from "../types";

export default {
    name: "groupable",
    render(moveable: MoveableGroup, React: Renderer): any[] {
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
                parentPosition={position}
            />;
        }),
        <div key="groupTarget" ref={ref(moveable, "groupTargetElement")} className={prefix("group")} />,
        ];
    },
};
