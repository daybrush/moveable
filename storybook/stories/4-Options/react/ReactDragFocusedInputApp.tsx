import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const targetRef1 = React.useRef<HTMLInputElement>(null);
    const targetRef2 = React.useRef<HTMLDivElement>(null);

    return <div className="container">
        <p>Input         <button onClick={() => {
            targetRef1.current!.focus();
        }}>Focus Input</button></p>
        <input type="input" className="target1" ref={targetRef1}></input>
        <p>Content Editable <button onClick={() => {
            targetRef2.current!.focus();
        }}>Focus contenteEditable</button></p>
        <div className="target2" contentEditable="true" ref={targetRef2} style={{
            width: "100px",
            height: "100px",
        }}></div>
        <Moveable
            target={".target1"}
            draggable={true}
            dragFocusedInput={true}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
        <Moveable

            target={".target2"}
            draggable={true}
            dragFocusedInput={true}
            onDrag={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
