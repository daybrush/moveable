import React from "react";
import { refs, ref } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";
import { prefix } from "../utils";
import Draggable from "./Draggable";
import { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";

export default {
    name: "groupable",
    render(moveable: MoveableGroup) {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        const { left, top, width, height } = moveable.state;
        const position = { left, top };

        return [...targets.map((target, i) => {
            return <MoveableManager
                key={i}
                ref={refs(moveable, "moveables", i)}
                target={target}
                origin={false}
                parentMoveable={moveable}
                parentPosition={position}
            />;
        }),
        <div key="groupTarget" ref={ref(moveable, "groupTargetElement")} className={prefix("group")} style={{
            width: `${width}px`,
            height: `${height}px`,
        }} />,
        ];
    },
    dragStart(moveable: MoveableGroup, e: OnDragStart) {
        console.log("start");
        const datas = e.datas;
        const draggableDatas = datas.draggable || (datas.draggable = []);

        moveable.moveables.forEach((child, i) => {
            const childDatas = draggableDatas[i] || (draggableDatas[i] = {});

            Draggable.dragStart(child, { ...e, datas: childDatas });
        });

        const { clientX, clientY } = e;

        moveable.triggerEvent("onGroupDragStart", {
            targets: moveable.props.targets,
            clientX,
            clientY,
        });
    },
    drag(moveable: MoveableGroup, e: OnDrag) {
        const draggableDatas = e.datas.draggable;

        const events = moveable.moveables.map((child, i) => {
            const childDatas = draggableDatas[i];

            return Draggable.drag(child, { ...e, datas: childDatas });
        });

        const { clientX, clientY } = e;

        moveable.triggerEvent("onGroupDrag", {
            targets: moveable.props.targets,
            clientX,
            clientY,
            events,
        });
    },
    dragEnd(moveable: MoveableGroup, e: OnDragEnd) {
        const draggableDatas = e.datas.draggable;

        moveable.moveables.forEach((child, i) => {
            const childDatas = draggableDatas[i];

            Draggable.dragEnd(child, { ...e, datas: childDatas });
        });
    },
};
