import { throttle, prefix, triggerEvent } from "../utils";
import { IObject, hasClass } from "@daybrush/utils";
import MoveableManager from "../MoveableManager";
import { RotatableProps, OnRotateGroup, OnRotateGroupEnd, Renderer, OnRotateGroupStart } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import Draggable from "./Draggable";
import { minus, plus, getRad, rotate as rotateMatrix } from "@moveable/matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";

function setRotateStartInfo(
    datas: IObject<any>, clientX: number, clientY: number, origin: number[], rotationPos: number[]) {
    datas.startAbsoluteOrigin = [
        clientX - rotationPos[0] + origin[0],
        clientY - rotationPos[1] + origin[1],
    ];
    datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
    datas.startDeg = datas.prevDeg;
    datas.loop = 0;
}
function getDeg(
    datas: IObject<any>,
    deg: number,
    direction: number,
    startRotate: number,
    throttleRotate: number,
) {
    const {
        prevDeg,
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
    const absolutePrevDeg = prevLoop * 360 + prevDeg - startDeg + startRotate;
    let absoluteDeg = loop * 360 + deg - startDeg + startRotate;

    absoluteDeg = throttle(absoluteDeg, throttleRotate);
    const delta = direction * (absoluteDeg - absolutePrevDeg);
    const dist = direction * (absoluteDeg - startRotate);

    datas.prevDeg = absoluteDeg - loop * 360 + startDeg - startRotate;

    return [delta, dist, absoluteDeg];
}
function getRotateInfo(
    datas: IObject<any>,
    direction: number,
    clientX: number, clientY: number,
    startRotate: number,
    throttleRotate: number,
) {
    return getDeg(
        datas,
        getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        direction,
        startRotate,
        throttleRotate,
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
export function getRotationRad(
    poses: number[][],
    direction: number,
) {
    return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
}
export function getRotationPosition(
    [pos1, pos2]: number[][],
    rad: number,
): number[] {
    const relativeRotationPos = rotateMatrix([0, -40, 1], rad);

    const rotationPos = [
        (pos1[0] + pos2[0]) / 2 + relativeRotationPos[0],
        (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1],
    ];

    return rotationPos;
}

function dragControlCondition(target: HTMLElement | SVGElement) {
    return hasClass(target, prefix("rotation"));
}

export default {
    name: "rotatable",
    canPinch: true,

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
                transform: `translate(${(poses[0][0] + poses[1][0]) / 2}px, ${(poses[0][1] + poses[1][1]) / 2}px) translateY(-40px) rotate(${rotationRad}rad)`,
            }}>
                <div className={prefix("control", "rotation")}></div>
            </div>
        );
    },
    dragControlCondition,
    dragControlStart(
        moveable: MoveableManager<RotatableProps>,
        { datas, clientX, clientY, parentRotate, parentFlag, pinchFlag, inputEvent }: any) {
        const {
            target, left, top, origin, beforeOrigin,
            direction, beforeDirection, targetTransform,
            pos1, pos2, pos3, pos4,
        } = moveable.state;

        if (!target) {
            return false;
        }

        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;

        const poses = getPositions(moveable.props.rotationPosition!, pos1, pos2, pos3, pos4);
        const rotationPos = getRotationPosition(
            poses,
            getRotationRad(poses, direction),
        );

        if (pinchFlag || parentFlag) {
            datas.beforeInfo = { prevDeg: parentRotate, startDeg: parentRotate, loop: 0 };
            datas.afterInfo = { prevDeg: parentRotate, startDeg: parentRotate, loop: 0 };
        } else {
            datas.afterInfo = {};
            datas.beforeInfo = {};
            setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, rotationPos);
            setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, rotationPos);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.startRotate = 0;
        datas.datas = {};

        const params = {
            datas: datas.datas,
            target,
            clientX,
            clientY,
            inputEvent,
            set: (rotatation: number) => {
                datas.startRotate = rotatation;
            },
        };
        const result = triggerEvent(moveable, "onRotateStart", params);
        datas.isRotate = result !== false;

        return datas.isRotate ? params : false;
    },
    dragControl(
        moveable: MoveableManager<RotatableProps>,
        { datas, clientX, clientY, parentRotate, parentFlag, pinchFlag, inputEvent }: any,
    ) {
        const {
            direction,
            beforeDirection,
            beforeInfo,
            afterInfo,
            isRotate,
            startRotate,
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
            [delta, dist, rotate] = getDeg(afterInfo, parentRotate, direction, startRotate, throttleRotate);
            [beforeDelta, beforeDist, beforeRotate]
                = getDeg(beforeInfo, parentRotate, direction, startRotate, throttleRotate);
        } else {
            [delta, dist, rotate] = getRotateInfo(afterInfo, direction, clientX, clientY, startRotate, throttleRotate);
            [beforeDelta, beforeDist, beforeRotate] = getRotateInfo(
                beforeInfo, beforeDirection, clientX, clientY, startRotate, throttleRotate,
            );
        }

        if (!delta && !beforeDelta && !parentMoveable) {
            return;
        }
        const params = {
            target: moveable.props.target!,
            datas: datas.datas,
            inputEvent,
            clientX,
            clientY,
            delta,
            dist,
            rotate,
            beforeDist,
            beforeDelta,
            beforeRotate,
            transform: `${datas.transform} rotate(${dist}deg)`,
            isPinch: !!pinchFlag,
        };
        triggerEvent(moveable, "onRotate", params);

        return params;
    },
    dragControlEnd(
        moveable: MoveableManager<RotatableProps>, { datas, isDrag, clientX, clientY, inputEvent }: any) {

        if (!datas.isRotate) {
            return false;
        }
        datas.isRotate = false;

        triggerEvent(moveable, "onRotateEnd", {
            datas: datas.datas,
            inputEvent,
            clientX,
            clientY,
            target: moveable.state.target!,
            isDrag,
        });
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
        return datas.isDrag ? params : false;
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
                    setCustomDrag(child.state, delta, inputEvent),
                );

                result.drag = dragResult;
            },
        );
        const nextParams: OnRotateGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        moveable.rotation += params.beforeDelta;
        triggerEvent(moveable, "onRotateGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroup, e: any) {
        const { clientX, clientY, isDrag, datas } = e;

        if (!datas.isRotate) {
            return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnRotateGroupEnd = {
            targets: moveable.props.targets!,
            clientX,
            clientY,
            isDrag,
            datas: datas.datas,
        };

        triggerEvent(moveable, "onRotateGroupEnd", nextParams);
        return isDrag;
    },
};
