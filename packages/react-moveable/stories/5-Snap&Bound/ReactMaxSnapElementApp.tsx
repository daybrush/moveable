import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                left: "100px",
                top: "100px",
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target element1" style={{
                    width: "100px",
                    height: "100px",
                    left: "-150px",
                    top: "150px",
                }}>Element1</div>
                <div className="target element2" style={{
                    width: "100px",
                    height: "100px",
                    left: "0px",
                    top: "120px",
                }}>Element2</div>
                <div className="target element3" style={{
                    width: "100px",
                    height: "100px",
                    left: "400px",
                    top: "120px",
                }}>Element3</div>
                    <div className="target element4" style={{
                    width: "100px",
                    height: "100px",
                    left: "550px",
                    top: "150px",
                }}>Element4</div>
               
                <div className="target" ref={targetRef} style={{
                    width: "150px",
                    height: "150px",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    snappable={true}
                    elementGuidelines={[".element1", ".element2", ".element3", ".element4"]}
                    snapDirections={{
                        "top": true,
                        "left": true,
                        "bottom": true,
                        "right": true,
                        
                        "center": true,
                        "middle": true,
                    }}
                    elementSnapDirections={{
                        "top": true,
                        "left": true,
                        "bottom": true,
                        "right": true,
                        
                        "center": true,
                        "middle": true,
                    }}
                    maxSnapElementGuidelineDistance={props.maxSnapElementGuidelineDistance}
                    maxSnapElementGapDistance={props.maxSnapElementGapDistance}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onScale={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
