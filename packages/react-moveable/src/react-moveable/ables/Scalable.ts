import { throttle, getDirection, triggerEvent } from "../utils";
import { MIN_SCALE } from "../consts";
import { setDragStart, getDragDist, setSizeInfo, getScaleDist } from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import { renderAllDirection, renderDiagonalDirection } from "../renderDirection";
import {
    ScalableProps, ResizableProps, OnScaleGroup, OnScaleGroupEnd,
    Renderer, OnScaleGroupStart, DraggableProps, OnDragStart, OnDrag,
} from "../types";
import {
    directionCondition, triggerChildAble, setCustomEvent,
    getCustomEvent,
    getCustomPrevClient,
} from "../groupUtils";
import MoveableGroup from "../MoveableGroup";
import Draggable from "./Draggable";
import { getRad, rotate } from "@moveable/matrix";
import { checkSnapSize } from "./Snappable";

export default {
    name: "scalable",
    dragControlOnly: true,
    canPinch: true,

    render(moveable: MoveableManager<Partial<ResizableProps & ScalableProps>>, React: Renderer): any[] | undefined {
        const { resizable, scalable, edge } = moveable.props;
        if (!resizable && scalable) {
            if (edge) {
                return renderDiagonalDirection(moveable, React);
            }
            return renderAllDirection(moveable, React);
        }
    },
    dragControlCondition: directionCondition,
    dragControlStart(
        moveable: MoveableManager<ScalableProps & DraggableProps>,
        e: any) {

        const { datas, clientX, clientY, pinchFlag, inputEvent, dragClient = [0, 0] } = e;
        const { target: inputTarget } = inputEvent;
        const direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        const {
            width,
            height,
            targetTransform,
            target,
        } = moveable.state;

        if (!direction || !target) {
            return false;
        }
        if (!pinchFlag) {
            setDragStart(moveable, { datas });
        }

        datas.datas = {};
        datas.transform = targetTransform;
        datas.prevDist = [1, 1];
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.startScale = [1, 1];

        setSizeInfo(moveable, datas);

        const params = {
            target,
            clientX,
            clientY,
            datas: datas.datas,
            set: (scale: number[]) => {
                datas.startScale = scale;
            },
            dragStart: Draggable.dragStart(
                moveable,
                setCustomEvent(dragClient[0], dragClient[1], datas, inputEvent),
            ) as OnDragStart,
        };
        const result = triggerEvent(moveable, "onScaleStart", params);

        if (result !== false) {
            datas.isScale = true;
        }
        return datas.isScale ? params : false;
    },
    dragControl(
        moveable: MoveableManager<ScalableProps & DraggableProps>,
        e: any) {
        const {
            datas, clientX, clientY, distX, distY, parentScale, parentDistance, pinchFlag, inputEvent,
            dragClient = getCustomPrevClient(datas),
        } = e;
        const {
            prevDist,
            direction,
            width,
            height,
            transform,
            isScale,
            startScale,
        } = datas;

        if (!isScale) {
            return false;
        }
        // checkSnapSize(moveable as any, e, 0);

        const { keepRatio, throttleScale, parentMoveable } = moveable.props;
        const target = moveable.state.target;
        let scaleX: number = 1;
        let scaleY: number = 1;

        if (parentScale) {
            scaleX = parentScale[0];
            scaleY = parentScale[1];
        } else if (pinchFlag) {
            if (parentDistance) {
                scaleX = (width + parentDistance) / width;
                scaleY = (height + parentDistance * height / width) / height;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });
            let distWidth = direction[0] * dist[0];
            let distHeight = direction[1] * dist[1];

            // diagonal
            if (
                keepRatio
                && direction[0] && direction[1]
                && width && height
            ) {
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const distDiagonal = Math.cos(rad - standardRad) * size;

                distWidth = distDiagonal;
                distHeight = distDiagonal * height / width;
            }
            const nextWidth = width + distWidth;
            const nextHeight = height + distHeight;
            scaleX = nextWidth / width;
            scaleY = nextHeight / height;
        }
        scaleX = direction[0]
            ? throttle(scaleX * startScale[0], throttleScale!)
            : startScale[0];
        scaleY = direction[1]
            ? throttle(scaleY * startScale[1], throttleScale!)
            : startScale[1];

        if (scaleX === 0) {
            scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (scaleY === 0) {
            scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }
        const nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        const scale = [scaleX, scaleY];
        datas.prevDist = nowDist;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
            return false;
        }
        let inverseDist = [0, 0];

        const delta = [nowDist[0] / prevDist[0], nowDist[1] / prevDist[1]];

        if (!pinchFlag && !parentScale) {
            inverseDist = getScaleDist(moveable, e, delta, direction, scale);
        }

        const params = {
            target: target!,
            scale,
            direction,
            dist: nowDist,
            delta,
            transform: `${transform} scale(${scaleX}, ${scaleY})`,
            clientX,
            clientY,
            datas: datas.datas,
            isPinch: !!pinchFlag,
            drag: Draggable.drag(
                moveable,
                setCustomEvent(dragClient[0] + inverseDist[0], dragClient[1] + inverseDist[1], datas, inputEvent),
            ) as OnDrag,
        };
        triggerEvent(moveable, "onScale", params);

        return params;
    },
    dragControlEnd(
        moveable: MoveableManager<ScalableProps>,
        { datas, isDrag, clientX, clientY }: any) {
        if (!datas.isScale) {
            return false;
        }

        datas.isScale = false;

        triggerEvent(moveable, "onScaleEnd", {
            target: moveable.state.target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroup, e: any) {
        const { datas } = e;

        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }
        const {
            left: parentLeft,
            top: parentTop,
            origin: parentOrigin,
        } = moveable.state;

        const parentAbsoluteOrigin = [
            parentLeft + parentOrigin[0],
            parentTop + parentOrigin[1],
        ];

        datas.rotation = moveable.rotation;
        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            child => {
                const { left, top, origin } = child.state;

                const dragClient = [
                    left + origin[0] - parentAbsoluteOrigin[0],
                    top + origin[1] - parentAbsoluteOrigin[1],
                ];
                return { ...e, dragClient };
            },
        );

        const nextParams: OnScaleGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent(moveable, "onScaleGroupStart", nextParams);

        datas.isScale = result !== false;
        return datas.isScale ? nextParams : false;
    },
    dragGroupControl(moveable: MoveableGroup, e: any) {
        const { datas } = e;
        if (!datas.isScale) {
            return;
        }
        const params = this.dragControl(moveable, e);
        if (!params) {
            return;
        }
        const { scale, drag: { beforeDist } } = params;

        const events = triggerChildAble(
            moveable,
            this,
            "dragControl",
            datas,
            (_, childDatas) => {
                const { startX, startY } = getCustomEvent(childDatas);
                const startPos = rotate([
                    startX,
                    startY,
                ], -datas.rotation / 180 * Math.PI);
                const [clientX, clientY] = rotate([
                    startPos[0] * scale[0],
                    startPos[1] * scale[1],
                ], moveable.rotation / 180 * Math.PI);

                return { ...e, parentScale: scale, dragClient: [clientX + beforeDist[0], clientY + beforeDist[1]] };
            },
        );
        const nextParams: OnScaleGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        triggerEvent(moveable, "onScaleGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroup, e: any) {
        const { clientX, clientY, isDrag, datas } = e;

        if (!datas.isScale) {
            return;
        }
        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnScaleGroupEnd = {
            targets: moveable.props.targets!,
            clientX,
            clientY,
            isDrag,
            datas: datas.datas,
        };

        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
    },
};
