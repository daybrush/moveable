import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target element1" style={{
                    width: "100px",
                    height: "100px",
                    left: "0px",
                    top: "120px",
                }}>Element1</div>
                <div className="target element2" style={{
                    width: "100px",
                    height: "100px",
                    left: "400px",
                    top: "120px",
                }}>Element2</div>
                <div className="target element3" style={{
                    width: "300px",
                    height: "100px",
                    top: "400px",
                    left: "50px",
                }}>Element3</div>
                <div className="target center" style={{
                    width: "200px",
                    height: "150px",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".center"}
                    draggable={true}
                    snappable={true}
                    snapDirections={{
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                        center: true,
                        middle: true,
                    }}
                    elementSnapDirections={{
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                        center: true,
                        middle: true,
                    }}
                    maxSnapElementGuidelineDistance={70}
                    elementGuidelines={[{
                        element: ".element1",
                        className: "red",
                    }, {
                        element: ".element2",
                        className: "green",
                    }, {
                        element: ".element3",
                    }]}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
