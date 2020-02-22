import { throttle, prefix, triggerEvent, fillParams, getRotationRad, getClientRect } from "../utils";
import { IObject, hasClass } from "@daybrush/utils";
import MoveableManager from "../MoveableManager";
import {
    RotatableProps, OnRotateGroup, OnRotateGroupEnd,
    Renderer, OnRotateGroupStart, OnRotateStart, OnRotate,
    OnRotateEnd, MoveableClientRect, SnappableProps, SnappableState,
} from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import Draggable from "./Draggable";
import { minus, plus, getRad, rotate as rotateMatrix } from "@moveable/matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapRotate } from "./Snappable";

function setRotateStartInfo(
    datas: IObject<any>, clientX: number, clientY: number, origin: number[], rect: MoveableClientRect) {
    datas.startAbsoluteOrigin = [
        rect.left + origin[0],
        rect.top + origin[1],
    ];

    datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
    datas.prevSnapDeg = datas.prevDeg;
    datas.startDeg = datas.prevDeg;
    datas.loop = 0;
}
function getDeg(
    moveable: MoveableManager<any, any>,
    moveableRect: any,
    datas: IObject<any>,
    deg: number,
    direction: number,
    startRotate: number,
    throttleRotate: number,
    isSnap?: boolean,
) {
    const {
        prevDeg,
        prevSnapDeg,
        startDeg,
        loop: prevLoop,
    } = datas;

    if (prevDeg > deg && prevDeg > 270 && deg < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
        // 0 => 360
        --datas.loop;
    }
    const loop = datas.loop;
    const absolutePrevSnapDeg = prevLoop * 360 + prevSnapDeg - startDeg + startRotate;
    let absoluteDeg = loop * 360 + deg - startDeg + startRotate;

    datas.prevDeg = absoluteDeg - loop * 360 + startDeg - startRotate;

    absoluteDeg = throttle(absoluteDeg, throttleRotate);
    let dist = direction * (absoluteDeg - startRotate);
    if (isSnap) {
        dist = checkSnapRotate(moveable, moveableRect, datas.origin, dist);
        absoluteDeg = dist / direction + startRotate;
    }
    datas.prevSnapDeg = absoluteDeg - loop * 360 + startDeg - startRotate;

    const delta = direction * (absoluteDeg - absolutePrevSnapDeg);

    return [delta, dist, absoluteDeg];
}
function getRotateInfo(
    moveable: MoveableManager<any, any>,
    moveableRect: any,
    datas: IObject<any>,
    direction: number,
    clientX: number, clientY: number,
    startRotate: number,
    throttleRotate: number,
) {
    return getDeg(
        moveable,
        moveableRect,
        datas,
        getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        direction,
        startRotate,
        throttleRotate,
        true,
    );
}

export function getPositions(
    rotationPosition: "top" | "bottom" | "left" | "right",
    pos1: number[],
    pos2: number[],
    pos3: number[],
    pos4: number[],
) {
    if (rotationPosition === "left") {
        return [pos3, pos1];
    } else if (rotationPosition === "right") {
        return [pos2, pos4];
    } else if (rotationPosition === "bottom") {
        return [pos4, pos3];
    }
    return [pos1, pos2];
}

export function dragControlCondition(e: any) {
    if (e.isRequest) {
        return false;
    }
    return hasClass(e.inputEvent.target, prefix("rotation"));
}

export default {
    name: "rotatable",
    canPinch: true,
    props: {
        rotatable: Boolean,
        rotationPosition: String,
        throttleRotate: Number,
    },
    render(moveable: MoveableManager<RotatableProps>, React: Renderer): any {
        const {
            rotatable,
            rotationPosition,
        } = moveable.props;
        if (!rotatable) {
            return null;
        }
        const { pos1, pos2, pos3, pos4, direction } = moveable.state;
        const poses = getPositions(rotationPosition!, pos1, pos2, pos3, pos4);
        const rotationRad = getRotationRad(poses, direction);

        return (
            <div key="rotation" className={prefix("line rotation-line")} style={{
                // tslint:disable-next-line: max-line-length
                transform: `translate(${(poses[0][0] + poses[1][0]) / 2}px, ${(poses[0][1] + poses[1][1]) / 2}px) rotate(${rotationRad}rad)`,
            }}>
                <div className={prefix("control", "rotation")}></div>
            </div>
        );
    },
    dragControlCondition,
    dragControlStart(
        moveable: MoveableManager<RotatableProps & SnappableProps, SnappableState>,
        e: any) {
        const { datas, clientX, clientY, parentRotate, parentFlag, pinchFlag } = e;
        const {
            target, left, top, origin, beforeOrigin,
            direction, beforeDirection, targetTransform,
        } = moveable.state;

        if (!target) {
            return false;
        }
        const rect = moveable.getRect();
        datas.rect = rect;
        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;

        if (pinchFlag || parentFlag) {
            datas.beforeInfo = { prevDeg: parentRotate, startDeg: parentRotate, prevSnapDeg: parentRotate, loop: 0 };
            datas.afterInfo = { prevDeg: parentRotate, startDeg: parentRotate, prevSnapDeg: parentRotate, loop: 0 };
        } else {
            datas.beforeInfo = { origin: rect.beforeOrigin };
            datas.afterInfo = { origin: rect.origin };

            const controlRect = getClientRect(moveable.controlBox.getElement());
            setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, controlRect);
            setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, controlRect);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.startRotate = 0;
        datas.datas = {};

        const params = fillParams<OnRotateStart>(moveable, e, {
            set: (rotatation: number) => {
                datas.startRotate = rotatation;
            },
        });
        const result = triggerEvent(moveable, "onRotateStart", params);
        datas.isRotate = result !== false;
        moveable.state.snapRenderInfo = {};

        return datas.isRotate ? params : false;
    },
    dragControl(
        moveable: MoveableManager<RotatableProps>,
        e: any,
    ) {
        const { datas, clientX, clientY, parentRotate, parentFlag, pinchFlag } = e;
        const {
            direction,
            beforeDirection,
            beforeInfo,
            afterInfo,
            isRotate,
            startRotate,
            rect,
        } = datas;

        if (!isRotate) {
            return;
        }
        const {
            throttleRotate = 0,
            parentMoveable,
        } = moveable.props;

        let delta: number;
        let dist: number;
        let rotate: number;
        let beforeDelta: number;
        let beforeDist: number;
        let beforeRotate: number;

        if (pinchFlag || parentFlag) {
            [delta, dist, rotate]
                = getDeg(moveable, rect, afterInfo, parentRotate, direction, startRotate, throttleRotate);
            [beforeDelta, beforeDist, beforeRotate]
                = getDeg(moveable, rect, beforeInfo, parentRotate, direction, startRotate, throttleRotate);
        } else {
            [delta, dist, rotate]
                = getRotateInfo(moveable, rect, afterInfo, direction, clientX, clientY, startRotate, throttleRotate);
            [beforeDelta, beforeDist, beforeRotate] = getRotateInfo(
                moveable, rect, beforeInfo, beforeDirection, clientX, clientY, startRotate, throttleRotate,
            );
        }

        if (!delta && !beforeDelta && !parentMoveable) {
            return;
        }
        const params = fillParams<OnRotate>(moveable, e, {
            delta,
            dist,
            rotate,
            beforeDist,
            beforeDelta,
            beforeRotate,
            transform: `${datas.transform} rotate(${dist}deg)`,
            isPinch: !!pinchFlag,
        });
        triggerEvent(moveable, "onRotate", params);

        return params;
    },
    dragControlEnd(moveable: MoveableManager<RotatableProps>, e: any) {
        const { datas, isDrag } = e;

        if (!datas.isRotate) {
            return false;
        }
        datas.isRotate = false;

        triggerEvent(moveable, "onRotateEnd", fillParams<OnRotateEnd>(moveable, e, {
            isDrag,
        }));
        return isDrag;
    },
    dragGroupControlCondition: dragControlCondition,
    dragGroupControlStart(moveable: MoveableGroup, e: any) {
        const { datas, inputEvent } = e;
        const {
            left: parentLeft,
            top: parentTop,
            beforeOrigin: parentBeforeOrigin,
        } = moveable.state;

        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }

        params.set(moveable.rotation);

        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            { ...e, parentRotate: 0 },
            (child, childDatas, eventParams) => {
                const { left, top, beforeOrigin } = child.state;
                const childClient = plus(
                    minus([left, top], [parentLeft, parentTop]),
                    minus(beforeOrigin, parentBeforeOrigin),
                );

                childDatas.prevClient = childClient;
                eventParams.dragStart = Draggable.dragStart(
                    child,
                    new CustomDragger().dragStart(childClient, inputEvent),
                );
            },
        );

        const nextParams: OnRotateGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent(moveable, "onRotateGroupStart", nextParams);

        datas.isRotate = result !== false;

        return datas.isRotate ? params : false;
    },
    dragGroupControl(moveable: MoveableGroup, e: any) {
        const { inputEvent, datas } = e;

        if (!datas.isRotate) {
            return;
        }
        const params = this.dragControl(moveable, e);

        if (!params) {
            return;
        }
        const parentRotate = params.beforeDist;
        const deg = params.beforeDelta;
        const rad = deg / 180 * Math.PI;

        const events = triggerChildAble(
            moveable,
            this,
            "dragControl",
            datas,
            { ...e, parentRotate },
            (child, childDatas, result, i) => {
                const [prevX, prevY] = childDatas.prevClient;
                const [clientX, clientY] = rotateMatrix([prevX, prevY], rad);
                const delta = [clientX - prevX, clientY - prevY];

                childDatas.prevClient = [clientX, clientY];

                const dragResult = Draggable.drag(
                    child,
                    setCustomDrag(child.state, delta, inputEvent, false),
                );
                result.drag = dragResult;
            },
        );
        moveable.rotation = params.beforeRotate;

        const nextParams: OnRotateGroup = {
            targets: moveable.props.targets!,
            events,
            set: (rotation: number) => {
                moveable.rotation = rotation;
            },
            ...params,
        };

        triggerEvent(moveable, "onRotateGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroup, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isRotate) {
            return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnRotateGroupEnd = fillParams(moveable, e, {
            targets: moveable.props.targets!,
            isDrag,
        });

        triggerEvent(moveable, "onRotateGroupEnd", nextParams);
        return isDrag;
    },
};
