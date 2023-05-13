import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return <div className="container">
        <div className="target"></div>
        <Moveable
            target={".target"}
            className="control-padding"
            draggable={true}
            resizable={true}
            rotatable={true}
            displayAroundControls={true}
            controlPadding={props.controlPadding}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
