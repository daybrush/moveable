import * as React from "react";
import Moveable from "../../../src/react-moveable";
import { ref } from "framework-utils";

export default class RotateDraggableExample extends React.Component<any> {
    public innerMoveable!: Moveable;
    public state = {
        target: null,
    };
    public render() {
        return (
            <div>
                <Moveable target={this.state.target} ref={ref(this, "innerMoveable")}
                    draggable={true} {...this.props as any} />
                <div style={{
                    transform: `scale(${this.props.scale})`,
                    transformOrigin: "top",
                }}>
                    <div className="parent" style={{
                        transform: "translate(50px, 50px) rotate(270deg)",
                        position: "absolute",
                        height: "200px",
                        width: "240px",
                    }}>
                        <div className="child" style={{
                            position: "absolute",
                            width: "100px",
                            height: "100px",
                        }}>child</div>
                    </div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        this.setState({
            target: document.querySelector(".child"),
        });
    }
}
