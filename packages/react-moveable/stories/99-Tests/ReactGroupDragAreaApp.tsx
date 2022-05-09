import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const [targets, setTargets] = React.useState<any>(".target");

    React.useEffect(() => {
        setTimeout(() => {
            setTargets(document.querySelectorAll(".target, .moveable-area"));
            // setTargets(".target, .moveable-area");
        }, 100);
    }, []);
    return <div className="container">
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3">Target3</div>
        <Moveable
            target={targets}
            draggable={true}
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
