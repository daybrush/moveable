import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <p className="description">
                * When you drag, the class name `${`{ableName}`}-view-dragging` is added to the viewContainer.
            </p>
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
