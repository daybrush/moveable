import React from "react";
import Moveable from "./react-moveable";
import logo from "./logo.svg";
import "./App.css";
import { ref } from "framework-utils";
import KeyController from "keycon";
import { setAlias, Frame } from "scenejs";
import { IObject } from "@daybrush/utils";
import Guides from "@scena/react-guides";

setAlias("tx", ["transform", "translateX"]);
setAlias("ty", ["transform", "translateY"]);
setAlias("tz", ["transform", "translateZ"]);
setAlias("rotate", ["transform", "rotate"]);
setAlias("sx", ["transform", "scaleX"]);
setAlias("sy", ["transform", "scaleY"]);
setAlias("matrix3d", ["transform", "matrix3d"]);

class App extends React.Component {
    public moveable!: Moveable;
    public state: {
        container: any,
        target: any,
        emo: any,
        isShift: boolean,
        targets: Array<HTMLElement | SVGElement>,
        isResizable: boolean,
    } = {
        target: null,
        container: null,
        targets: [],
        isResizable: true,
        isShift: false,
        emo: null,
    };
    private itemMap: Map<HTMLElement |SVGElement, Frame> = new Map();
    private items: IObject<Frame> = {};
    private guides1!: Guides;
    private guides2!: Guides;
    public render() {
        const selectedTarget = this.state.target;
        const isResizable = this.state.isResizable;
        const item = this.itemMap.get(selectedTarget)!;

        (window as any).a = this;
        return (
            <div id="con">
                <div className="guides horizontal">
                    <Guides ref={ref(this, "guides1")}/>
                </div>
                <div className="guides vertical">
                    <Guides ref={ref(this, "guides2")} type="vertical"/>
                </div>
                <div id="test" style={{
                    position: "fixed",
                    height: "69.28203582763672px",
                    width: "60px",
                    top: 0, left: 0, backgroundColor: "#f5f", zIndex: 4000,
                }}></div>
                <Moveable
                    // edge={true}
                    pinchable={true}
                    draggable={true}
                    rotatable={isResizable}
                    // resizable={true}
                    scalable={true}
                    ref={ref(this, "ab")}
                    // keepRatio={false}
                    bounds={{ left: 30, top: 30 }}
                    target={this.state.targets}
                    defaultGroupRotate={0}
                    origin={true}
                    snappable={true}
                    snapCenter={true}
                    verticalGuidelines={[200, 400, 600]}
                    horizontalGuidelines={[200, 400, 600]}
                    // elementGuidelines={[document.querySelector<HTMLElement>(".box2")!]}
                    throttleRotate={0}
                    onDragGroupStart={e => {
                        console.log("start", e);

                        e.events.forEach(ev => {
                            const groupItem = this.itemMap.get(ev.target)!;

                            ev.set([
                                parseFloat(groupItem.get("tx")),
                                parseFloat(groupItem.get("ty")),
                            ]);
                        });
                    }}
                    onDragGroup={e => {
                        // console.log(e.beforeDelta);

                        e.events.forEach(ev => {
                            const groupItem = this.itemMap.get(ev.target)!;
                            groupItem.set("tx", `${ev.beforeTranslate[0]}px`);
                            groupItem.set("ty", `${ev.beforeTranslate[1]}px`);

                            ev.target.style.cssText += groupItem.toCSS();
                        });

                        // (this as any).ab.updateTarget();
                        // (this as any).ab.updateRect();
                    }}
                    onRotateGroupStart={e => {
                        console.log("rgs", e);
                    }}
                    onRotateGroup={e => {
                        e.events.forEach(ev => {
                            const groupItem = this.itemMap.get(ev.target)!;

                            if (!e.isPinch) {
                                groupItem.set("tx", `${parseFloat(groupItem.get("tx")) + ev.drag.beforeDelta[0]}px`);
                                groupItem.set("ty", `${parseFloat(groupItem.get("ty")) + ev.drag.beforeDelta[1]}px`);
                            }
                            console.log("A", parseFloat(groupItem.get("rotate")), ev.beforeDelta);
                            groupItem.set("rotate", `${parseFloat(groupItem.get("rotate")) + ev.beforeDelta}deg`);

                            ev.target.style.cssText += groupItem.toCSS();
                        });
                    }}
                    onResizeGroupStart={e => {
                        console.log("rgs", e);

                        e.events.forEach(ev => {
                            const groupItem = this.itemMap.get(ev.target)!;

                            ev.setOrigin(["%", "%"]);
                            ev.dragStart && ev.dragStart.set([
                                parseFloat(groupItem.get("tx")),
                                parseFloat(groupItem.get("ty")),
                            ]);
                        });
                    }}
                    onResizeGroup={e => {

                        e.events.forEach(ev => {
                            const groupItem = this.itemMap.get(ev.target)!;

                            // groupItem.set("tx", `${parseFloat(groupItem.get("tx")) + ev.drag.beforeDelta[0]}px`);
                            // groupItem.set("ty", `${parseFloat(groupItem.get("ty")) + ev.drag.beforeDelta[1]}px`);

                            // console.log(ev.drag.beforeTranslate[0]);
                            groupItem.set("tx", `${ev.drag.beforeTranslate[0]}px`);
                            groupItem.set("ty", `${ev.drag.beforeTranslate[1]}px`);
                            groupItem.set("width", `${ev.width}px`);
                            groupItem.set("height", `${ev.height}px`);

                            ev.target.style.cssText += groupItem.toCSS();
                        });
                    }}
                    onScaleGroupStart={e => {
                        console.log("scs", e);
                    }}
                    onScaleGroup={e => {
                        e.events.forEach(ev => {
                            // console.log("sca", ev.drag.dist);
                            const groupItem = this.itemMap.get(ev.target)!;
                            groupItem.set("tx", `${parseFloat(groupItem.get("tx")) + ev.drag.beforeDelta[0]}px`);
                            groupItem.set("ty", `${parseFloat(groupItem.get("ty")) + ev.drag.beforeDelta[1]}px`);
                            groupItem.set("sx", groupItem.get("sx") * ev.delta[0]);
                            groupItem.set("sy", groupItem.get("sy") * ev.delta[1]);

                            ev.target.style.cssText += groupItem.toCSS();
                        });
                    }}
                    onClickGroup={e => {
                        console.log(e);
                    }}
                    />
                <Moveable
                    target={selectedTarget}
                    className="no-radius"
                    // container={document.querySelector<HTMLElement>("#con")}
                    ref={ref(this, "moveable")}
                    keepRatio={this.state.isShift}
                    origin={true}
                    // edge={true}
                    // dragArea={true}
                    draggable={true}
                    snappable={true}
                    scrollable={true}
                    transformOrigin="% %"
                    snapDigit={0}
                    bounds={{ left: 30, top: 20 }}
                    // innerBounds={{ left: 400, top: 400, width: 200, height: 200 }}
                    verticalGuidelines={[200, 400, 600]}
                    horizontalGuidelines={[200, 400, 600]}
                    // renderDirections={["n", "ne", "nw"]}
                    // elementGuidelines={[
                    //     document.querySelector(".box1 span")!,
                    //     // document.querySelector(".emo img")!,
                    //     document.querySelector<HTMLElement>(".box2")!,
                    // ]}
                    snapCenter={true}
                    // snapThreshold={10}
                    // scalable={!isResizable}
                    // scalable={true}
                    resizable={true}
                    // resizable={isResizable}
                    rotatable={true}
                    // resizable={isResizable}
                    // warpable={true}
                    throttleDrag={0}
                    throttleDragRotate={isResizable ? 0 : 30}
                    throttleScale={0}
                    throttleResize={0}
                    // throttleRotate={10}

                    pinchable={true}
                    onScroll={({ scrollContainer, direction }) => {
                        scrollContainer.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}
                    onRotateStart={({ set }) => {
                        const rotate = parseFloat(item.get("rotate")) || 0;

                        set(rotate);
                    }}
                    onRotate={({ target, beforeRotate }) => {
                        item.set("rotate", `${beforeRotate}deg`);
                        target.style.cssText += item.toCSS();
                    }}
                    onDragStart={({ set }) => {
                        const tx = parseFloat(item.get("tx")) || 0;
                        const ty = parseFloat(item.get("ty")) || 0;

                        set([tx, ty]);
                    }}
                    onDrag={({ target, beforeTranslate }) => {
                        item.set("tx", `${beforeTranslate[0]}px`);
                        item.set("ty", `${beforeTranslate[1]}px`);
                        // target!.style.left = `${left}px`;
                        // target!.style.top = `${top}px`;
                        target.style.cssText += item.toCSS();
                    }}
                    onScaleStart={({ set, dragStart }) => {
                        const sx = parseFloat(item.get("sx")) || 0;
                        const sy = parseFloat(item.get("sy")) || 0;
                        const tx = parseFloat(item.get("tx")) || 0;
                        const ty = parseFloat(item.get("ty")) || 0;

                        set([sx, sy]);

                        dragStart && dragStart.set([tx, ty]);
                    }}
                    onScale={({ target, scale, drag }) => {
                        item.set("sx", scale[0]);
                        item.set("sy", scale[1]);
                        item.set("tx", `${drag.beforeTranslate[0]}px`);
                        item.set("ty", `${drag.beforeTranslate[1]}px`);

                        target.style.cssText += item.toCSS();
                    }}
                    onResizeStart={({ dragStart, setOrigin }) => {
                        const tx = parseFloat(item.get("tx")) || 0;
                        const ty = parseFloat(item.get("ty")) || 0;

                        setOrigin(["%", "%"]);
                        dragStart && dragStart.set([tx, ty]);
                    }}
                    onResize={({ target, width, height, drag, delta, dist }) => {
                        // console.log(width, height);
                        item.set("width", `${width}px`);
                        item.set("height", `${height}px`);
                        item.set("tx", `${drag.beforeTranslate[0]}px`);
                        item.set("ty", `${drag.beforeTranslate[1]}px`);

                        target.style.cssText += item.toCSS();
                    }}
                    onWarp={({ target, delta, matrix, multiply }) => {
                        const matrix3d = item.get("matrix3d");

                        if (!matrix3d) {
                            item.set("matrix3d", delta);
                        } else {
                            item.set("matrix3d", multiply(item.get("matrix3d"), delta, 4));
                        }
                        // item.set("matrix3d", matrix);
                        target.style.cssText += item.toCSS();
                    }}
                    onClick={e => {
                        console.log(e);
                    }}
                />

                <div className="App" onMouseDown={this.onClick} onTouchStart={this.onClick} data-target="app">
                    <div className="box box1" data-target="box"><span>A</span><span>B</span><span>C</span></div>

                    <header className="App-header" data-target="header">

                {this.state.container && <Moveable
                ref={ref(window, "er")}
                warpable={true}
                target={this.state.emo}
                // container={document.querySelector<HTMLElement>(".App")}
                snappable={true}
                verticalGuidelines={[200, 400, 600]}
                horizontalGuidelines={[200, 400, 600]}
                onWarp={e => {
                    e.target.style.transform = e.transform;
                }} />}
                        <div className="staticbox">
                            <div className="emo">
                                <img src="./emo.png" />
                            </div>
                        </div>
                        <input type="text" style={{
                            position: "absolute",
                            left: "700px",
                        }}/>
                        <Moveable target={document.querySelector("input")}
                        draggable={true}
                            onDragStart={e => {
                                return false;
                            }}
                        />
                        <div className="box box2" data-target="box2"><span>A</span></div>

                        <div className="box box23" data-target="box23"><span>AA</span></div>

                        <img src={logo} className="App-logo" alt="logo" data-target="logo" />
                        <p data-target="p">
                            Edit <code data-target="code">src/App.tsx</code> and save to reload.
                        </p>
                        <a
                            className="App-link"
                            rel="noopener noreferrer"
                            data-target="link"
                        >
                            Learn React
                        </a>
                        <svg data-target="svg" viewBox="0 0 150 110" style={{width: "300px", border: "1px solid #fff"}}>
                            <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
                            <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
                            <g style={{transform: "translate(40px, 10px)"}}>
                                <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
                            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5"/>
                            <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{fill: "yellow",stroke:"purple", strokeWidth:2}} />
                            </g>
                        </svg>
                    </header>
                </div>
            </div>
        );
    }
    public onCLickOuside = (e: any) => {

    }
    public onClickInside = (e: any) => {
        const target = e.target;
    }
    public setItem(el: HTMLElement | SVGElement) {
        this.itemMap.set(el, new Frame({
            tz: "5px",
            tx: "0px",
            ty: "0px",
            rotate: "0deg",
            sx: 1,
            sy: 1,
        }));
    }
    public onClick = (e: any) => {
        if (e.target.nodeName === "INPUT") {
            return;
        }
        const target = e.target;

        const id = target.getAttribute("data-target");
        e.preventDefault();

        const clientX = e.clientX;
        const clientY = e.clientY;

        // console.log(this.moveable.isInside(clientX, clientY));
        // this.state.target && this.moveable.isInside(clientX, clientY)
        if (!id) {
            return;
        }
        if (!this.itemMap.get(target)) {
            this.setItem(target);
        }
        if (!this.moveable.isMoveableElement(e.target)) {
            if (this.state.target === e.target) {
                this.moveable.updateRect();
            } else {
                const nativeEvent = e.nativeEvent;
                this.setState({
                    target: e.target,
                }, () => {

                });
                this.moveable.dragStart(nativeEvent);
            }
        }
    }
    public componentDidMount() {
        const keycon = new KeyController(window);
        const mvb = (this as any).moveable;
        let requester: any;
        keycon.keydown("shift", () => {
            this.setState({ isResizable: false, isShift: true });
        }).keydown("right", e => {
            if (!requester) {
                requester = mvb.request("resizable", { direction: [0, 0] })!;
            }
            requester.request({ deltaWidth: 10, deltaHeight: 0});
            // requester.request({ deltaX: 10, deltaY: 0});
            e.inputEvent.preventDefault();
        }).keydown("left", e => {
            if (!requester) {
                requester = mvb.request("resizable", { direction: [0, 0]})!;
            }
            requester.request({ deltaWidth: -10, deltaHeight: 0});
            // requester.request({ deltaX: -10, deltaY: 0});
            e.inputEvent.preventDefault();
        }).keydown("up", e => {
            if (!requester) {
                requester = mvb.request("draggable")!;
            }
            requester.request({ deltaX: 0, deltaY: -10 });
            e.inputEvent.preventDefault();
        }).keydown("down", e => {
            if (!requester) {
                requester = mvb.request("draggable")!;
            }
            requester.request({ deltaX: 0, deltaY: 10 });
            e.inputEvent.preventDefault();
        }).keyup("left", () => {
            if (requester) {
                requester.requestEnd();
                requester = null;
            }
        }).keyup("right", () => {
            if (requester) {
                requester.requestEnd();
                requester = null;
            }
        }).keyup("up", () => {
            if (requester) {
                requester.requestEnd();
                requester = null;
            }
        }).keyup("down", () => {
            if (requester) {
                requester.requestEnd();
                requester = null;
            }
        }).keyup("shift", () => {
            this.setState({ isResizable: true, isShift: false });
        });

        const targets: any[] = [].slice.call(document.querySelectorAll(`[data-target="box"] span`));

        targets.forEach(target => {
            this.setItem(target);
        });
        this.setState({
            targets,
        });

        setTimeout(() => {
            this.guides1.loadGuides([200, 400, 600]);
            this.guides2.loadGuides([200, 400, 600]);
            this.setState({
                emo: document.querySelector(".emo") as HTMLElement,
            }, () => {
                this.setState({
                    container: document.querySelector(".App-header"),
                });
            });
        }, 100);
    }
}

export default App;
