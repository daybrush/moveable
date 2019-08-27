import { refs, ref } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";
import { prefix, triggerEvent } from "../utils";
import { Renderer } from "../types";
import { OnDragEnd } from "@daybrush/drag";
import { findIndex } from "@daybrush/utils";

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
    dragGroupStart(moveable: MoveableGroup) {
        moveable.groupTargetElement.style.pointerEvents = "none";
    },
    dragGroup(moveable: MoveableGroup) {
        moveable.groupTargetElement.style.pointerEvents = "auto";
    },
    dragGroupEnd(moveable: MoveableGroup, { inputEvent, isDrag }: OnDragEnd) {
        !isDrag && (moveable.groupTargetElement.style.pointerEvents = "auto");

        const target = inputEvent.target;

        if (isDrag || moveable.isMoveableElement(target)) {
            return;
        }
        const targets = moveable.props.targets!;
        let targetIndex = targets.indexOf(target);
        const hasTarget = targetIndex > -1;
        let containsTarget = false;

        if (targetIndex === -1) {
            targetIndex = findIndex(targets, parentTarget => parentTarget.contains(target));
            containsTarget = targetIndex > -1;
        }

        triggerEvent(moveable, "onClickGroup", {
            targets,
            target,
            targetIndex,
            hasTarget,
            containsTarget,
        });
    },
};
