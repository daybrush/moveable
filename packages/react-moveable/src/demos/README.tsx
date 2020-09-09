import React from "react";
import Moveable from "../react-moveable";
import Selecto from "react-selecto";
import "./README.css";

function RenderDraggable() {
    const ref = React.useRef<HTMLDivElement>(null);
    return <div className="container draggable">
        Draggable
        <div className="box" ref={ref} style={{
            transform: "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
        }}><span>A</span></div>
        <Moveable
            target={ref}
            draggable={true}
            origin={true}
            onDragStart={e => {
                e.setTransform("translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)", 2);
            }}
            onDrag={e => {
                console.log(e.transform);
                e.target.style.transform = e.transform;
            }}
            onRenderStart={e => {
                console.log(e);
            }}
            onRender={e => {
                console.log(e);
            }}
            onRenderEnd={e => {
                console.log(e);
            }}
        ></Moveable>
    </div>;
}
function RenderResizableRequest() {
    const ref = React.useRef<Moveable>(null);
    const [frame] = React.useState(() => ({
        translate: [0, 0],
    }));

    return <div className="container resize-request group">
        <p>Resize Request</p>
        <div className="box box1"><span>A</span></div>
        <button onClick={() => {
             ref.current!.request("resizable", {
                offsetWidth: 300,
                offsetHeight: 300,
                isInstant: true,
            });
        }}>REQUEST</button>
        <Moveable
            ref={ref}
            target={".resize-request .box1"}
            origin={false}
            resizable={true}
            onResizeStart={e => {
                e.setOrigin(["%", "%"]);
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onResize={e => {
                console.log(e.width, e.height);
                frame.translate = e.drag.beforeTranslate;

                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`;
            }}
        ></Moveable>
    </div>;
}
function RenderClickable() {
    return <div className="container clickable group">
        <p>Clickable</p>
        <div className="box box1"><span>A</span></div>
        {/* <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div> */}
        <Moveable
            target={".clickable .box"}
            draggable={true}
            // origin={true}
            onClick={e => {
                console.log(e);
            }}
            onClickGroup={e => {
                console.log("group", e);
            }}
        ></Moveable>
    </div>;
}
function RenderGroupClickable() {
    return <div className="container clickable2 group">
        <p>Group Clickable</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            target={".clickable2 .box"}
            draggable={true}
            // origin={true}
            onClick={e => {
                console.log(e);
            }}
            onClickGroup={e => {
                console.log("group", e);
            }}
        ></Moveable>
    </div>;
}
function RenderScalable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".scalable .box")!);
    }, []);
    return <div className="container scalable">
        <p className="description">Scalable</p>
        <div className="box" style={{
            transform: "rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)",
        }}><span>A</span></div>
        <Moveable
            target={target}
            draggable={true}
            scalable={true}
            origin={true}
            onScaleStart={e => {
                // e.set([2, 2]);
                e.setTransform("rotate(30deg) translate(10px, 10px)  scale(2, 2) translate(10px, 10px)", 2);
                e.dragStart && e.dragStart.setTransformIndex(1);
            }}
            onScale={e => {
                console.log(e.drag.transform);
                e.target.style.transform = e.drag.transform;
            }}
        ></Moveable>
    </div>;
}
function RenderRotatable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        document.addEventListener("gesturestart", e => {
            e.preventDefault();
        });
        setTarget(document.querySelector<HTMLElement>(".rotatable .box")!);
    }, []);
    return <div className="container rotatable">
        <p className="description">Rotatable</p>
        <div className="box" style={{
            transform: "rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)",
        }}><span>A</span></div>
        <Moveable
            target={target}
            // draggable={true}
            pinchable={["rotatable"]}
            pinchOutside={true}
            rotatable={true}
            origin={true}
            onBeforeRenderStart={e => {
                e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)");
            }}
            onRotateStart={e => {
                // e.set([2, 2]);
                // e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)", 0);
                e.setTransformIndex(0);
                e.dragStart && e.dragStart.setTransformIndex(1);
            }}
            onRotate={e => {
                console.log(e.drag.transform);
                e.target.style.transform = e.drag.transform;
            }}
        ></Moveable>
    </div>;
}
function RenderWarpable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [warpMatrix, setWarpMatrix]
        = React.useState<string>("rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)");
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".warpable .box")!);
    }, []);
    return <div className="container warpable">
        <p className="description">Warpable</p>
        <div className="box" style={{
            transform: warpMatrix,
        }}><span>A</span></div>
        <Moveable
            target={target}
            warpable={true}
            origin={true}
            // onBeforeRenderStart={e => {
            //     e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)");
            // }}
            onWarpStart={e => {
                e.setTransform(warpMatrix, 1);
            }}
            onWarp={e => {
                e.target.style.transform = e.transform;
            }}
            onWarpEnd={e => {
                e.lastEvent && setWarpMatrix(e.lastEvent.transform);
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
        <div className="box" style={{ transform: "translate(20px, 30px) rotate(30deg)" }}><span>A</span></div>
        <Moveable target={target}
            draggable={true}
            clippable={true}
            clipArea={true}
            defaultClipPath={"circle"}
            clipRelative={false}
            dragWithClip={false}
            clipTargetBounds={true}
            clipVerticalGuidelines={[10, 30, 200]}
            clipHorizontalGuidelines={[10, 30, 200]}
            dragArea={true}
            origin={false}

            snappable={true}
            verticalGuidelines={[80, 150, 200]}
            bounds={{ top: 60, left: 60 }}

            onDrag={e => {
                e.target.style.cssText += `left:${e.left}px; top: ${e.top}px;`;
            }}
            onClip={e => {
                // console.log(e.clipStyle);
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

function RenderDragGroup() {
    const [target, setTarget] = React.useState<Array<HTMLElement | SVGElement>>();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement | SVGElement>(".draggroup .box")!));

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

    return <div className="container draggroup group">
        <p>Drag Group</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            ref={ref}
            target={target}
            origin={false}
            draggable={true}
            onBeforeRenderGroupStart={e => {
                e.events.forEach((ev, i) => {
                    const translate = frames[i].translate;
                    ev.setTransform(`translate(${translate[0]}px, ${translate[1]}px)`);
                });
            }}
            onDragGroupStart={e => {
                // e.events.forEach((ev, i) => {
                //     ev.set(frames[i].translate);
                // });
                e.events.forEach((ev, i) => {
                    ev.setTransformIndex(0);
                });
            }}
            onDragGroup={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    frames[i].translate = ev.beforeTranslate;

                    ev.target.style.transform = ev.transform;
                });
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
        <p>Scale Group</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            ref={ref}
            target={target}
            origin={false}
            scalable={true}
            onBeforeRenderGroupStart={e => {
                console.log(e);
            }}
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
function RenderResizeGroup() {
    const [target, setTarget] = React.useState<Array<HTMLElement | SVGElement>>();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement | SVGElement>(".resizegroup .box")!));

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

    return <div className="container resizegroup group">
        <p>Resize Group</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            ref={ref}
            target={target}
            origin={false}
            resizable={true}
            onBeforeRenderGroupStart={e => {
                console.log(e);
            }}
            onResizeGroupStart={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onResizeGroup={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;

                    console.log(ev.width, ev.height);
                    ev.target.style.width = `${ev.width}px`;
                    ev.target.style.height = `${ev.height}px`;
                    ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`;
                });
            }}
        ></Moveable>
    </div>;
}

function RenderRotateGroup() {
    const [target, setTarget] = React.useState<Array<HTMLElement | SVGElement>>();
    const frames = [
        { translate: [0, 0], rotate: 0 },
        { translate: [0, 0], rotate: 0 },
        { translate: [0, 0], rotate: 0 },
        { translate: [0, 0], rotate: 0 },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget([].slice.call(document.querySelectorAll<HTMLElement | SVGElement>(".rotategroup .box")!));

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

    return <div className="container rotategroup group">
        <p>Rotate Group</p>
        <div className="box box1"><span>A</span></div>
        <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div>
        <Moveable
            ref={ref}
            target={target}
            origin={false}
            draggable={true}
            rotatable={true}
            onBeforeRenderGroupStart={e => {
                e.events.forEach((ev, i) => {
                    ev.setTransform([
                        `rotate(${frames[i].rotate}deg)`,
                        `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`,
                    ]);
                });
            }}
            onRotateGroupStart={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    ev.setTransformIndex(0);
                    ev.dragStart && ev.dragStart.setTransformIndex(1);

                    // ev.set(frames[i].rotate);
                    // ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onDragGroupStart={e => {
                e.events.forEach((ev, i) => {
                    ev.setTransformIndex(1);
                });
            }}
            onDragGroup={e => {
                e.events.forEach((ev, i) => {
                    frames[i].translate = ev.translate;

                    ev.target.style.transform
                        = ` rotate(${frames[i].rotate}deg)`
                        + `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`;

                });
            }}
            onRotateGroup={e => {
                const { events } = e;
                events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.translate;
                    frames[i].rotate = ev.rotate;
                    ev.target.style.transform
                        = ` rotate(${frames[i].rotate}deg)`
                        + `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`;

                    // frames[i].translate = ev.drag.beforeTranslate;
                    // frames[i].rotate = ev.beforeRotate;

                    // ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`
                    //     // + ` rotate(${frames[i].rotate}deg)`
                    //     + ` rotate(${frames[i].rotate}deg)`;
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

        // setTimeout(() => {
        //     console.log(ref.current!.getRect());
        //     console.log(ref.current!);
        // }, 100);
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
        <RenderResizableRequest />
        <RenderClickable />
        <RenderGroupClickable />
        <RenderScalable />
        <RenderRotatable />
        <RenderWarpable />
        <RenderClippable />
        <RenderRoundable />
        <RenderOriginDraggable />
        <RenderSelecto />
        <RenderBounds />
        <RenderInnerBounds />
        <RenderDragGroup />
        <RenderScaleGroup />
        <RenderRotateGroup />
        <RenderResizeGroup />
        <RenderPSpan />
        <RenderSVGOriginDraggable />
    </div>;
}
