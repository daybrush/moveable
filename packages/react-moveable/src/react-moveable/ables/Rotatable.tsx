import React from "react";
import { getRad, throttle, prefix } from "../utils";
import { IObject, hasClass } from "@daybrush/utils";
import MoveableManager from "../MoveableManager";
import { RotatableProps } from "../types";

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
    throttleRotate: number,
) {
    const {
        prevDeg,
        startDeg,
        loop: prevLoop,
    } = datas;
    deg = throttle(deg, throttleRotate);
    if (prevDeg > deg && prevDeg > 270 && deg < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
        // 0 => 360
        --datas.loop;
    }
    const absolutePrevDeg = prevLoop * 360 + prevDeg;
    const absoluteDeg = datas.loop * 360 + deg;

    const delta = direction * (absoluteDeg - absolutePrevDeg);
    const dist = direction * (absoluteDeg - startDeg);

    datas.prevDeg = deg;

    return [delta, dist];
}
function getRotateInfo(
    datas: IObject<any>,
    direction: number,
    clientX: number, clientY: number,
    throttleRotate: number,
) {
    return getDeg(
        datas,
        getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        direction,
        throttleRotate,
    );
}

export default {
    name: "rotatable",
    render(moveable: MoveableManager<RotatableProps>) {
        if (!moveable.props.rotatable) {
            return null;
        }

        const { pos1, pos2, rotationRad } = moveable.state;

        return (
            <div className={prefix("line rotation-line")} style={{
                // tslint:disable-next-line: max-line-length
                transform: `translate(${(pos1[0] + pos2[0]) / 2}px, ${(pos1[1] + pos2[1]) / 2}px) translateY(-40px) rotate(${rotationRad}rad)`,
            }}>
                <div className={prefix("control", "rotation")}></div>
            </div>
        );
    },
    dragControlCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("rotation"));
    },
    dragControlStart(
        moveable: MoveableManager<RotatableProps>,
        { datas, clientX, clientY, pinchRotate, pinchFlag }: any) {
        const { target, onRotateStart } = moveable.props;

        if (!target) {
            return false;
        }
        const state = moveable.state;
        const {
            left, top, origin, beforeOrigin,
            rotationPos, direction, beforeDirection, targetTransform,
        } = state;

        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;

        if (pinchFlag) {
            datas.beforeInfo = { prevDeg: pinchRotate, startDeg: pinchRotate, loop: 0 };
            datas.afterInfo = { prevDeg: pinchRotate, startDeg: pinchRotate, loop: 0 };
        } else {
            datas.afterInfo = {};
            datas.beforeInfo = {};
            setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, rotationPos);
            setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, rotationPos);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.datas = {};

        const result = onRotateStart && onRotateStart!({
            datas: datas.datas,
            target,
            clientX,
            clientY,
        });
        if (result !== false) {
            datas.isRotate = true;
        }
        return result;
    },
    dragControl(
        moveable: MoveableManager<RotatableProps>, { datas, clientX, clientY, pinchRotate, pinchFlag }: any) {
        const {
            direction,
            beforeDirection,
            beforeInfo,
            afterInfo,
            isRotate,
        } = datas;

        if (!isRotate) {
            return false;
        }
        const {
            throttleRotate = 0,
            onRotate,
        } = moveable.props;

        let delta: number;
        let dist: number;
        let beforeDelta: number;
        let beforeDist: number;

        if (pinchFlag) {
            [delta, dist] = getDeg(afterInfo, pinchRotate, direction, throttleRotate);
            [beforeDelta, beforeDist] = getDeg(beforeInfo, pinchRotate, direction, throttleRotate);
        } else {
            [delta, dist] = getRotateInfo(afterInfo, direction, clientX, clientY, throttleRotate);
            [beforeDelta, beforeDist] = getRotateInfo(
                beforeInfo, beforeDirection, clientX, clientY, throttleRotate);
        }
        if (!delta && !beforeDelta) {
            return false;
        }
        onRotate && onRotate({
            target: moveable.props.target!,
            datas: datas.datas,
            delta,
            dist,
            clientX,
            clientY,
            beforeDist,
            beforeDelta,
            transform: `${datas.transform} rotate(${dist}deg)`,
            isPinch: !!pinchFlag,
        });

        return true;
    },
    dragControlEnd(
        moveable: MoveableManager<RotatableProps>, { datas, isDrag, clientX, clientY }: any) {
        const onRotateEnd = moveable.props.onRotateEnd;

        if (!datas.isRotate) {
            return false;
        }
        datas.isRotate = false;
        onRotateEnd && onRotateEnd!({
            datas: datas.datas,
            clientX,
            clientY,
            target: moveable.props.target!,
            isDrag,
        });
        return isDrag;
    },
};
