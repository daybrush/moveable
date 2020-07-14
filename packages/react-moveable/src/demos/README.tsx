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
    return <div className="container selecto group">
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

function RenderBounds() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".bounds .box")!);
    }, []);
    return <div className="container bounds">
        Bounds
        <div className="box"><span>A</span></div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            snappable={true}
            bounds={{ top: 60, left: 60 }}
            onDrag={e => {
                e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
    </div>;
}
function RenderInnerBounds() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".inner .box")!);
    }, []);
    return <div className="container inner">
        <p>Inner Bounds</p>
        <div className="box"><span>A</span></div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            snappable={true}
            innerBounds={{ top: 20, left: 60, width: 100, height: 100 }}
            onDrag={e => {
                e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
    </div>;
}

function RenderScaleGroup() {
    const [target, setTarget] = React.useState<Array<HTMLElement | SVGElement>>();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement | SVGElement>(".scalegroup .box")!));

        // setTimeout(() => {
        //     const scaleRequester = ref.current!.request("scalable");
        //     scaleRequester.request({
        //         direction: [1, 1],
        //         deltaWidth: -100,
        //         deltaHeight: -100,
        //     });
        //     scaleRequester.requestEnd();
        // }, 1000);
    }, []);

    return <div className="container scalegroup group">
        <p>Selecto</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            ref={ref}
            target={target}
            origin={false}
            scalable={true}
            onScaleGroupStart={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    ev.set(frames[i].scale);
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onScaleGroup={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;
                    frames[i].scale = ev.scale;
                    ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`
                        // + ` rotate(${frames[i].rotate}deg)`
                        + ` scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;
                });
            }}
        ></Moveable>
    </div>;
}

function RenderPSpan() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".psan span")!);
    }, []);
    return <div className="container psan">
        Render &lt; P &lt; SPAN
        <div>
            <p data-no>
                <span>AAA</span>
            </p>
        </div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            snappable={true}
            innerBounds={{ top: 20, left: 60, width: 100, height: 100 }}
            onDrag={e => {
                e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
    </div>;
}
export default function App() {
    return <div>
        <RenderDraggable />
        <RenderClippable />
        <RenderRoundable />
        <RenderOriginDraggable />
        <RenderSelecto />
        <RenderBounds />
        <RenderInnerBounds />
        <RenderScaleGroup />
        <RenderPSpan />
    </div>;
}
