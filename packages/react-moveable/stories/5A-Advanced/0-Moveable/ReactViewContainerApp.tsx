import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="target">Target</div>
            <Moveable
                target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                viewContainer={document.body}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            />
        </div>
    );
}
