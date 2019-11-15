import {
    throttle, getDirection, triggerEvent, multiply2, getAbsolutePosesByState,
    fillParams, getKeepRatioHeight, getKeepRatioWidth,
} from "../utils";
import { MIN_SCALE } from "../consts";
import { setDragStart, getDragDist, getScaleDist, getPosByReverseDirection } from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import { renderAllDirections, renderDiagonalDirections } from "../renderDirection";
import {
    ScalableProps, ResizableProps, OnScaleGroup, OnScaleGroupEnd,
    Renderer, OnScaleGroupStart, DraggableProps, OnDragStart,
    OnDrag, SnappableState, GroupableProps, OnScaleStart, OnScale, OnScaleEnd,
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
    ableGroup: "size",
    canPinch: true,
    render(moveable: MoveableManager<Partial<ResizableProps & ScalableProps>>, React: Renderer): any[] | undefined {
        const { resizable, scalable, edge } = moveable.props;
        if (!resizable && scalable) {
            if (edge) {
                return renderDiagonalDirections(moveable, React);
            }
            return renderAllDirections(moveable, React);
        }
    },
    dragControlCondition: directionCondition,
    dragControlStart(
        moveable: MoveableManager<ScalableProps & DraggableProps, SnappableState>,
        e: any) {

        const { datas, pinchFlag, inputEvent } = e;
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

        const params = fillParams<OnScaleStart>(moveable, e, {
            direction,
            set: (scale: number[]) => {
                datas.startScale = scale;
            },
            dragStart: Draggable.dragStart(
                moveable,
                new CustomDragger().dragStart([0, 0], inputEvent),
            ) as OnDragStart,
        });
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
            datas, distX, distY, parentScale, parentDistance,
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
            throttleScale,
            parentMoveable,
        } = moveable.props;
        const keepRatio = moveable.props.keepRatio || parentScale;
        const state = moveable.state;
        const isWidth = direction[0] || !direction[1];
        let scaleX: number = 1;
        let scaleY: number = 1;
        const startWidth = width * startScale[0];
        const startHeight = height * startScale[1];
        const ratio = isWidth ? startHeight / startWidth : startWidth / startHeight;

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

            if (keepRatio && width && height) {
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const ratioRad = getRad([0, 0], [startWidth, startHeight]);
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const signSize = Math.cos(rad - standardRad) * size;

                if (!direction[0]) {
                    // top, bottom
                    distHeight = signSize;
                    distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
                } else if (!direction[1]) {
                    // left, right
                    distWidth = signSize;
                    distHeight = getKeepRatioHeight(distWidth, isWidth, ratio);
                } else {
                    // two-way
                    distWidth = Math.cos(ratioRad) * signSize;
                    distHeight = Math.sin(ratioRad) * signSize;
                }
            }
            scaleX = (width + distWidth) / width;
            scaleY = (height + distHeight) / height;
        }
        scaleX = direction[0] ? scaleX * startScale[0] : startScale[0];
        scaleY = direction[1] ? scaleY * startScale[1] : startScale[1];

        if (scaleX === 0) {
            scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (scaleY === 0) {
            scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        const nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        let scale = [scaleX, scaleY];
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
        let snapDist = [0, 0];

        if (!pinchFlag) {
            snapDist = checkSnapScale(moveable, nowDist, direction, snapDirection, datas);
        }

        if (keepRatio) {
            if (direction[0] && direction[1] && snapDist[0] && snapDist[1]) {
                if (Math.abs(snapDist[0]) > Math.abs(snapDist[1])) {
                    snapDist[1] = 0;
                } else {
                    snapDist[0] = 0;
                }
            }

            const isNoSnap = !snapDist[0] && !snapDist[1];

            if (isNoSnap) {
                if (isWidth) {
                    nowDist[0] = throttle(nowDist[0] * startScale[0], throttleScale!) / startScale[0];
                } else {
                    nowDist[1] = throttle(nowDist[1] * startScale[1], throttleScale!) / startScale[1];
                }
            }
            if (
                (direction[0] && !direction[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                nowDist[0] += snapDist[0];
                const snapHeight = getKeepRatioHeight(width * nowDist[0] * startScale[0], isWidth, ratio);

                nowDist[1] = snapHeight / height / startScale[1];
            } else if (
                (!direction[0] && direction[1])
                || (!snapDist[0] && snapDist[1])
                || (isNoSnap && !isWidth)
            ) {
                nowDist[1] += snapDist[1];
                const snapWidth = getKeepRatioWidth(height * nowDist[1] * startScale[1], isWidth, ratio);

                nowDist[0] = snapWidth / width / startScale[0];
            }
        } else {
            if (!snapDist[0]) {
                nowDist[0] = throttle(nowDist[0] * startScale[0], throttleScale!) / startScale[0];
            }
            if (!snapDist[1]) {
                nowDist[1] = throttle(nowDist[1] * startScale[1], throttleScale!) / startScale[1];
            }
        }
        if (nowDist[0] === 0) {
            nowDist[0] = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (nowDist[1] === 0) {
            nowDist[1] = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }
        const delta = [nowDist[0] / prevDist[0], nowDist[1] / prevDist[1]];
        scale = multiply2(nowDist, startScale);

        datas.prevDist = nowDist;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
            return false;
        }
        const inverseDelta = !parentFlag && pinchFlag
            ? [0, 0]
            : getScaleDist(moveable, delta, direction, dragClient);

        const params = fillParams<OnScale>(moveable, e, {
            scale,
            direction,
            dist: nowDist,
            delta,
            transform: `${transform} scale(${scaleX}, ${scaleY})`,
            isPinch: !!pinchFlag,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(moveable.state, inverseDelta, inputEvent),
            ) as OnDrag,
        });
        triggerEvent(moveable, "onScale", params);

        return params;
    },
    dragControlEnd(moveable: MoveableManager<ScalableProps>, e: any) {
        const { datas, isDrag } = e;
        if (!datas.isScale) {
            return false;
        }

        datas.isScale = false;

        triggerEvent(moveable, "onScaleEnd", fillParams<OnScaleEnd>(moveable, e, {
            isDrag,
        }));
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
        const { isDrag, datas } = e;

        if (!datas.isScale) {
            return;
        }
        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams = fillParams<OnScaleGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            isDrag,
        });

        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
    },
};
