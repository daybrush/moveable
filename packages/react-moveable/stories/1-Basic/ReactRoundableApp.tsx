import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target"
                    style={{
                        borderRadius: "25px 25.5px 24.5px 24.9115px / 25.5px 25.5px 24.5px 24.5px",
                    }}
                >Target</div>
                <Moveable
                    target={".target"}
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
