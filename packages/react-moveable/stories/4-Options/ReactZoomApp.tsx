import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root margin" style={{
            paddingTop: "100px",
        }}>
            <div style={{
                zoom: 0.5,
                position: "relative",
            }}>
                <div style={{
                    position: "relative",
                    transform: "translate3d(0px, 0px, 100px)",
                }}>
                    <div className="target" style={{
                        transform: "translate(0px, 0px)",
                    }}>Target</div>
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
        </div>
    );
}
