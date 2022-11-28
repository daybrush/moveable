import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<SVGCircleElement>(null);

    return (
        <div className="root" style={{
            paddingLeft: "100px",
            paddingTop: "100px",
        }}>
            <div className="container" style={{
                transformOrigin: "0 0",
                transform: `scale(${props.containerScale})`,
            }}>
                <svg viewBox="0 0 200 200" style={{
                    border: "1px solid black",
                    width: "200px",
                    height: "200px",
                }}>
                    <circle cx="50" cy="100" r="50"  ref={targetRef}/>
                </svg>
                <Moveable
                    target={targetRef}
                    draggable={true}
                    rotatable={true}
                    scalable={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                ></Moveable>
            </div>
        </div>
    );
}
