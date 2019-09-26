import { refs } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";
import { triggerEvent, prefix } from "../utils";
import { Renderer } from "../types";
import { OnDragEnd } from "@daybrush/drag";
import { findIndex, addClass, removeClass } from "@daybrush/utils";

function restoreStyle(moveable: MoveableGroup) {
    const el = moveable.areaElement;
    const { width, height } = moveable.state;

    removeClass(el, prefix("avoid"));

    el.style.cssText += `left: 0px; top: 0px; width: ${width}px; height: ${height}px`;
}

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
        ];
    },
    dragGroupStart(moveable: MoveableGroup, { datas, clientX, clientY }: any) {
        datas.isDrag = false;
        const areaElement = moveable.areaElement;
        const moveableElement = moveable.controlBox.getElement();
        const { left, top } = moveableElement.getBoundingClientRect();
        const { width,  height } = moveable.state;
        const size = Math.max(width, height) * 2;
        const posX =  clientX - left - size / 2;
        const posY =  clientY - top - size - 10;

        areaElement.style.cssText += `width: ${size}px; height: ${size}px;left: ${posX}px;top: ${posY}px;`;
        addClass(areaElement, prefix("avoid"));
    },
    dragGroup(moveable: MoveableGroup, { datas }: any) {
        if (!datas.isDrag) {
            datas.isDrag = true;
            restoreStyle(moveable);
        }
    },
    dragGroupEnd(moveable: MoveableGroup, { inputEvent, isDrag, datas }: OnDragEnd) {
        if (!datas.isDrag) {
            restoreStyle(moveable);
        }

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
