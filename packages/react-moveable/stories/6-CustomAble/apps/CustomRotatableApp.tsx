import * as React from "react";
import Moveable, { makeAble, MoveableManagerInterface, Renderer } from "@/react-moveable";

const CustomRotation = makeAble("customRotation", {
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer): any {
        const rect = moveable.getRect();
        const { pos1, pos2 } = moveable.state;

        // Add key (required)
        // Add class prefix moveable-(required)
        //  translateY(-20px)
        return <div key={"custom-rotation"} className={"moveable-custom-rotation"} style={{
            position: "absolute",
            transform: `translate(-50%, -100%)`
                + ` translate(${(pos1[0] + pos2[0]) / 2}px, ${(pos1[1] + pos2[1]) / 2}px)`
                + ` rotate(${rect.rotation}deg) translateY(-20px)`,
            width: "20px",
            height: "20px",
            background: "#f55",
            cursor: "move",
            transformOrigin: "50% 100%",
        }}>
        </div>;
    },
});

export default function App() {
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <p>Custom Rotatation with rotationTarget</p>
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
            ables={[CustomRotation]}
            props={{
                customRotation: true,
            }}
            draggable={true}
            rotatable={true}
            resizable={true}
            rotationTarget={".moveable-custom-rotation"}
            rotationPosition={"none"}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
            onResize={e => {
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.transform = e.drag.transform;
            }}
            onRotate={e => {
                e.target.style.transform = e.drag.transform;
            }}
        />
    </div>;
}
