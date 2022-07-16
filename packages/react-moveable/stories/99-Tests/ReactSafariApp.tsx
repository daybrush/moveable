import * as React from "react";
import Moveable from "@/react-moveable";
import "./safari.css";

export default function App() {
    return <div className="safari-app">
        <div className="safari-canvas">
            <div className="safari-pages">
                <div className="safari-target" />
                <Moveable
                    target={".safari-target"}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    </div>;
}
