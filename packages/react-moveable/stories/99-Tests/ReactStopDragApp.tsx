import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <p>No Stop</p>
        <input type="input" className="target1"/>
        <p>Stop Drag</p>
        <input type="input" className="target2"/>
        <p>Stop Drag</p>
        <select className="target3">
            <option>a</option>
            <option>b</option>
            <option>c</option>
        </select>
        <Moveable
            target={".target1"}
            draggable={true}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
        <Moveable
            target={".target2"}
            draggable={true}
            onDragStart={e => {
                if (["input", "select"].indexOf(e.target.tagName.toLowerCase()) > -1) {
                    e.stopDrag();
                }
            }}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
        <Moveable
            target={".target3"}
            draggable={true}
            onDragStart={e => {
                if (["input", "select"].indexOf(e.target.tagName.toLowerCase()) > -1) {
                    e.stopDrag();
                }
            }}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
