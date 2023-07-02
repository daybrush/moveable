import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target" style={{
                    transform: "translate(-50%, -50%)",
                }}>Target</div>
                <Moveable
                    target={".target"}
                    resizable={true}
                    preventClickDefault={true}
                    draggable={true}
                    onDrag={e => {
                        console.log(e.dist);
                    }}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
