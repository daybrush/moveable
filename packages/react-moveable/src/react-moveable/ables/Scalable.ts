import {
    throttle, getDirection, triggerEvent, multiply2,
    fillParams, getKeepRatioHeight, getKeepRatioWidth, getDistSize, fillEndParams,
} from "../utils";
import { MIN_SCALE } from "../consts";
import {
    setDragStart, getDragDist,
    getScaleDist,
    getAbsoluteFixedPosition,
} from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import { renderAllDirections, renderDiagonalDirections } from "../renderDirection";
import {
    ScalableProps, ResizableProps, OnScaleGroup, OnScaleGroupEnd,
    Renderer, OnScaleGroupStart, DraggableProps, OnDragStart,
    OnDrag, SnappableState, GroupableProps, OnScaleStart, OnScale, OnScaleEnd,
} from "../types";
import {
    triggerChildAble,
} from "../groupUtils";
import MoveableGroup from "../MoveableGroup";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix, plus } from "../matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapScale } from "./Snappable";
import { isArray, IObject } from "@daybrush/utils";
import {
    directionCondition,
} from "./utils";

/**
 * @namespace Scalable
 * @memberof Moveable
 */
export default {
    name: "scalable",
    ableGroup: "size",
    canPinch: true,
    props: {
        scalable: Boolean,
        throttleScale: Number,
        renderDirections: String,
        keepRatio: Boolean,
    },
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

        const { datas, isPinch, inputEvent, parentDirection } = e;
        const direction = parentDirection || (isPinch ? [0, 0] : getDirection(inputEvent.target));
        const {
            width,
            height,
            targetTransform,
            target,
        } = moveable.state;

        if (!direction || !target) {
            return false;
        }
        if (!isPinch) {
            setDragStart(moveable, { datas });
        }

        datas.datas = {};
        datas.transform = targetTransform;
        datas.prevDist = [1, 1];
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.startScale = [1, 1];
        datas.fixedPosition = getAbsoluteFixedPosition(moveable, direction);

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
            moveable.state.snapRenderInfo = {
                request: e.isRequest,
                direction,
            };

        }
        return datas.isScale ? params : false;
    },
    dragControl(
        moveable: MoveableManager<ScalableProps & DraggableProps & GroupableProps, SnappableState>,
        e: any) {
        const {
            datas, distX, distY,
            parentScale,
            parentDistance,
            parentKeepRatio,
            parentFlag, isPinch, inputEvent,
            dragClient,
            parentDist,
            isRequest,
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
        let sizeDirection = direction;

        if (!direction[0] && !direction[1]) {
            sizeDirection = [1, 1];
        }
        const keepRatio = moveable.props.keepRatio || parentKeepRatio;
        const state = moveable.state;
        const isWidth = sizeDirection[0] || !sizeDirection[1];
        const startWidth = width * startScale[0];
        const startHeight = height * startScale[1];
        const ratio = isWidth ? startHeight / startWidth : startWidth / startHeight;
        let scaleX: number = 1;
        let scaleY: number = 1;
        let fixedPosition = dragClient;

        if (!dragClient) {
            if (!parentFlag && isPinch) {
                fixedPosition = getAbsoluteFixedPosition(moveable, [0, 0]);
            } else {
                fixedPosition = datas.fixedPosition;
            }
        }

        if (parentDist) {
            scaleX = (width + parentDist[0]) / width;
            scaleY = (height + parentDist[1]) / height;
        } else if (parentScale) {
            scaleX = parentScale[0];
            scaleY = parentScale[1];
        } else if (isPinch) {
            if (parentDistance) {
                scaleX = (width + parentDistance) / width;
                scaleY = (height + parentDistance * height / width) / height;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });
            let distWidth = sizeDirection[0] * dist[0];
            let distHeight = sizeDirection[1] * dist[1];

            if (keepRatio && width && height) {
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], sizeDirection);
                const ratioRad = getRad([0, 0], [startWidth, startHeight]);
                const size = getDistSize([distWidth, distHeight]);
                const signSize = Math.cos(rad - standardRad) * size;

                if (!sizeDirection[0]) {
                    // top, bottom
                    distHeight = signSize;
                    distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
                } else if (!sizeDirection[1]) {
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

        scaleX = sizeDirection[0] || keepRatio ? scaleX * startScale[0] : startScale[0];
        scaleY = sizeDirection[1] || keepRatio ? scaleY * startScale[1] : startScale[1];

        if (scaleX === 0) {
            scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (scaleY === 0) {
            scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        const nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        let scale = [scaleX, scaleY];

        if (!isPinch && moveable.props.groupable) {
            const snapRenderInfo = state.snapRenderInfo || {};
            const stateDirection = snapRenderInfo.direction;

            if (isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
                state.snapRenderInfo = { direction, request: e.isRequest, };
            }
        }
        let snapDist = [0, 0];

        if (!isPinch) {
            snapDist = checkSnapScale(
                moveable,
                nowDist,
                direction,
                datas.fixedPosition,
                isRequest,
                datas,
            );
        }

        if (keepRatio) {
            if (sizeDirection[0] && sizeDirection[1] && snapDist[0] && snapDist[1]) {
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
                (sizeDirection[0] && !sizeDirection[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                nowDist[0] += snapDist[0];
                const snapHeight = getKeepRatioHeight(width * nowDist[0] * startScale[0], isWidth, ratio);

                nowDist[1] = snapHeight / height / startScale[1];
            } else if (
                (!sizeDirection[0] && sizeDirection[1])
                || (!snapDist[0] && snapDist[1])
                || (isNoSnap && !isWidth)
            ) {
                nowDist[1] += snapDist[1];
                const snapWidth = getKeepRatioWidth(height * nowDist[1] * startScale[1], isWidth, ratio);

                nowDist[0] = snapWidth / width / startScale[0];
            }
        } else {
            nowDist[0] += snapDist[0];
            nowDist[1] += snapDist[1];
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

        const inverseDelta = getScaleDist(moveable, delta, direction, fixedPosition);
        if (
            scaleX === prevDist[0] && scaleY === prevDist[1]
            && inverseDelta.every(num => !num)
            && !parentMoveable
        ) {
            return false;
        }

        const params = fillParams<OnScale>(moveable, e, {
            scale,
            direction,
            dist: nowDist,
            delta,
            transform: `${transform} scale(${scaleX}, ${scaleY})`,
            isPinch: !!isPinch,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(moveable.state, inverseDelta, inputEvent, isPinch, false),
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

        triggerEvent(moveable, "onScaleEnd", fillEndParams<OnScaleEnd>(moveable, e, {}));
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
        const startPos = getAbsoluteFixedPosition(moveable, direction);
        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const pos = getAbsoluteFixedPosition(child, direction);
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
        const keepRatio = moveable.props.keepRatio;
        const { scale } = params;
        const startPos = getAbsoluteFixedPosition(moveable, datas.direction);

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

                return {
                    ...e,
                    parentDist: null,
                    parentScale: scale,
                    parentKeepRatio: keepRatio,
                    dragClient: plus(startPos, [clientX, clientY]),
                };
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

        const nextParams = fillEndParams<OnScaleGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
        });

        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Scalable#request
     * @param {object} [e] - the Resizable's request parameter
     * @param {number} [e.direction=[1, 1]] - Direction to scale
     * @param {number} [e.deltaWidth] - delta number of width
     * @param {number} [e.deltaHeight] - delta number of height
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("scalable", { deltaWidth: 10, deltaHeight: 10 }, true);
     *
     * // requestStart
     * const requester = moveable.request("scalable");
     *
     * // request
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request() {
        const datas = {};
        let distWidth = 0;
        let distHeight = 0;

        return {
            isControl: true,
            requestStart(e: IObject<any>) {
                return { datas, parentDirection: e.direction || [1, 1] };
            },
            request(e: IObject<any>) {
                distWidth += e.deltaWidth;
                distHeight += e.deltaHeight;

                return { datas, parentDist: [distWidth, distHeight] };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
};
