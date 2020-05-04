import MoveableManager from "../MoveableManager";
import {
    createWarpMatrix, convertMatrixtoCSS,
} from "@moveable/matrix";
import { ref } from "framework-utils";
import { triggerEvent, fillParams, getRect, caculateInversePosition } from "../utils";
import { Renderer, GroupableProps, DragAreaProps, OnClick } from "../types";
import { AREA_PIECE, AREA, AVOID, AREA_PIECES } from "../classNames";
import MoveableGroup from "../MoveableGroup";
import { addClass, findIndex, removeClass } from "@daybrush/utils";

function restoreStyle(moveable: MoveableManager) {
    const el = moveable.areaElement;
    const { width, height } = moveable.state;

    removeClass(el, AVOID);

    el.style.cssText += `left: 0px; top: 0px; width: ${width}px; height: ${height}px`;
}

function renderPieces(React: Renderer): any {
    return (<div key="area_pieces" className={AREA_PIECES}>
        <div className={AREA_PIECE}></div>
        <div className={AREA_PIECE}></div>
        <div className={AREA_PIECE}></div>
        <div className={AREA_PIECE}></div>
    </div>);
}
export default {
    name: "dragArea",
    props: {
        dragArea: Boolean,
    },
    render(moveable: MoveableManager<GroupableProps>, React: Renderer): any[] {
        const { target, dragArea, groupable } = moveable.props;
        const { width, height, renderPoses } = moveable.state;

        if (groupable) {
            return [
                <div key="area" ref={ref(moveable, "areaElement")} className={AREA}></div>,
                renderPieces(React),
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
            renderPoses[0],
            renderPoses[1],
            renderPoses[2],
            renderPoses[3],
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
            }}></div>,
            renderPieces(React),
        ];
    },
    dragStart(moveable: MoveableManager, { datas, clientX, clientY, inputEvent }: any) {
        if (!inputEvent) {
            return false;
        }
        datas.isDragArea = false;
        datas.inputTarget = inputEvent.target;
        const areaElement = moveable.areaElement;
        const {
            moveableClientRect,
            renderPoses,
            rootMatrix,
            is3d,
        } = moveable.state;
        const { left, top } = moveableClientRect;
        const {
            left: relativeLeft,
            top: relativeTop,
            width,
            height,
        } = getRect(renderPoses);
        const n = is3d ? 4 : 3;
        let [posX, posY] = caculateInversePosition(rootMatrix, [clientX - left, clientY - top], n);

        posX -= relativeLeft;
        posY -= relativeTop;
        const rects = [
            { left: relativeLeft, top: relativeTop, width, height: posY - 10 },
            { left: relativeLeft, top: relativeTop, width: posX - 10, height },
            { left: relativeLeft, top: relativeTop + posY + 10, width, height: height - posY - 10 },
            { left: relativeLeft + posX + 10, top: relativeTop, width: width - posX - 10, height },
        ];

        const children = [].slice.call(areaElement.nextElementSibling!.children) as HTMLElement[];
        rects.forEach((rect, i) => {
            children[i].style.cssText
                = `left: ${rect.left}px;top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px;`;
        });
        addClass(areaElement, AVOID);
        return true;
    },
    drag(moveable: MoveableManager, { datas, inputEvent }: any) {
        if (!inputEvent) {
            return false;
        }
        if (!datas.isDragArea) {
            datas.isDragArea = true;
            restoreStyle(moveable);
        }
    },
    dragEnd(moveable: MoveableManager<DragAreaProps>, e: any) {
        if (!e.inputEvent) {
            return false;
        }
        const { inputEvent, isDragArea, datas } = e;
        if (!datas.isDragArea) {
            restoreStyle(moveable);
        }

        const target = moveable.state.target!;
        const inputTarget = inputEvent.target;

        if (isDragArea || moveable.isMoveableElement(inputTarget)) {
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
        return this.dragStart(moveable, e);
    },
    dragGroup(moveable: MoveableGroup, e: any) {
        return this.drag(moveable, e);
    },
    dragGroupEnd(
        moveable: MoveableGroup,
        e: any,
    ) {
        const { inputEvent, isDragArea, datas } = e;
        if (!inputEvent) {
            return false;
        }
        if (!isDragArea) {
            restoreStyle(moveable);
        }
        const prevInputTarget = datas.inputTarget;
        const inputTarget = inputEvent.target;

        if (isDragArea || moveable.isMoveableElement(inputTarget) || prevInputTarget === inputTarget) {
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
