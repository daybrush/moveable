import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <input type="text" className="target" />
        <Moveable
            target={".target"}
            draggable={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
