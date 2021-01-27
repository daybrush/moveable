import React from "react";
import Moveable, { ElementGuidelineValue } from "../react-moveable";
import Selecto from "react-selecto";
import "./README.css";
import { useEffect } from "react";
function RenderSVGG() {
    const ref = React.useRef<SVGPathElement>(null);
    return (
        <div
            className="container"
            style={{
                textAlign: "center",
            }}
        >
            <svg width={400} height={300} viewBox={"0 0 400 300"}>
                <g className="moveable" ref={ref}>
                    <rect
                        x="60"
                        y="150"
                        width="100"
                        height="50"
                        fill="#00FF00"
                    ></rect>
                </g>
            </svg>
            <Moveable
                target={ref}
                draggable={true}
                onDragStart={(e) => {
                    e.setTransform(
                        ref.current!.style.transform!,
                        0,
                    );
                }}
                onDrag={(e) => {
                    console.log(e.transform);
                    e.target.style.transform = e.transform;
                }}
            ></Moveable>
        </div>
    );
}
function RenderSVG() {
    const ref = React.useRef<SVGPathElement>(null);
    return (
        <div
            className="container"
            style={{
                textAlign: "center",
            }}
        >
            <svg
                version="1.2"
                baseProfile="tiny"
                id="Logo"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="50 50 150 150"
                style={{
                    width: "50%",
                }}
            >
                <text
                    id="text"
                    transform="matrix(1 0 0 1 31.1271 199.1222)"
                    fill="#561010"
                    font-family="'Roboto-Regular'"
                    font-size="25.3945px"
                >
                    Nom d’entreprise
                </text>
                <g className="draggable" transform="matrix(1 0 0 1 0 0)">
                    <path
                        transform="matrix(1 0 0 1 0 0)"
                        fill="#000"
                        d="M51.75,55.77c-0.27-0.39,3.97-5.2,10.38-7.74c1.79-0.71,11.97-4.75,21.31,0.8 c8.61,5.12,11.99,15.71,10.53,24.27c-2.38,13.95-17.76,23.37-22.24,20.72c-0.97-0.57-1.32-2.75-1.99-7.09 c-1.81-11.84-1.68-20.54-1.68-20.54c0.05-3.05,0.19-4.38-0.61-6.25c-1.42-3.32-4.9-6.23-8.62-6.47 C54.84,53.21,51.97,56.08,51.75,55.77z"
                        ref={ref}
                    ></path>
                </g>
            </svg>
            <Moveable target={ref}></Moveable>
        </div>
    );
}
function RenderDraggable() {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <div className="container draggable">
            Draggable
            <div
                className="box"
                ref={ref}
                style={{
                    transform:
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={ref}
                draggable={true}
                origin={true}
                edgeDraggable={true}
                dragArea={true}
                passDragArea={true}
                onDragStart={(e) => {
                    e.setTransform(
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                        2
                    );
                }}
                onDrag={(e) => {
                    console.log(e.transform);
                    e.target.style.transform = e.transform;
                }}
                onRenderStart={(e) => {
                    console.log(e);
                }}
                onRender={(e) => {
                    console.log(e);
                }}
                onRenderEnd={(e) => {
                    console.log(e);
                }}
            ></Moveable>
        </div>
    );
}

function RenderDraggable2() {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <div className="container draggable2">
            Draggable (rotate: 270deg)
            <div
                style={{
                    transform: "scale(1.3)",
                    transformOrigin: "top",
                }}
            >
                <div
                    className="parent"
                    style={{
                        transform: "rotate(270deg)",
                        position: "absolute",
                        height: "200px",
                        width: "240px",
                    }}
                >
                    <div
                        className="child"
                        style={{
                            position: "absolute",
                            width: "100px",
                            height: "100px",
                        }}
                    >
                        child
                    </div>
                </div>
            </div>
            <Moveable
                target={".draggable2 .child"}
                draggable={true}
                rotatable={true}
                rotationPosition="bottom"
                throttleRotate={10}
                onDragStart={(e) => {
                    // e.set([0, 0]);
                }}
                onDrag={(e) => {
                    e.target.style.left = e.left + "px";
                    e.target.style.top = e.top + "px";
                    // e.target.style.transform = e.transform;
                }}
            ></Moveable>
        </div>
    );
}

function RenderDraggableResizableRotatableSnappable() {
    const ref = React.useRef<HTMLDivElement>(null);
    const transformRef = React.useRef<string>(
        "translate(0px, 0px) rotate(90deg)"
    );
    const [zoom, setZoom] = React.useState(1);
    const [elementGuidelines, setElementGuidelines] = React.useState<
        ElementGuidelineValue[]
    >([]);

    React.useEffect(() => {
        setElementGuidelines([
            {
                element: document.querySelector<HTMLElement>(".draggable")!,
            },
            {
                element: document.querySelector<HTMLElement>(".drrs")!,
            },
        ]);
    }, []);
    return (
        <div
            className="container drrs"
            style={{ transform: `scale(${1 / zoom})` }}
        >
            DraggableResizableRotatableSnappable
            <div
                className="box"
                ref={ref}
                style={{
                    left: "100px",
                    top: "100px",
                    marginLeft: 0,
                    marginTop: 0,
                    transform: transformRef.current,
                }}
            >
                <span>A</span>
            </div>
            <button onClick={() => setZoom(0.2)}>0.2</button>
            <button onClick={() => setZoom(0.6)}>0.6</button>
            <button onClick={() => setZoom(1)}>1</button>
            <button onClick={() => setZoom(1.6)}>1.5</button>
            <button onClick={() => setZoom(2)}>2</button>
            <Moveable
                target={ref}
                draggable={true}
                resizable={true}
                rotatable={true}
                snappable={true}
                // snapCenter={true}
                elementGuidelines={elementGuidelines}
                snapGap={true}
                snapCenter={false}
                // verticalGuidelines={[0, 100]}
                horizontalGuidelines={[0]}
                // verticalGuidelines={[0, 100, 200, 400]}
                // horizontalGuidelines={[0, 100, 200, 400]}
                keepRatio={true}
                zoom={zoom}
                onBeforeRenderStart={(e) => {
                    e.setTransform(transformRef.current);
                }}
                onDragStart={(e) => {
                    e.setTransformIndex(0);
                }}
                onDrag={(e) => {
                    console.log("DDRRAAGG");
                    e.target.style.transform = e.transform;
                    transformRef.current = e.transform;
                }}
                onResizeStart={(e) => {
                    e.dragStart && e.dragStart.setTransformIndex(0);
                    // e.setMin([300, 150])
                    // e.setRatio(1.2);
                }}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;

                    e.target.style.transform = e.drag.transform;
                    transformRef.current = e.drag.transform;
                }}
                onRotateStart={(e) => {
                    e.setTransformIndex(1);
                    e.dragStart && e.dragStart.setTransformIndex(0);
                }}
                onRotate={(e) => {
                    console.log("RROOTTaATTEE");
                    e.target.style.transform = e.drag.transform;
                    transformRef.current = e.drag.transform;
                }}
            ></Moveable>
        </div>
    );
}

function RenderRootDraggable() {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <div className="container root_draggable root">
            <p>Draggable Root Container</p>
            <div
                className="box"
                ref={ref}
                style={{
                    transform:
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={ref}
                draggable={true}
                origin={true}
                rootContainer={document.body}
                onDragStart={(e) => {
                    e.setTransform(
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                        2
                    );
                }}
                onDrag={(e) => {
                    console.log(e.transform);
                    e.target.style.transform = e.transform;
                }}
                onRenderStart={(e) => {
                    console.log(e);
                }}
                onRender={(e) => {
                    console.log(e);
                }}
                onRenderEnd={(e) => {
                    console.log(e);
                }}
            ></Moveable>
        </div>
    );
}
function RenderResizableRequest() {
    const ref = React.useRef<Moveable>(null);
    const [frame] = React.useState(() => ({
        translate: [0, 0],
    }));

    return (
        <div className="container resize-request group">
            <p>Resize Request</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <button
                onClick={() => {
                    ref.current!.request("resizable", {
                        offsetWidth: 300,
                        offsetHeight: 300,
                        isInstant: true,
                    });
                }}
            >
                REQUEST
            </button>
            <Moveable
                ref={ref}
                target={".resize-request .box1"}
                origin={false}
                resizable={true}
                onResizeStart={(e) => {
                    e.setOrigin(["%", "%"]);
                    e.dragStart && e.dragStart.set(frame.translate);
                }}
                onResize={(e) => {
                    console.log(e.width, e.height);
                    frame.translate = e.drag.beforeTranslate;

                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`;
                }}
            ></Moveable>
        </div>
    );
}
function RenderClickable() {
    return (
        <div className="container clickable group">
            <p>Clickable</p>
            <div className="box box1">
                <span>A</span>
            </div>
            {/* <div className="box box2"><span>B</span></div>
        <div className="box box3"><span>C</span></div>
        <div className="box box4"><span>D</span></div> */}
            <Moveable
                target={".clickable .box"}
                draggable={true}
                // origin={true}
                onClick={(e) => {
                    console.log(e);
                }}
                onClickGroup={(e) => {
                    console.log("group", e);
                }}
            ></Moveable>
        </div>
    );
}
function RenderGroupClickable() {
    return (
        <div className="container clickable2 group">
            <p>Group Clickable</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                target={".clickable2 .box"}
                draggable={true}
                // origin={true}
                onClick={(e) => {
                    console.log(e);
                }}
                onClickGroup={(e) => {
                    console.log("group", e);
                }}
            ></Moveable>
        </div>
    );
}
function RenderScalable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".scalable .box")!);
    }, []);
    return (
        <div className="container scalable">
            <p className="description">Scalable</p>
            <div
                className="box"
                style={{
                    transform:
                        "rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                rotatable={true}
                scalable={true}
                origin={true}
                onScaleStart={(e) => {
                    // e.set([2, 2]);
                    e.setTransform(
                        "rotate(30deg) translate(10px, 10px)  scale(2, 2) translate(10px, 10px)",
                        2
                    );
                    e.dragStart && e.dragStart.setTransformIndex(1);
                }}
                onScale={(e) => {
                    console.log(e.drag.transform);
                    e.target.style.transform = e.drag.transform;
                }}
            ></Moveable>
        </div>
    );
}
function RenderResizable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".resizable .box")!);
    }, []);
    return (
        <div className="container resizable">
            <p className="description">Resizable</p>
            <div
                className="box"
                style={
                    {
                        // transform: "translate(0px, 0px) rotate(0deg)",
                    }
                }
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                rotatable={true}
                resizable={true}
                origin={true}
                onResizeStart={(e) => {
                    // e.set([2, 2]);
                    // e.setFixedDirection([0, 0]);
                    e.dragStart &&
                        e.dragStart.setTransform(e.target.style.transform, 0);
                }}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onRotateStart={(e) => {
                    // e.set([2, 2]);
                    // e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)", 0);
                    e.setTransform(e.target.style.transform, 1);
                    e.dragStart && e.dragStart.setTransformIndex(0);
                }}
                onRotate={(e) => {
                    console.log(e.drag.transform);
                    e.target.style.transform = e.drag.transform;
                }}
            ></Moveable>
        </div>
    );
}
function RenderRotatable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        document.addEventListener("gesturestart", (e) => {
            e.preventDefault();
        });
        setTarget(document.querySelector<HTMLElement>(".rotatable .box")!);
    }, []);
    return (
        <div className="container rotatable">
            <p className="description">Rotatable</p>
            <div
                className="box"
                style={{
                    transform:
                        "rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                // draggable={true}
                pinchable={["rotatable"]}
                pinchOutside={true}
                rotatable={true}
                origin={true}
                rotationPosition={"none"}
                renderDirections={true}
                rotationTarget={".moveable-direction"}
                onBeforeRenderStart={(e) => {
                    e.setTransform(
                        "rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)"
                    );
                }}
                onRotateStart={(e) => {
                    // e.set([2, 2]);
                    // e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)", 0);
                    e.setTransformIndex(0);
                    e.dragStart && e.dragStart.setTransformIndex(1);
                }}
                onRotate={(e) => {
                    console.log(e.drag.transform);
                    e.target.style.transform = e.drag.transform;
                }}
            ></Moveable>
        </div>
    );
}
function RenderWarpable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [warpMatrix, setWarpMatrix] = React.useState<string>(
        "rotate(30deg) translate(10px, 10px) scale(2, 2) translate(10px, 10px)"
    );
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".warpable .box")!);
    }, []);
    return (
        <div className="container warpable">
            <p className="description">Warpable</p>
            <div
                className="box"
                style={{
                    transform: warpMatrix,
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                warpable={true}
                origin={true}
                // onBeforeRenderStart={e => {
                //     e.setTransform("rotate(30deg) translate(30px, 30px)  scale(2, 2) translate(10px, 10px)");
                // }}
                onWarpStart={(e) => {
                    e.setTransform(warpMatrix, 4);
                }}
                onWarp={(e) => {
                    console.log(e.transform);
                    e.target.style.transform = e.transform;
                }}
                onWarpEnd={(e) => {
                    e.lastEvent && setWarpMatrix(e.lastEvent.transform);
                }}
            ></Moveable>
        </div>
    );
}
function RenderClippable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".clippable .box")!);
    }, []);
    return (
        <div className="container clippable">
            Clippable
            <div
                className="box"
                style={{ transform: "translate(20px, 30px) rotate(30deg)" }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                clippable={true}
                clipArea={true}
                // defaultClipPath={"circle"}
                defaultClipPath={"rect"}
                clipRelative={false}
                dragWithClip={false}
                clipTargetBounds={true}
                clipVerticalGuidelines={[10, 30, 200]}
                clipHorizontalGuidelines={[10, 30, 200]}
                dragArea={true}
                origin={true}
                snappable={true}
                verticalGuidelines={[80, 150, 200]}
                bounds={{ top: 60, left: 60 }}
                onDrag={(e) => {
                    e.target.style.cssText += `left:${e.left}px; top: ${e.top}px;`;
                }}
                onClip={(e) => {
                    // console.log(e.clipStyle);
                    if (e.clipType === "rect") {
                        e.target.style.clip = e.clipStyle;
                    } else {
                        e.target.style.clipPath = e.clipStyle;
                    }
                }}
            ></Moveable>
        </div>
    );
}
function RenderRoundable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".roundable .box")!);
    }, []);
    return (
        <div className="container roundable">
            Roundable
            <div
                className="box"
                style={{
                    borderRadius: "10%",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                roundable={true}
                minRoundControls={[1, 0]}
                maxRoundControls={[1, 0]}
                origin={false}
                onRound={(e) => {
                    e.target.style.borderRadius = e.borderRadius;
                }}
            ></Moveable>
        </div>
    );
}
function RenderOriginDraggable() {
    const [target, setTarget] = React.useState<HTMLElement>();
    const frame = {
        translate: [0, 0],
        rotate: 0,
    };
    React.useEffect(() => {
        setTarget(
            document.querySelector<HTMLElement>(".origin-draggable .box")!
        );
    }, []);
    return (
        <div className="container origin-draggable">
            <p>OriginDraggable</p>
            <div
                className="box"
                style={{
                    borderRadius: "10%",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={target}
                originDraggable={true}
                origin={true}
                draggable={true}
                rotatable={true}
                onDragStart={(e) => {
                    e.set(frame.translate);
                }}
                onDrag={(e) => {
                    frame.translate = e.beforeTranslate;
                }}
                onRotateStart={(e) => {
                    e.set(frame.rotate);
                }}
                onRotate={(e) => {
                    frame.rotate = e.beforeRotate;
                }}
                onDragOriginStart={(e) => {
                    e.dragStart && e.dragStart.set(frame.translate);
                }}
                onDragOrigin={(e) => {
                    frame.translate = e.drag.beforeTranslate;
                    e.target.style.transformOrigin = e.transformOrigin;
                }}
                onRender={(e) => {
                    const { translate, rotate } = frame;

                    e.target.style.transform =
                        `translate(${translate[0]}px, ${translate[1]}px)` +
                        ` rotate(${rotate}deg)`;
                }}
            ></Moveable>
        </div>
    );
}

function RenderSelecto() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".selecto .box"
                )!
            )
        );
    }, []);
    return (
        <div className="container selecto group">
            <p>Selecto</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                origin={false}
                onDrag={(e) => {
                    e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
                }}
            ></Moveable>
            <Selecto
                selectableTargets={[".selecto .box"]}
                hitRate={0}
                selectByClick={true}
                onSelect={(e) => {
                    setTarget(e.selected);
                }}
            ></Selecto>
        </div>
    );
}

function RenderBounds() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".bounds .box")!);
    }, []);
    return (
        <div className="container bounds">
            Bounds
            <div className="box">
                <span>A</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                origin={false}
                snappable={true}
                bounds={{ top: 60, left: 60 }}
                onDrag={(e) => {
                    e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
                }}
            ></Moveable>
        </div>
    );
}
function RenderInnerBounds() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".inner .box")!);
    }, []);
    return (
        <div className="container inner">
            <p>Inner Bounds</p>
            <div className="box">
                <span>A</span>
            </div>
            <Moveable
                target={target}
                draggable={true}
                origin={false}
                snappable={true}
                innerBounds={{ top: 20, left: 60, width: 100, height: 100 }}
                onDrag={(e) => {
                    e.target.style.cssText = `left:${e.left}px; top: ${e.top}px;`;
                }}
            ></Moveable>
        </div>
    );
}

function RenderDragGroup() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".draggroup .box"
                )!
            )
        );

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

    return (
        <div className="container draggroup group">
            <p>Drag Group</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={target}
                origin={true}
                draggable={true}
                onBeforeRenderGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        const translate = frames[i].translate;
                        ev.setTransform(
                            `translate(${translate[0]}px, ${translate[1]}px)`
                        );
                    });
                }}
                onDragGroupStart={(e) => {
                    // e.events.forEach((ev, i) => {
                    //     ev.set(frames[i].translate);
                    // });
                    e.events.forEach((ev, i) => {
                        ev.setTransformIndex(0);
                    });
                }}
                onDragGroup={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.beforeTranslate;

                        ev.target.style.transform = ev.transform;
                    });
                }}
            ></Moveable>
        </div>
    );
}
function RenderDragRootGroup() {
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    return (
        <div className="container draggroup_root root group">
            <p>Drag Root Group</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={(e) => {
                    (window as any).aaa = e;
                }}
                target={".draggroup_root .box"}
                rootContainer={document.body}
                origin={true}
                draggable={true}
                onBeforeRenderGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        const translate = frames[i].translate;
                        ev.setTransform(
                            `translate(${translate[0]}px, ${translate[1]}px)`
                        );
                    });
                }}
                onDragGroupStart={(e) => {
                    // e.events.forEach((ev, i) => {
                    //     ev.set(frames[i].translate);
                    // });
                    e.events.forEach((ev, i) => {
                        ev.setTransformIndex(0);
                    });
                }}
                onDragGroup={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.beforeTranslate;

                        ev.target.style.transform = ev.transform;
                    });
                }}
            ></Moveable>
        </div>
    );
}
function RenderScaleGroup() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".scalegroup .box"
                )!
            )
        );

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

    return (
        <div className="container scalegroup group">
            <p>Scale Group</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={target}
                origin={true}
                scalable={true}
                onBeforeRenderGroupStart={(e) => {
                    console.log(e);
                }}
                onScaleGroupStart={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        ev.set(frames[i].scale);
                        ev.dragStart && ev.dragStart.set(frames[i].translate);
                    });
                }}
                onScaleGroup={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.drag.beforeTranslate;
                        frames[i].scale = ev.scale;

                        ev.target.style.transform =
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            // + ` rotate(${frames[i].rotate}deg)`
                            ` scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;
                    });
                }}
            ></Moveable>
        </div>
    );
}
function RenderResizeGroup() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    const frames = [
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
        { translate: [0, 0], scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".resizegroup .box"
                )!
            )
        );

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

    return (
        <div className="container resizegroup group">
            <p>Resize Group</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={target}
                origin={true}
                resizable={true}
                onBeforeRenderGroupStart={(e) => {
                    console.log(e);
                }}
                onResizeGroupStart={(e) => {
                    e.setFixedDirection([0, 0]);
                    const { events } = e;
                    events.forEach((ev, i) => {
                        ev.dragStart && ev.dragStart.set(frames[i].translate);
                    });
                }}
                onResizeGroup={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.drag.beforeTranslate;

                        // console.log(ev.width, ev.height);
                        ev.target.style.width = `${ev.width}px`;
                        ev.target.style.height = `${ev.height}px`;
                        ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`;
                    });
                }}
            ></Moveable>
        </div>
    );
}

function RenderRotateGroup() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    const frames = [
        { translate: [0, 0], rotate: 0, scale: [-1, 1] },
        { translate: [0, 0], rotate: 0, scale: [1, 1] },
        { translate: [0, 0], rotate: 0, scale: [-1, 1] },
        { translate: [0, 0], rotate: 0, scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".rotategroup .box"
                )!
            )
        );

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

    return (
        <div className="container rotategroup group">
            <p>Rotate Group</p>
            <div className="box box1" style={{ transform: "scale(-1, 1)" }}>
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3" style={{ transform: "scale(-1, 1)" }}>
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={target}
                origin={true}
                draggable={true}
                rotatable={true}
                onBeforeRenderGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        ev.setTransform([
                            `rotate(${frames[i].rotate}deg)`,
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`,
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`,
                        ]);
                    });
                }}
                onRotateGroupStart={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        ev.setTransformIndex(0);
                        ev.dragStart && ev.dragStart.setTransformIndex(1);

                        // ev.set(frames[i].rotate);
                        // ev.dragStart && ev.dragStart.set(frames[i].translate);
                    });
                }}
                onDragGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        ev.setTransformIndex(1);
                    });
                }}
                onDragGroup={(e) => {
                    e.events.forEach((ev, i) => {
                        frames[i].translate = ev.translate;

                        ev.target.style.transform =
                            ` rotate(${frames[i].rotate}deg)` +
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;
                    });
                }}
                onRotateGroup={(e) => {
                    // console.log(e.events.map(ev => ev.beforeRotate), e.events.map(ev => ev.rotate));
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.drag.translate;
                        frames[i].rotate = ev.rotate;
                        ev.target.style.transform =
                            ` rotate(${frames[i].rotate}deg)` +
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;

                        // frames[i].translate = ev.drag.beforeTranslate;
                        // frames[i].rotate = ev.beforeRotate;

                        // ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`
                        //     // + ` rotate(${frames[i].rotate}deg)`
                        //     + ` rotate(${frames[i].rotate}deg)`;
                    });
                }}
            ></Moveable>
        </div>
    );
}
function RenderPSpan() {
    const [target, setTarget] = React.useState<HTMLElement>();
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".psan span")!);
    }, []);
    return (
        <div className="container psan">
            Render &lt; P &lt; SPAN
            <div style={{ padding: "10px", margin: "10px" }}>
                <p
                    data-no
                    style={{
                        padding: "10px",
                        margin: "10px",
                        transform: "translateZ(0px)",
                    }}
                >
                    <span
                        style={{
                            top: 0,
                            left: 0,
                            padding: "10px",
                            margin: "10px",
                        }}
                    >
                        AAA
                    </span>
                </p>
            </div>
            <Moveable
                target={target}
                draggable={true}
                origin={true}
                snappable={true}
                innerBounds={{ top: 20, left: 60, width: 100, height: 100 }}
                onDrag={(e) => {
                    e.target.style.cssText += `left:${e.left}px; top: ${e.top}px;`;
                }}
            ></Moveable>
        </div>
    );
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
    return (
        <div className="container svg">
            <p>SVG</p>

            <svg
                data-target="svg"
                style={{ width: "300px", border: "1px solid #333" }}
            >
                <path
                    data-target="path1"
                    d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z"
                    fill="#f55"
                    stroke-linejoin="round"
                    stroke-width="8"
                    opacity="1"
                    stroke="#5f5"
                    origin="50% 50%"
                />
                <path
                    data-target="path2"
                    d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z"
                    fill="#55f"
                    stroke-linejoin="round"
                    stroke-width="8"
                    opacity="1"
                    stroke="#333"
                    origin="50% 50%"
                />
                <g style={{ transform: "translate(40px, 10px)" }}>
                    <path
                        data-target="pathline"
                        d="M3,19.333C3,17.258,9.159,1.416,21,5.667
    c13,4.667,13.167,38.724,39.667,7.39"
                        fill="transparent"
                        stroke="#ff5"
                    />
                    <ellipse
                        data-target="ellipse"
                        cx="40"
                        cy="80"
                        rx="40"
                        ry="10"
                        style={{
                            fill: "yellow",
                            stroke: "purple",
                            strokeWidth: 2,
                        }}
                    />
                    <text
                        text-anchor="middle"
                        x="40"
                        y="40"
                        style={{ transformOrigin: "10% 10%" }}
                    >
                        HIHI
                    </text>
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
                onDragStart={(e) => {
                    e.set(frame.translate);
                }}
                onDrag={(e) => {
                    frame.translate = e.beforeTranslate;
                }}
                onRotateStart={(e) => {
                    e.set(frame.rotate);
                }}
                onRotate={(e) => {
                    frame.rotate = e.beforeRotate;
                }}
                onDragOriginStart={(e) => {
                    e.dragStart && e.dragStart.set(frame.translate);
                }}
                onDragOrigin={(e) => {
                    frame.translate = e.drag.beforeTranslate;

                    console.log(e.dist, e.drag.beforeDist);
                    e.target.style.transformOrigin = e.transformOrigin;
                }}
                onRender={(e) => {
                    const { translate, rotate } = frame;

                    const transform =
                        `translate(${translate[0]}px, ${translate[1]}px)` +
                        ` rotate(${rotate}deg)`;
                    e.target.style.transform = transform;
                    e.target.setAttribute("transform", transform);
                }}
            ></Moveable>
        </div>
    );
}

function RenderTRSGroup() {
    const [target, setTarget] = React.useState<
        Array<HTMLElement | SVGElement>
    >();
    const frames = [
        { translate: [0, 0], rotate: 0, scale: [-1, 1] },
        { translate: [0, 0], rotate: 0, scale: [1, 1] },
        { translate: [0, 0], rotate: 0, scale: [-1, 1] },
        { translate: [0, 0], rotate: 0, scale: [1, 1] },
    ];

    const ref = React.useRef<Moveable>(null);
    React.useEffect(() => {
        setTarget(
            [].slice.call(
                document.querySelectorAll<HTMLElement | SVGElement>(
                    ".trsgroup .box"
                )!
            )
        );

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

    return (
        <div className="container trsgroup group">
            <p>T & R & S Group</p>
            <div className="box box1" style={{ transform: "scale(-1, 1)" }}>
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3" style={{ transform: "scale(-1, 1)" }}>
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={target}
                origin={true}
                draggable={true}
                scalable={true}
                rotatable={true}
                onBeforeRenderGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        ev.setTransform([
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`,
                            `rotate(${frames[i].rotate}deg)`,
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`,
                        ]);
                    });
                }}
                onRotateGroupStart={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        ev.setTransformIndex(1);
                        ev.dragStart && ev.dragStart.setTransformIndex(0);

                        // ev.set(frames[i].rotate);
                        // ev.dragStart && ev.dragStart.set(frames[i].translate);
                    });
                }}
                onDragGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        ev.setTransformIndex(0);
                    });
                }}
                onDragGroup={(e) => {
                    e.events.forEach((ev, i) => {
                        frames[i].translate = ev.translate;

                        ev.target.style.transform =
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            ` rotate(${frames[i].rotate}deg)` +
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;
                    });
                }}
                onRotateGroup={(e) => {
                    // console.log(e.events.map(ev => ev.beforeRotate), e.events.map(ev => ev.rotate));
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.drag.translate;
                        frames[i].rotate = ev.rotate;
                        ev.target.style.transform =
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            ` rotate(${frames[i].rotate}deg)` +
                            `scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;

                        // frames[i].translate = ev.drag.beforeTranslate;
                        // frames[i].rotate = ev.beforeRotate;

                        // ev.target.style.transform = `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)`
                        //     // + ` rotate(${frames[i].rotate}deg)`
                        //     + ` rotate(${frames[i].rotate}deg)`;
                    });
                }}
                onScaleGroupStart={(e) => {
                    e.events.forEach((ev, i) => {
                        ev.setTransformIndex(2);
                        ev.dragStart && ev.dragStart.setTransformIndex(0);

                        // ev.set(frames[i].rotate);
                        // ev.dragStart && ev.dragStart.set(frames[i].translate);
                    });
                }}
                onScaleGroup={(e) => {
                    const { events } = e;
                    events.forEach((ev, i) => {
                        frames[i].translate = ev.drag.beforeTranslate;
                        frames[i].scale = ev.scale;

                        ev.target.style.transform =
                            `translate(${frames[i].translate[0]}px, ${frames[i].translate[1]}px)` +
                            ` rotate(${frames[i].rotate}deg)` +
                            ` scale(${frames[i].scale[0]}, ${frames[i].scale[1]})`;
                    });
                }}
            ></Moveable>
        </div>
    );
}

function RenderTRSIndividualGroup() {
    const [frameMap] = React.useState(() => {
        return new Map<
            HTMLElement | SVGElement,
            { translate: number[]; rotate: number; scale: number[] }
        >();
    });
    function getFrame(target: HTMLElement | SVGElement) {
        if (!frameMap.has(target)) {
            frameMap.set(target, {
                translate: [0, 0],
                rotate: 0,
                scale: [1, 1],
            });
        }

        return frameMap.get(target);
    }

    const ref = React.useRef<any>(null);

    useEffect(() => {
        (window as any).b = ref.current;
    });

    return (
        <div className="container trs-individual-group group">
            <p>T & R & S Group</p>
            <div className="box box1">
                <span>A</span>
            </div>
            <div className="box box2">
                <span>B</span>
            </div>
            <div className="box box3">
                <span>C</span>
            </div>
            <div className="box box4">
                <span>D</span>
            </div>
            <Moveable
                ref={ref}
                target={".trs-individual-group .box"}
                individualGroupable={true}
                origin={false}
                draggable={true}
                resizable={true}
                rotatable={true}
                onBeforeRenderStart={(e) => {
                    const frame = getFrame(e.target)!;

                    e.setTransform([
                        `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`,
                        `rotate(${frame.rotate}deg)`,
                        `scale(${frame.scale[0]}, ${frame.scale[1]})`,
                    ]);
                }}
                onDragStart={(e) => {
                    e.setTransformIndex(0);
                }}
                onDrag={(e) => {
                    frameMap.get(e.target)!.translate = e.translate;
                    e.target.style.transform = e.transform;
                }}
                onResizeStart={(e) => {
                    e.dragStart && e.dragStart.setTransformIndex(0);
                }}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;

                    e.target.style.transform = e.drag.transform;
                    frameMap.get(e.target)!.translate = e.drag.translate;
                }}
            ></Moveable>
        </div>
    );
}

const MouseCustomAble = {
    name: "mouseTest",
    props: {},
    events: {},
    mouseEnter() {
        console.log("ENTER");
    },
    mouseLeave() {
        console.log("LEAVE");
    },
};
function RenderCustomAble() {
    return (
        <div className="container custom">
            Custom Able
            <div
                className="box"
                style={{
                    transform:
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                }}
            >
                <span>A</span>
            </div>
            <Moveable
                target={".custom .box"}
                ables={[MouseCustomAble]}
                props={{
                    mouseTest: true,
                }}
                draggable={true}
                origin={true}
                edgeDraggable={true}
                dragArea={true}
                onDragStart={(e) => {
                    e.setTransform(
                        "translate(10px, 10px) rotate(30deg) translate(10px, 10px) scale(2, 2)",
                        2
                    );
                }}
                onDrag={(e) => {
                    console.log(e.transform);
                    e.target.style.transform = e.transform;
                }}
                onRenderStart={(e) => {
                    console.log(e);
                }}
                onRender={(e) => {
                    console.log(e);
                }}
                onRenderEnd={(e) => {
                    console.log(e);
                }}
            ></Moveable>
        </div>
    );
}
export default function App() {
    return (
        <div>
            <RenderSVGG />
            <RenderSVG />
            <RenderDraggable />
            <RenderDraggable2 />
            <RenderDraggableResizableRotatableSnappable />
            <RenderRootDraggable />
            <RenderResizableRequest />
            <RenderClickable />
            <RenderGroupClickable />
            <RenderScalable />
            <RenderResizable />
            <RenderRotatable />
            <RenderWarpable />
            <RenderClippable />
            <RenderRoundable />
            <RenderOriginDraggable />
            <RenderSelecto />
            <RenderBounds />
            <RenderInnerBounds />
            <RenderDragGroup />
            <RenderDragRootGroup />
            <RenderScaleGroup />
            <RenderRotateGroup />
            <RenderResizeGroup />
            <RenderTRSGroup />
            <RenderTRSIndividualGroup />
            <RenderPSpan />
            <RenderSVGOriginDraggable />
            <RenderCustomAble />
        </div>
    );
}
