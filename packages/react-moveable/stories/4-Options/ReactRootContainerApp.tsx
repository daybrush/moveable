import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="margin no-relative">
            <div style={{
                position: "absolute",
                left: "84px",
                top: "159px",
                zIndex: 1,
            }}>92 x 167 (34, 84)</div>
            <div className="root" style={{
                // position: "relative",
                padding: "10px",
            }}>
                <div style={{
                    zoom: 0.5,
                    position: "relative",
                }}>
                    <div style={{
                        position: "relative",
                        marginTop: "100px",
                        width: "500px",
                        height: "500px",
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
                            onRenderEnd={e => {
                                console.log("RCR", e.moveable.state.rootContainerClientRect);
                                console.log("ORM", e.moveable.state.originalRootMatrix);
                                console.log("MCR", e.moveable.state.moveableClientRect);
                            }}
                        ></Moveable>
                    </div>
                </div>
            </div>
        </div>
    );
}
