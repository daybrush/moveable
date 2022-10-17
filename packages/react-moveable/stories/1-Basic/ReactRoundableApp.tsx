import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target target1"
                    style={{
                        left: "10px",
                        top: "10px",
                        borderRadius: "25px",
                    }}
                >Target1</div>
                <div className="target target2"
                    style={{
                        left: "140px",
                        top: "10px",
                        borderRadius: "25px 23px",
                    }}
                >Target2</div>
                <div className="target target3"
                    style={{
                        left: "10px",
                        top: "140px",
                        borderRadius: "25px 23px / 20px",
                    }}
                >Target3</div>
                <div className="target target4"
                    style={{
                        left: "140px",
                        top: "140px",
                        borderRadius: "25px 25.5px 24.5px 24.9115px / 25.5px 25.5px 24.5px 24.5px",
                    }}
                >Target4</div>
                <Moveable
                    target={".target1"}
                    draggable={true}
                    roundable={true}
                    resizable={true}
                    isDisplayShadowRoundControls={"horizontal"}
                    roundClickable={"control"}
                    roundPadding={15}
                    onRound={e => {
                        console.log("ROUND", e.borderRadius);
                    }}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                    onRenderEnd={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
                <Moveable
                    target={".target2"}
                    roundable={true}
                    roundClickable={true}
                    onRound={e => {
                        console.log("ROUND", e.borderRadius);
                        e.target.style.borderRadius = e.borderRadius;
                    }}
                />
                <Moveable
                    target={".target3"}
                    roundable={true}
                    onRound={e => {
                        console.log("ROUND", e.borderRadius);
                        e.target.style.borderRadius = e.borderRadius;
                    }}
                />
                <Moveable
                    target={".target4"}
                    roundable={true}
                    onRound={e => {
                        console.log("ROUND", e.borderRadius);
                        e.target.style.borderRadius = e.borderRadius;
                    }}
                />
            </div>
        </div>
    );
}
