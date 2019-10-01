import { throttle, getDirection, triggerEvent, multiply2, getAbsolutePosesByState } from "../utils";
import { MIN_SCALE } from "../consts";
import { setDragStart, getDragDist, getScaleDist, getPosByReverseDirection } from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import { renderAllDirection, renderDiagonalDirection } from "../renderDirection";
import {
    ScalableProps, ResizableProps, OnScaleGroup, OnScaleGroupEnd,
    Renderer, OnScaleGroupStart, DraggableProps, OnDragStart, OnDrag, SnappableState, GroupableProps,
} from "../types";
import {
    directionCondition, triggerChildAble,
} from "../groupUtils";
import MoveableGroup from "../MoveableGroup";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix, plus } from "@moveable/matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapScale } from "./Snappable";
import { isArray } from "@daybrush/utils";

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
        moveable: MoveableManager<ScalableProps & DraggableProps, SnappableState>,
        e: any) {

        const { datas, clientX, clientY, pinchFlag, inputEvent } = e;
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

        const params = {
            target,
            clientX,
            clientY,
            datas: datas.datas,
            direction,
            set: (scale: number[]) => {
                datas.startScale = scale;
            },
            dragStart: Draggable.dragStart(
                moveable,
                new CustomDragger().dragStart([0, 0], inputEvent),
            ) as OnDragStart,
        };
        const result = triggerEvent(moveable, "onScaleStart", params);

        if (result !== false) {
            datas.isScale = true;
            moveable.state.snapDirection = direction;

        }
        return datas.isScale ? params : false;
    },
    dragControl(
        moveable: MoveableManager<ScalableProps & DraggableProps & GroupableProps, SnappableState>,
        e: any) {
        const {
            datas, clientX, clientY, distX, distY, parentScale, parentDistance,
            parentFlag, pinchFlag, inputEvent,
            dragClient,
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

        const {
            keepRatio,
            throttleScale,
            parentMoveable,
        } = moveable.props;
        const state = moveable.state;
        const target = state.target;
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
                && width && height
            ) {
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const distDiagonal = Math.cos(rad - standardRad) * size;

                distWidth = distDiagonal;
                distHeight = distDiagonal * height / width;
            }
            scaleX = (width + distWidth) / width;
            scaleY = (height + distHeight) / height;
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
        let scale = [scaleX, scaleY];
        let nowDist = [scaleX / startScale[0], scaleY / startScale[1]];

        let snapDirection = direction;

        if (moveable.props.groupable) {
            snapDirection = [
                (nowDist[0] >= 0 ? 1 : -1) * direction[0],
                (nowDist[1] >= 0 ? 1 : -1) * direction[1],
            ];
            const stateDirection = state.snapDirection;

            if (isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
                state.snapDirection = snapDirection;
            }
        }
        nowDist = checkSnapScale(moveable, nowDist, direction, snapDirection, datas);

        if (keepRatio && !parentScale && !pinchFlag && (!direction[0] || !direction[1])) {
            const distWidth = width * nowDist[0] - width;
            const distHeight = height * nowDist[1] - height;

            if (direction[0]) {
                nowDist[1] = throttle((height + distWidth * height / width) / height, throttleScale!);
            } else {
                nowDist[0] = throttle((width + distHeight * width / height) / width, throttleScale!);
            }
        }
        const  delta = [nowDist[0] / prevDist[0], nowDist[1] / prevDist[1]];
        // const prevScale = scale;
        scale = multiply2(nowDist, startScale);

        datas.prevDist = nowDist;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
            return false;
        }
        const inverseDelta = !parentFlag && pinchFlag
            ? [0, 0]
            : getScaleDist(moveable, delta, direction, dragClient);

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
                setCustomDrag(moveable.state, inverseDelta, inputEvent),
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
        const direction = params.direction;
        const startPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);

        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const pos = getPosByReverseDirection(getAbsolutePosesByState(child.state), direction);
                const [originalX, originalY] = caculate(
                    createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
                    [pos[0] - startPos[0], pos[1] - startPos[1], 1],
                    3,
                );
                childDatas.originalX = originalX;
                childDatas.originalY = originalY;

                return e;
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
        const { scale, direction, dist } = params;
        const prevPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), multiply2(direction, dist));

        const events = triggerChildAble(
            moveable,
            this,
            "dragControl",
            datas,
            (_, childDatas) => {
                const [clientX, clientY] = caculate(
                    createRotateMatrix(moveable.rotation / 180 * Math.PI, 3),
                    [
                        childDatas.originalX * scale[0],
                        childDatas.originalY * scale[1],
                        1,
                    ],
                    3,
                );

                return { ...e, parentScale: scale, dragClient: plus(prevPos, [clientX, clientY]) };
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
