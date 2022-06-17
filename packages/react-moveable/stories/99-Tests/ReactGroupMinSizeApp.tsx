import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3">Target3</div>
        <Moveable
            target={".target"}
            draggable={true}
            resizable={true}
            onResizeGroupStart={({ events }) => {
                events[0].setMin([50, 50]);
                events[1].setMin([60, 50]);
                events[2].setMin([50, 60]);
            }}
            onResizeGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.width = `${ev.width}px`;
                    ev.target.style.height = `${ev.height}px`;
                    ev.target.style.transform = ev.drag.transform;
                });
            }}
            onDragGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.transform = ev.transform;
                });
            }}
            onDragGroupEnd={({ events }) => {
                console.log(events);
            }}
        />
    </div>;
}
