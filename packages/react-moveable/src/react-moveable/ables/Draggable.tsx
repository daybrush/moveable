import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, fillParams, throttle, getDistSize, prefix } from "../utils";
import { minus, plus, getRad } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import {
    DraggableProps, OnDrag, OnDragGroup,
    OnDragGroupStart, OnDragStart, OnDragEnd, DraggableState, Renderer,
} from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { checkSnapDrag, startCheckSnapDrag } from "./Snappable";
import { TINY_NUM } from "../consts";
import { IObject } from "@daybrush/utils";

export default {
    name: "draggable",
    props: {
        draggable: Boolean,
        throttleDrag: Number,
        throttleDragRotate: Number,
    },
    render(
        moveable: MoveableManager<DraggableProps, DraggableState>,
        React: Renderer,
    ) {
        const throttleDragRotate = moveable.props.throttleDragRotate;
        const { dragInfo, beforeOrigin } = moveable.state;

        if (!throttleDragRotate || !dragInfo) {
            return;
        }
        const dist = dragInfo.dist;

        if (!dist[0] && !dist[1]) {
            return;
        }
        const width = getDistSize(dist);
        const rad = getRad(dist, [0, 0]);

        return <div className={prefix(
            "line",
            "horizontal",
            "dragline",
            "dashed",
        )} key={`dragRotateGuideline`} style={{
            width: `${width}px`,
            transform: `translate(${beforeOrigin[0]}px, ${beforeOrigin[1]}px) rotate(${rad}rad)`,
        }} />;
    },
    dragStart(
        moveable: MoveableManager<DraggableProps, any>,
        e: any,
    ) {
        const { datas, parentEvent, parentDragger } = e;
        const state = moveable.state;
        const {
            targetTransform,
            target,
            dragger,
        } = state;

        if (dragger) {
            return false;
        }
        state.dragger = parentDragger || moveable.targetDragger;
        const style = window.getComputedStyle(target!);

        datas.datas = {};
        datas.left = parseFloat(style.left || "") || 0;
        datas.top = parseFloat(style.top || "") || 0;
        datas.bottom = parseFloat(style.bottom || "") || 0;
        datas.right = parseFloat(style.right || "") || 0;
        datas.transform = targetTransform;
        datas.startTranslate = [0, 0];

        setDragStart(moveable, { datas });

        datas.prevDist = [0, 0];
        datas.prevBeforeDist = [0, 0];
        datas.isDrag = false;

        startCheckSnapDrag(moveable, datas);
        const params = fillParams<OnDragStart>(moveable, e, {
            set: (translate: number[]) => {
                datas.startTranslate = translate;
            },
        });
        const result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
            datas.isDrag = true;
            moveable.state.dragInfo = {
                startRect: moveable.getRect(),
                dist: [0, 0],
            };
        } else {
            state.dragger = null;
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManager<DraggableProps, any>,
        e: any,
    ): OnDrag | undefined {
        const { datas, parentEvent, parentFlag } = e;
        let { distX, distY } = e;
        const { isPinch, isDrag, prevDist, prevBeforeDist, transform, startTranslate } = datas;

        if (!isDrag) {
            return;
        }
        const props = moveable.props;

        const parentMoveable = props.parentMoveable;
        const throttleDrag = parentEvent ? 0 : (props.throttleDrag || 0);
        const throttleDragRotate = parentEvent ? 0 : (props.throttleDragRotate || 0);

        let isSnap = false;
        let dragRotateRad = 0;

        if (throttleDragRotate > 0 && distX && distY) {
            const deg = throttle(getRad([0, 0], [distX, distY]) * 180 / Math.PI, throttleDragRotate);
            const r = getDistSize([distX, distY]);
            dragRotateRad = deg * Math.PI / 180;

            distX = r * Math.cos(dragRotateRad);
            distY = r * Math.sin(dragRotateRad);
        }

        if (!isPinch && !parentEvent && !parentFlag && (distX || distY)) {
            console.log("??");
            const [verticalInfo, horizontalInfo] = checkSnapDrag(moveable, distX, distY, datas);
            const {
                isSnap: isVerticalSnap,
                isBound: isVerticalBound,
                offset: verticalOffset,
            } = verticalInfo;
            const {
                isSnap: isHorizontalSnap,
                isBound: isHorizontalBound,
                offset: horizontalOffset,
            } = horizontalInfo;
            isSnap = isVerticalSnap || isHorizontalSnap;

            if (throttleDragRotate && distX && distY) {
                const adjustPoses = [];
                if (isVerticalBound && isHorizontalBound) {
                    adjustPoses.push(
                        [0, horizontalOffset],
                        [verticalOffset, 0],
                    );
                } else if (isVerticalBound) {
                    adjustPoses.push(
                        [verticalOffset, 0],
                    );
                } else if (isHorizontalBound) {
                    adjustPoses.push(
                        [0, horizontalOffset],
                    );
                } else if (isVerticalSnap && isHorizontalSnap) {
                    adjustPoses.push(
                        [0, horizontalOffset],
                        [verticalOffset, 0],
                    );
                } else if (isVerticalSnap) {
                    adjustPoses.push(
                        [verticalOffset, 0],
                    );
                } else if (isHorizontalSnap) {
                    adjustPoses.push(
                        [0, horizontalOffset],
                    );
                }
                if (adjustPoses.length) {
                    adjustPoses.sort((a, b) => {
                        return getDistSize(minus([distX, distY], a)) - getDistSize(minus([distX, distY], b));
                    });
                    const adjustPos = adjustPoses[0];
                    if (adjustPos[0] && Math.abs(distX) > TINY_NUM) {
                        const prevDistX = distX;
                        distX -= adjustPos[0];
                        distY = distY * Math.abs(distX) / Math.abs(prevDistX);
                    } else if (adjustPos[1] && Math.abs(distY) > TINY_NUM) {
                        const prevDistY = distY;
                        distY -= adjustPos[1];
                        distX = distX * Math.abs(distY) / Math.abs(prevDistY);
                    }
                }
            } else {
                distX -= verticalOffset;
                distY -= horizontalOffset;
            }
        }
        datas.passDistX = distX;
        datas.passDistY = distY;
        const beforeTranslate = plus(getDragDist({ datas, distX, distY }, true), startTranslate);
        const translate = plus(getDragDist({ datas, distX, distY }, false), startTranslate);

        if (!throttleDragRotate && !isSnap) {
            throttleArray(translate, throttleDrag);
            throttleArray(beforeTranslate, throttleDrag);
        }

        const beforeDist = minus(beforeTranslate, startTranslate);
        const dist = minus(translate, startTranslate);
        const delta = minus(dist, prevDist);
        const beforeDelta = minus(beforeDist, prevBeforeDist);

        datas.prevDist = dist;
        datas.prevBeforeDist = beforeDist;

        const left = datas.left + beforeDist[0];
        const top = datas.top + beforeDist[1];
        const right = datas.right - beforeDist[0];
        const bottom = datas.bottom - beforeDist[1];
        const nextTransform = `${transform} translate(${dist[0]}px, ${dist[1]}px)`;

        moveable.state.dragInfo.dist = dist;
        if (!parentEvent && !parentMoveable && delta.every(num => !num) && beforeDelta.some(num => !num)) {
            return;
        }
        const params = fillParams<OnDrag>(moveable, e, {
            transform: nextTransform,
            dist,
            delta,
            translate,
            beforeDist,
            beforeDelta,
            beforeTranslate,
            left,
            top,
            right,
            bottom,
            isPinch,
        });

        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
    },
    dragEnd(
        moveable: MoveableManager<DraggableProps, DraggableState>,
        e: any,
    ) {
        const { parentEvent, datas, isDrag } = e;

        moveable.state.dragger = null;
        moveable.state.dragInfo = null;
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        !parentEvent && triggerEvent(moveable, "onDragEnd", fillParams<OnDragEnd>(moveable, e, {
            isDrag,
        }));
        return isDrag;
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        const datas = e.datas;

        const params = this.dragStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildAble(moveable, this, "dragStart", datas, e);
        const nextParams: OnDragGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent(moveable, "onDragGroupStart", nextParams);

        datas.isDrag = result !== false;

        return datas.isDrag ? params : false;
    },
    dragGroup(moveable: MoveableGroup, e: any) {
        const datas = e.datas;

        if (!datas.isDrag) {
            return;
        }
        const params = this.drag(moveable, e);
        const { passDistX, passDistY } = e.datas;
        const events = triggerChildAble(moveable, this, "drag", datas, { ...e, distX: passDistX, distY: passDistY });

        if (!params) {
            return;
        }
        const nextParams: OnDragGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        triggerEvent(moveable, "onDragGroup", nextParams);
        return nextParams;
    },
    dragGroupEnd(moveable: MoveableGroup, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isDrag) {
            return;
        }
        this.dragEnd(moveable, e);
        triggerChildAble(moveable, this, "dragEnd", datas, e);
        triggerEvent(moveable, "onDragGroupEnd", fillParams(moveable, e, {
            targets: moveable.props.targets!,
            isDrag,
        }));

        return isDrag;
    },
    request(moveable: MoveableManager<any, any>, startParam: IObject<any>) {
        const datas = {};
        const self = this;

        this.dragStart(moveable, { datas });
        let distX = 0;
        let distY = 0;
        return {
            request({ deltaX, deltaY }: IObject<any>) {
                distX += deltaX;
                distY += deltaY;
                self.drag(moveable, { datas, distX, distY });

                return this;
            },
            requestEnd() {
                self.dragEnd(moveable, { datas, isDrag: true });
                return this;
            },
        };
    },
    unset(moveable: any) {
        moveable.state.dragInfo = null;
    },
};
