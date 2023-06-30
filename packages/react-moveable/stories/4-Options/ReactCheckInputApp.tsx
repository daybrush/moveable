import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <p>checkInput (false)</p>
        <input type="input" className="target1" />
        <p>checkInput (true)</p>
        <input type="input" className="target2" />
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
            checkInput={true}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
