import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root" style={{
            paddingTop: "100px",
        }}>
            <div>
                <div style={{
                    position: "relative",
                    transform: "translate3d(0px, 0px, 100px)",
                }}>
                    <div className="target" style={{
                        translate: "100px 10px",
                        rotate: "30deg",
                        scale: "1 2",
                        transform: "translate(100px, 0px)",
                    }}>Target</div>
                </div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    rotatable={true}
                    resizable={true}
                    rootContainer={document.body}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                ></Moveable>
            </div>
        </div>
    );
}
