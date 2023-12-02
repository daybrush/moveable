import React from "react";
// import "./App.css";
import Moveable, { MoveableManagerInterface, Renderer } from "@/react-moveable";

const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();

        // Add key (required)
        // Add class prefix moveable-(required)
        return (
            <div
                key={"dimension-viewer"}
                className={"moveable-dimension"}
                style={{
                    position: "absolute",
                    left: `${rect.width / 2}px`,
                    top: `${rect.height + 20}px`,
                    background: "#4af",
                    borderRadius: "2px",
                    padding: "2px 4px",
                    color: "white",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    willChange: "transform",
                    transform: `translate(-50%, 0px)`,
                }}
            >
                Target
            </div>
        );
    },
} as const;

function App() {
    const [dragTarget, setDragTarget] = React.useState<HTMLElement>();

    React.useEffect(() => {
        setDragTarget(document.querySelector<HTMLElement>(".moveable-dimension")!);
    }, []);
    return (
        <div className="container">
            <div className="target target1"></div>
            <div className="target target2"></div>
            <Moveable
                ables={[DimensionViewable]}
                dragTarget={dragTarget}
                resizable={true}
                props={{
                    dimensionViewable: true,
                }}
                target={[".target1"]}
                draggable={true}
                onDrag={(e) => {
                    e.target.style.transform = e.transform;
                }}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onRotate={(e) => {
                    e.target.style.transform = e.drag.transform;
                }}
                elementGuidelines={[".target1", ".target2"]}
                snappable={true}
            />
        </div>
    );
}

export default App;
