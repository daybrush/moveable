import * as React from "react";
import Moveable from "../../../src/react-moveable";
import { ref } from "framework-utils";

export default class DraggableExample extends React.Component<any> {
    public innerMoveable!: Moveable;
    public state = {
        target: null,
    };
    public render() {
        return (
            <div>
                <Moveable target={this.state.target} ref={ref(this, "innerMoveable")}
                    draggable={true} {...this.props as any} />
                <div className="c1" style={{
                    position: "relative", left: "0px", top: "0px", width: "500px", height: "500px", border: "2px solid black",
                    transform: "scale(2)",
                }}>

                    <div className="c2" style={{
                        position: "relative", left: "0px", top: "0px", width: "100px", height: "100px", border: "2px solid black",
                    }}></div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        this.setState({
            target: document.querySelector(".c2"),
        });
    }
}
