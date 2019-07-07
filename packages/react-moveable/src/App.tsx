import React from "react";
import ReactDOM from "react-dom";
import Moveable from "./react-moveable";
import logo from "./logo.svg";
import "./App.css";
import { ref } from "framework-utils";

class App extends React.Component {
    public moveable: Moveable;
    public state = {
        target: null,
    };
    public render() {
        return (<div>
                        <Moveable target={this.state.target} ref={ref(this, "moveable")} />
            <div className="App" onClick={this.onClick} onTouchEnd={this.onClick}>

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
        if (!(ReactDOM.findDOMNode(this.moveable) as HTMLElement).contains(e.target)) {
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
