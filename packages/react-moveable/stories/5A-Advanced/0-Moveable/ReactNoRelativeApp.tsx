import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {

    return (
        <div className="no-relative" style={{
            // position: "relative",
        }}>
            <div className="target" style={{
                marginLeft: "100px",
                // left: "100px",
                // transform: "translate(100px, 0px)",
            }}>Target</div>
            <Moveable
                target={".target"}
                draggable={true}
                rotatable={true}
                // rootContainer={document.documentElement}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            ></Moveable>
        </div>
    );
}
