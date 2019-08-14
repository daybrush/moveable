import React from "react";
import Moveable, { MoveableGroup } from "./react-moveable";
import logo from "./logo.svg";
import "./App.css";
import { ref } from "framework-utils";
import KeyController from "keycon";
import { setAlias, Frame } from "scenejs";
import { IObject } from "@daybrush/utils";

setAlias("tx", ["transform", "translateX"]);
setAlias("ty", ["transform", "translateY"]);
setAlias("tz", ["transform", "translateZ"]);
setAlias("rotate", ["transform", "rotate"]);
setAlias("sx", ["transform", "scaleX"]);
setAlias("sy", ["transform", "scaleY"]);
setAlias("matrix3d", ["transform", "matrix3d"]);

class App extends React.Component {
    public moveable: Moveable;
    public state = {
        target: null,
        isResizable: true,
        item: null,
    } as {
        target: any,
        isResizable: boolean,
        item: Frame,
    };
    private items: IObject<Frame> = {};
    public render() {
        const selectedTarget = this.state.target;
        const isResizable = this.state.isResizable;
        const item = this.state.item;
        (window as any).a = this;
        return (
            <div>
                <div id="test" style={{position: "fixed", height: "69.28203582763672px", width: "60px", top: 0, left: 0, backgroundColor: "#f5f", zIndex: 4000 }}></div>
                <MoveableGroup
                    rotatable={true}
                    scalable={true}
                    ref={ref(this, "ab")}
                    targets={[].slice.call(document.querySelectorAll("path"))}
                    origin={false}
                    onGroupDragStart={e => {
                        console.log("start", e);
                    }}
                    onGroupDrag={e => {
                        console.log("뭐", e);
                    }}
                    />
                <Moveable
                    target={selectedTarget}
                    container={document.body}
                    ref={ref(this, "moveable")}
                    keepRatio={false}
                    origin={true}
                    draggable={true}
                    scalable={!isResizable}
                    resizable={isResizable}
                    // warpable={true}
                    throttleDrag={0}
                    throttleScale={0}
                    throttleResize={0}
                    throttleRotate={0}
                    rotatable={true}
                    pinchable={true}
                    onRotate={({ target, beforeDelta }) => {
                        item.set("rotate", `${parseFloat(item.get("rotate")) + beforeDelta}deg`);
                        target.style.cssText += item.toCSS();
                    }}
                    onDrag={({ target, beforeDelta }) => {

                        item.set("tx", `${parseFloat(item.get("tx")) + beforeDelta[0]}px`);
                        item.set("ty", `${parseFloat(item.get("ty")) + beforeDelta[1]}px`);
                        // target!.style.left = `${left}px`;
                        // target!.style.top = `${top}px`;
                        target.style.cssText += item.toCSS();
                    }}
                    onScale={({ target, dist }) => {
                        // console.log(delta);
                        item.set("sx", item.get("sx") * dist[0]);
                        item.set("sy", item.get("sy") * dist[1]);

                        target.style.cssText += item.toCSS();
                    }}
                    onResize={({ target, width, height, delta }) => {
                        delta[0] && (target!.style.width = `${width}px`);
                        delta[1] && (target!.style.height = `${height}px`);
                    }}
                    onWarp={({ target, delta, multiply }) => {
                        const matrix3d = item.get("matrix3d");

                        if (!matrix3d) {
                            item.set("matrix3d", delta);
                        } else {
                            item.set("matrix3d", multiply(item.get("matrix3d"), delta, 4));
                        }
                        target.style.cssText += item.toCSS();
                    }}
                />
                <div className="App" onMouseDown={this.onClick} onTouchStart={this.onClick} data-target="app">
                    <div className="box" data-target="box"><span>A</span></div>
                    <header className="App-header" data-target="header">
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
                        <svg data-target="svg" viewBox="0 0 150 107.28203230275507" style={{width: "300px", border: "1px solid #fff"}}>
                            <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
                            <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
                            <g style={{transform: "translate(40px, 10px)"}}>
                                <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
                            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5"/>
                            <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{fill: "yellow",stroke:"purple", "stroke-width":2}} />
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
    public onClick = (e: any) => {
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
        const items = this.items;
        if (!items[id]) {
            items[id] = new Frame({
                tz: "5px",
                tx: "0px",
                ty: "0px",
                rotate: "0deg",
                sx: 1,
                sy: 1,
            });
        }

        if (!this.moveable.isMoveableElement(e.target)) {
            if (this.state.target === e.target) {
                this.moveable.updateRect();
            } else {
                const nativeEvent = e.nativeEvent;
                this.setState({
                    target: e.target,
                    item: items[id],
                }, () => {
                    this.moveable.dragStart(nativeEvent);
                });
            }
        }
    }
    public componentDidMount() {
        const keycon = new KeyController(window);

        keycon.keydown("shift", () => {
            this.setState({ isResizable: false });
        }).keyup("shift", () => {
            this.setState({ isResizable: true });
        });
    }
}

export default App;
