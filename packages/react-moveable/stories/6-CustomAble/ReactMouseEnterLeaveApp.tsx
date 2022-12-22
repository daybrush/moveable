import * as React from "react";
import Moveable, { makeAble, MoveableManagerInterface } from "@/react-moveable";

const MouseEnterLeaveAble = makeAble("enterLeave", {
    mouseEnter(moveable: MoveableManagerInterface) {
        if (moveable.moveables) {
            // group
            moveable.moveables.forEach(child => {
                child.state.target!.style.backgroundColor = "#e55";
            });
        } else {
            // single
            moveable.state.target!.style.backgroundColor = "#e55";
        }
    },
    mouseLeave(moveable: MoveableManagerInterface) {
        if (moveable.moveables) {
            // group
            moveable.moveables.forEach(child => {
                child.state.target!.style.backgroundColor = "";
            });
        } else {
            // single
            moveable.state.target!.style.backgroundColor = "";
        }
    },
});

export default function App() {
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3" ref={targetRef}>Target3</div>
        <Moveable
            target={targetRef}
            ables={[MouseEnterLeaveAble]}
            origin={false}
            props={{
                enterLeave: true,
            }}
            draggable={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
        <Moveable
            target={[".target1", ".target2"]}
            ables={[MouseEnterLeaveAble]}
            origin={false}
            props={{
                enterLeave: true,
            }}
            draggable={true}
            onDragGroup={e => {
                e.events.forEach(ev => {
                    ev.target.style.transform = ev.transform;
                });
            }}
        />
    </div>;
}
