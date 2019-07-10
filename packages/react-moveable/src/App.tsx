import React from "react";
import Moveable from "./react-moveable";
import logo from "./logo.svg";
import "./App.css";
import { ref } from "framework-utils";
import KeyController from "keycon";

class App extends React.Component {
    public moveable: Moveable;
    public state = {
        target: null,
        isResizable: true,
    };
    public deg = 18;
    public render() {
        const selectedTarget = this.state.target;
        const isResizable = this.state.isResizable;

        return (
            <div>
                <Moveable
                    target={selectedTarget}
                    ref={ref(this, "moveable")}
                    scalable={!isResizable}
                    resizable={isResizable}
                    onRotate={({ target, transform }) => {
                        target!.style.transform = transform;
                    }}
                    onDrag={({ target, transform }) => {
                        // target!.style.left = `${left}px`;
                        // target!.style.top = `${top}px`;
                        target!.style.transform = transform;
                    }}
                    onScale={({ target, transform }) => {
                        target!.style.transform = transform;
                    }}
                    onResize={({ target, width, height, delta }) => {
                        delta[0] && (target!.style.width = `${width}px`);
                        delta[1] && (target!.style.height = `${height}px`);
                    }}
                />
                <div className="App" onMouseDown={this.onClick}>

                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p>
                            Edit <code>src/App.tsx</code> and save to reload.
                        </p>
                        <a
                            className="App-link"
                            rel="noopener noreferrer"
                        >
                            Learn React
                        </a>
                    </header>
                </div>
            </div>
        );
    }
    public onClick = (e: any) => {
        console.log("?", e.target.className);
        e.preventDefault();

        const keycon = new KeyController(window);

        keycon.keydown("shift", () => {
            this.setState({ isResizable: false });
        }).keyup("shift", () => {
            this.setState({ isResizable: true });
        })
        if (!this.moveable.isMoveableElement(e.target)) {
            if (this.state.target === e.target) {
                this.moveable.updateRect();
            } else {
                this.setState({
                    target: e.target,
                });
            }
        }
    }
}

export default App;
