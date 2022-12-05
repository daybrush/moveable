import * as React from "react";
import Moveable from "@/react-moveable";
import { useEffect, useState } from "react";

export default function App() {
    const [elementGuidelines, setElementGuideliens] = useState<HTMLElement[]>([]);

    useEffect(() => {
        setElementGuideliens([].slice.call(document.querySelectorAll(".moveable")));
    }, []);
    return (
        <div className="root">
            <div className="container" style={{
                width: "1000px",
                height: "1600px",
                transform: "scale(0.47845)",
                transformOrigin: "top left",
                background: "#faa",
            }}>
                <div className="target box-1" style={{
                    top: 0,
                    left: 0,
                }}>Target</div>
                <div className="target moveable box-2" style={{
                    "width": "600px",
                    "height": "50px",
                    "top": "1400px",
                    "left": "150px",
                }}>
                    <p>Moveable 2</p>
                </div>
                <div className="target moveable box-3" style={{
                    "width": "250px",
                    "height": "50px",
                    "top": "1300px",
                    "left": "350px",
                }}>
                    <p>Moveable 3</p>
                </div>
                <div className="target moveable box-4" style={{
                    "width": "250px",
                    "height": "50px",
                    "top": "1200px",
                    "left": "200px",
                }}>
                    <p>Moveable 4</p>
                </div>
                <div className="target moveable box-5" style={{
                    "width": "250px",
                    "height": "50px",
                    "top": "1200px",
                    "left": "500px",
                }}>
                    <p>Moveable 5</p>
                </div>
            </div>
            <Moveable
                target={".box-1"}
                draggable={true}
                resizable={true}
                snappable={true}
                zoom={1}
                elementGuidelines={elementGuidelines}
                bounds={{
                    top: 0,
                    left: 0,
                    right: 500,
                    bottom: 800,
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            />
        </div>
    );
}
