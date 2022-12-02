import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target target1" style={{
                    borderRadius: "10px",
                }}>Target1</div>
                <div className="target target2">Target2</div>
                <div className="target target3">Target3</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    roundable={true}
                    resizable={true}
                    rotatable={true}
                    isDisplayShadowRoundControls={"horizontal"}
                    roundClickable={"control"}
                    roundPadding={15}
                    onRenderGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });
                    }}
                />
            </div>
        </div>
    );
}
