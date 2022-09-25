import * as React from "react";
import { useState } from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const [groupInstances, setGroupInstances] = useState<any[]>([]);
    const t1 = React.useRef<any>(null);
    const t2 = React.useRef<any>(null);
    const groupMoveable = React.useRef<any>(null);

    function initGroupElements() {
        const arr: any[] = [];
        arr.push(document.getElementsByClassName("target1")[0]);
        arr.push(document.getElementsByClassName("target2")[0]);
        setGroupInstances(arr);
    }

    function handleDragStart(e: any) {
        initGroupElements();
        groupMoveable.current!.dragStart(e.inputEvent);
    }

    return (
        <div className="root">
            <div className="container">
                <div className={`target target1`}>Target 1</div>
                <div className={`target target2`}>Target 2</div>
                <Moveable
                    ref={t1}
                    target={`.target1` as string}
                    draggable={true}
                    edgeDraggable={true}
                    origin={false}
                    onDragStart={handleDragStart}
                />
                <Moveable
                    ref={t2}
                    target={`.target2` as string}
                    draggable={true}
                    origin={false}
                    edgeDraggable={true}
                    onDragStart={handleDragStart}
                />
                <Moveable
                    ref={groupMoveable}
                    target={groupInstances}
                    hideDefaultLines={false}
                    draggable={true}
                    onDragGroup={(e) => {
                        e.events.forEach(
                            (ev) => (ev.target.style.transform = ev.transform)
                        );
                        t1.current.updateRect();
                        t2.current.updateRect();
                    }}
                    onDragGroupEnd={() => {
                        setGroupInstances([]);
                    }}
                />
            </div>
        </div>
    );
}
