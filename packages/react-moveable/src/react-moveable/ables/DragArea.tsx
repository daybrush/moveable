import MoveableManager from "../MoveableManager";
import { createWarpMatrix, convertMatrixtoCSS } from "@moveable/matrix";
import { ref } from "framework-utils";
import { triggerEvent, fillParams } from "../utils";
import { Renderer, GroupableProps, DragAreaProps, OnClick } from "../types";
import { AREA_PIECE, AREA, AVOID } from "../classNames";
import MoveableGroup from "../MoveableGroup";
import { addClass, findIndex, removeClass } from "@daybrush/utils";

function restoreStyle(moveable: MoveableManager) {
    const el = moveable.areaElement;
    const { width, height } = moveable.state;

    removeClass(el, AVOID);

    el.style.cssText += `left: 0px; top: 0px; width: ${width}px; height: ${height}px`;
}

export default {
    name: "dragArea",
    render(moveable: MoveableManager<GroupableProps>, React: Renderer): any[] {
        const { target, dragArea, groupable } = moveable.props;

        const { width, height, pos1, pos2, pos3, pos4 } = moveable.state;

        if (groupable) {
            return [
                <div key="area" ref={ref(moveable, "areaElement")} className={AREA}>
                    <div className={AREA_PIECE}></div>
                    <div className={AREA_PIECE}></div>
                    <div className={AREA_PIECE}></div>
                    <div className={AREA_PIECE}></div>
                </div>,
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
            <div key="area" ref={ref(moveable, "areaElement")} className={AREA} style={{
                top: "0px",
                left: "0px",
                width: `${width}px`,
                height: `${height}px`,
                transformOrigin: "0 0",
                transform,
            }}>
                <div className={AREA_PIECE}></div>
                <div className={AREA_PIECE}></div>
                <div className={AREA_PIECE}></div>
                <div className={AREA_PIECE}></div>
            </div>,
        ];
    },
    dragStart(moveable: MoveableManager, { datas, clientX, clientY }: any) {
        datas.isDrag = false;
        const areaElement = moveable.areaElement;
        const { left, top, width, height } = moveable.state.target!.getBoundingClientRect();
        const posX = clientX - left;
        const posY = clientY - top;
        const rects = [
            { left: 0, top: 0, width, height: posY - 10 },
            { left: 0, top: 0, width: posX - 10, height },
            { left: 0, top: posY + 10, width, height: height - posY - 10 },
            { left: posX + 10, top: 0, width: width - posX - 10, height },
        ];

        const children = [].slice.call(areaElement.children) as HTMLElement[];
        rects.forEach((rect, i) => {
            children[i].style.cssText
                = `left: ${rect.left}px;top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px;`;
        });
        addClass(areaElement, AVOID);
    },
    drag(moveable: MoveableManager, { datas }: any) {
        if (!datas.isDrag) {
            datas.isDrag = true;
            restoreStyle(moveable);
        }
    },
    dragEnd(moveable: MoveableManager<DragAreaProps>, e: any) {
        const { inputEvent, isDrag, datas } = e;
        if (!datas.isDrag) {
            restoreStyle(moveable);
        }

        const target = moveable.state.target!;
        const inputTarget = inputEvent.target;

        if (isDrag || moveable.isMoveableElement(inputTarget)) {
            return;
        }
        const containsTarget = target.contains(inputTarget);

        triggerEvent(moveable, "onClick", fillParams<OnClick>(moveable, e, {
            inputTarget,
            isTarget: target === inputTarget,
            containsTarget,
        }));
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroup(moveable: MoveableGroup, e: any) {
        this.drag(moveable, e);
    },
    dragGroupEnd(
        moveable: MoveableGroup,
        e: any,
    ) {
        const { inputEvent, isDrag, datas } = e;
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

        triggerEvent(moveable, "onClickGroup", fillParams(moveable, e, {
            targets,
            inputTarget,
            targetIndex,
            isTarget,
            containsTarget,
        }));
    },
};
