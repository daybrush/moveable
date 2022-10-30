import * as React from "react";
import Moveable from "@/react-moveable";
import "./snap.css";
export default function App(props: Record<string, any>) {
    const [snapContainer, setSnapContainer] = React.useState<HTMLElement | string>(".snapGrid");
    const onMoustEnter = React.useCallback((e: MouseEvent) => {
        console.log(e.currentTarget);
        setSnapContainer(e.currentTarget);
    }, []);
    return (
        <div className="root" style={{
            position: "relative",
            border: "1px solid black",
        }}>
            <Moveable
                target={".target"}
                draggable={true}
                snappable={true}
                horizontalGuidelines={[0, 100, 200, 300]}
                verticalGuidelines={[0, 100, 200, 300]}
                snapContainer={snapContainer}
                onDragStart={() => {
                    document.querySelectorAll<HTMLElement>(".snapGrid").forEach(grid => {
                        grid.addEventListener("mouseenter", onMoustEnter);
                    });
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                    e.target.style.pointerEvents = "none";
                }}
                onDragEnd={() => {
                    e.target.style.pointerEvents = "";
                    document.querySelectorAll<HTMLElement>(".snapGrid").forEach(grid => {
                        grid.removeEventListener("mouseenter", onMoustEnter);
                    });
                }}
            />
            <div className="container">
                <div className="snapGrid">
                    <div className="target" style={{
                        width: "200px",
                        height: "150px",
                        transform: "translate(0px, 0px) scale(1.5, 1)",
                    }}>Target</div>
                </div>
                <div className="snapGrid"></div>
            </div>
        </div>
    );
}
