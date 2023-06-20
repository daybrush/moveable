import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target" style={{
                    width: "200px",
                    height: "150px",
                }}>Target</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    snappable={true}
                    rotatable={true}
                    scalable={true}
                    snapRotataionThreshold={5}
                    snapRotationDegrees={[0, 90, 180, 270]}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
