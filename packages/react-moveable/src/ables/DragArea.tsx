import {
    createWarpMatrix,
} from "@scena/matrix";
import { ref } from "framework-utils";
import { getRect, calculateInversePosition, makeMatrixCSS, prefix } from "../utils";
import {
    Renderer, GroupableProps, DragAreaProps, MoveableManagerInterface, MoveableGroupInterface,
} from "../types";
import { AREA_PIECE, AVOID, AREA_PIECES } from "../classNames";
import { addClass, removeClass, requestAnimationFrame } from "@daybrush/utils";

function restoreStyle(moveable: MoveableManagerInterface) {
    const el = moveable.areaElement;

    if (!el) {
        return;
    }
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
    props: [
        "dragArea",
        "passDragArea",
    ] as const,
    events: [
        "click",
        "clickGroup",
    ] as const,
    render(moveable: MoveableManagerInterface<GroupableProps>, React: Renderer): any[] {
        const { target, dragArea, groupable, passDragArea } = moveable.props;
        const { width, height, renderPoses } = moveable.getState();

        const className = passDragArea ? prefix("area", "pass") : prefix("area");
        if (groupable) {
            return [
                <div key="area" ref={ref(moveable, "areaElement")} className={className}></div>,
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
        const transform = h.length ? makeMatrixCSS(h, true) : "none";

        return [
            <div key="area" ref={ref(moveable, "areaElement")} className={className} style={{
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
    dragStart(moveable: MoveableManagerInterface, { datas, clientX, clientY, inputEvent }: any) {
        if (!inputEvent) {
            return false;
        }
        datas.isDragArea = false;
        const areaElement = moveable.areaElement;
        const state = moveable.state;
        const {
            moveableClientRect,
            renderPoses,
            rootMatrix,
            is3d,
        } = state;
        const { left, top } = moveableClientRect;
        const {
            left: relativeLeft,
            top: relativeTop,
            width,
            height,
        } = getRect(renderPoses);
        const n = is3d ? 4 : 3;
        let [posX, posY] = calculateInversePosition(rootMatrix, [clientX - left, clientY - top], n);

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
        state.disableNativeEvent = true;
        return;
    },
    drag(moveable: MoveableManagerInterface, { datas, inputEvent }: any) {
        this.enableNativeEvent(moveable);
        if (!inputEvent) {
            return false;
        }
        if (!datas.isDragArea) {
            datas.isDragArea = true;
            restoreStyle(moveable);
        }
    },
    dragEnd(moveable: MoveableManagerInterface<DragAreaProps>, e: any) {
        this.enableNativeEvent(moveable);
        const { inputEvent, datas } = e;
        if (!inputEvent) {
            return false;
        }
        if (!datas.isDragArea) {
            restoreStyle(moveable);
        }
    },
    dragGroupStart(moveable: MoveableGroupInterface, e: any) {
        return this.dragStart(moveable, e);
    },
    dragGroup(moveable: MoveableGroupInterface, e: any) {
        return this.drag(moveable, e);
    },
    dragGroupEnd(
        moveable: MoveableGroupInterface<DragAreaProps>,
        e: any,
    ) {
        return this.dragEnd(moveable, e);
    },
    unset(moveable: MoveableManagerInterface<DragAreaProps>) {
        restoreStyle(moveable);
        moveable.state.disableNativeEvent = false;
    },
    enableNativeEvent(moveable: MoveableManagerInterface<DragAreaProps>) {
        const state = moveable.state;
        if (state.disableNativeEvent) {
            requestAnimationFrame(() => {
                state.disableNativeEvent = false;
            });
        }
    },
};

/**
 * Add an event to the moveable area instead of the target for stopPropagation. (default: false, true in group)
 * @name Moveable#dragArea
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  dragArea: false,
 * });
 */
/**
 * Set `pointerEvents: none;` css to pass events in dragArea. (default: false)
 * @name Moveable#passDragArea
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  dragArea: false,
 * });
 */
