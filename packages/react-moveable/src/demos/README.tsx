import React from "react";
import Moveable from "../react-moveable";
import Selecto from "react-selecto";
import "./README.css";


function RenderDraggable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".draggable .box")!);
    }, []);
    return <div className="container draggable">
        Draggable
        <div className="box"><span>A</span></div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            onDrag={e => {
                e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
    </div>;
}
function RenderClippable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".clippable .box")!);
    }, []);
    return <div className="container clippable">
        Clippable
        <div className="box"><span>A</span></div>
        <Moveable target={target}
            draggable={true}
            clippable={true}
            clipArea={true}
            clipRelative={false}
            dragWithClip={false}
            dragArea={true}
            origin={false}
            onDrag={e => {
                e.target.style.cssText += `left:${e.left}px; top: ${e.top}px;`;
            }}
            onClip={e => {
                console.log(e.clipStyle);
                if (e.clipType === "rect") {
                    e.target.style.clip = e.clipStyle;
                } else {
                    e.target.style.clipPath = e.clipStyle;
                }
            }}
        ></Moveable>
    </div>;
}
function RenderRoundable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".roundable .box")!);
    }, []);
    return <div className="container roundable">
        Roundable
        <div className="box" style={{
            borderRadius: "10%",
        }}><span>A</span></div>
        <Moveable target={target}
            roundable={true}
            origin={false}
            onRound={e => {
                e.target.style.borderRadius = e.borderRadius;
            }}
        ></Moveable>
    </div>;
}
function RenderOriginDraggable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    const frame = {
        translate: [0, 0],
        rotate: 0,
    };
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".origin-draggable .box")!);
    }, []);
    return <div className="container origin-draggable">
        <p>OriginDraggable</p>
        <div className="box" style={{
            borderRadius: "10%",
        }}><span>A</span></div>
        <Moveable target={target}
            originDraggable={true}
            origin={true}
            draggable={true}
            rotatable={true}
            onDragStart={e => {
                e.set(frame.translate);
            }}
            onDrag={e => {
                frame.translate = e.beforeTranslate;
            }}
            onRotateStart={e => {
                e.set(frame.rotate);
            }}
            onRotate={e => {
                frame.rotate = e.beforeRotate;
            }}
            onDragOriginStart={e => {
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onDragOrigin={e => {
                frame.translate = e.drag.beforeTranslate;
                e.target.style.transformOrigin = e.transformOrigin;
            }}
            onRender={e => {
                const { translate, rotate } = frame;

                e.target.style.transform
                    = `translate(${translate[0]}px, ${translate[1]}px)`
                    + ` rotate(${rotate}deg)`;
            }}
        ></Moveable>
    </div>;
}

function RenderSelecto() {
    const [target, setTarget] = React.useState<Array<HTMLElement | SVGElement>>();
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement | SVGElement>(".selecto .box")!));
    }, []);
    return <div className="container selecto">
        <p>Selecto</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            onDrag={e => {
                e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
        <Selecto
            selectableTargets={[".selecto .box"]}
            hitRate={0}
            selectByClick={true}
            onSelect={e => {
                setTarget(e.selected);
            }}
        ></Selecto>
    </div>;
}
export default function App() {
    return <div>
        <RenderDraggable />
        <RenderClippable />
        <RenderRoundable />
        <RenderOriginDraggable />
        <RenderSelecto />
    </div>;
}
