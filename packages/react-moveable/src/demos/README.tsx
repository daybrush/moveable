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
        <div style={{ padding: "10px", margin: "10px" }}>
            <p data-no style={{ padding: "10px", margin: "10px", transform: "translateZ(0px)" }}>
                <span style={{ top: 0, left: 0, padding: "10px", margin: "10px" }}>AAA</span>
            </p>
        </div>
        <Moveable
            target={target}
            draggable={true}
            origin={false}
            snappable={true}
            innerBounds={{ top: 20, left: 60, width: 100, height: 100 }}
            onDrag={e => {
                e.target.style.cssText += `left:${e.left}px; top: ${e.top}px;`;
            }}
        ></Moveable>
    </div>;
}
function RenderSVGOriginDraggable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    const ref = React.useRef<Moveable>(null);
    const frame = {
        translate: [0, 0],
        rotate: 0,
    };
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".svg text")!);

        setTimeout(() => {
            console.log(ref.current!.getRect());
            console.log(ref.current!);
        }, 100);
    }, []);
    return <div className="container svg">
        <p>SVG</p>

        <svg data-target="svg" style={{ width: "300px", border: "1px solid #333" }}>
            <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
            <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
            <g style={{ transform: "translate(40px, 10px)" }}>
                <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
    c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5" />
                <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{ fill: "yellow", stroke: "purple", strokeWidth: 2 }} />
                <text text-anchor="middle" x="40" y="40">HIHI</text>
            </g>
        </svg>
        <Moveable
            ref={ref}
            target={target}
            originDraggable={true}
            origin={true}
            draggable={true}
            rotatable={true}
            originRelative={false}
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

                console.log(e.dist, e.drag.beforeDist);
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
        <RenderSVGOriginDraggable />
    </div>;
}
