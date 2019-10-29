import MoveableManager from "../MoveableManager";
import { createWarpMatrix, convertMatrixtoCSS } from "@moveable/matrix";
import { ref } from "framework-utils";
import { prefix, triggerEvent } from "../utils";
import { Renderer, GroupableProps, DragAreaProps } from "../types";
import MoveableGroup from "../MoveableGroup";
import { addClass, findIndex, removeClass } from "@daybrush/utils";

function restoreStyle(moveable: MoveableManager) {
    const el = moveable.areaElement;
    const { width, height } = moveable.state;

    removeClass(el, prefix("avoid"));

    el.style.cssText += `left: 0px; top: 0px; width: ${width}px; height: ${height}px`;
}

export default {
    name: "dragArea",
    render(moveable: MoveableManager<GroupableProps>, React: Renderer): any[] {
        const { target, dragArea, groupable } = moveable.props;

        const { width, height, pos1, pos2, pos3, pos4 } = moveable.state;

        if (groupable) {
            return [
                <div key="area" ref={ref(moveable, "areaElement")} className={prefix("area")} />,
            ];
        }
        if (!target || !dragArea) {
            return [];
        }
        const h = createWarpMatrix(
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
            pos1,
            pos2,
            pos3,
            pos4,
        );
        const transform = h.length ? `matrix3d(${convertMatrixtoCSS(h).join(",")})` : "none";

        return [
            <div key="area" ref={ref(moveable, "areaElement")} className={prefix("area")} style={{
                top: "0px",
                left: "0px",
                width: `${width}px`,
                height: `${height}px`,
                transformOrigin: "0 0",
                transform,
            }}/>,
        ];
    },
    dragStart(moveable: MoveableManager, { datas, clientX, clientY }: any) {
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
    drag(moveable: MoveableManager, { datas }: any) {
        if (!datas.isDrag) {
            datas.isDrag = true;
            restoreStyle(moveable);
        }
    },
    dragEnd(moveable: MoveableManager<DragAreaProps>, { inputEvent, isDrag, datas }: any) {
        if (!datas.isDrag) {
            restoreStyle(moveable);
        }

        const target = moveable.state.target!;
        const inputTarget = inputEvent.target;

        if (isDrag || moveable.isMoveableElement(inputTarget)) {
            return;
        }
        const containsTarget = target.contains(inputTarget);

        triggerEvent(moveable, "onClick", {
            target,
            inputTarget,
            isTarget: target === inputTarget,
            containsTarget,
        });
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroup(moveable: MoveableGroup, e: any) {
       this.drag(moveable, e);
    },
    dragGroupEnd(moveable: MoveableGroup, { inputEvent, isDrag, datas }: any) {
        if (!datas.isDrag) {
            restoreStyle(moveable);
        }

        const inputTarget = inputEvent.target;

        if (isDrag || moveable.isMoveableElement(inputTarget)) {
            return;
        }
        const targets = moveable.props.targets!;
        let targetIndex = targets.indexOf(inputTarget);
        const isTarget = targetIndex > -1;
        let containsTarget = false;

        if (targetIndex === -1) {
            targetIndex = findIndex(targets, parentTarget => parentTarget.contains(inputTarget));
            containsTarget = targetIndex > -1;
        }

        triggerEvent(moveable, "onClickGroup", {
            targets,
            target: moveable.state.target,
            inputTarget,
            targetIndex,
            isTarget,
            containsTarget,
        });
    },
};
