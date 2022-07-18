import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target">Target1</div>
        <Moveable
            target={".aaa"}
            draggable={true}
            preventClickDefault={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
