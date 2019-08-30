import * as React from "react";
import Moveable from "../../src/react-moveable";
import { ref } from "framework-utils";

export default class MoveableExample extends React.Component {
    public innerMoveable!: Moveable;
    public state = {
        target: null,
    };
    public render() {
        return (
            <div className="c1" style={{ position: "relative", left: "0px", top: "0px", width: "500px", height: "500px", border: "2px solid black" }}>
            <Moveable target={this.state.target} ref={ref(this, "innerMoveable")} />
            <div className="c2" style={{ position: "relative", left: "0px", top: "0px", width: "500px", height: "500px", border: "2px solid black" }}>
            <svg data-target="svg" viewBox="0 0 150 110" style={{ position: "relative", left: "0px", width: "300px", border: "1px solid #f55"}}>
            <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
            <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
            <g style={{transform: "translate(40px, 10px)"}}>
                <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5"/>
            <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{fill: "yellow",stroke:"purple", strokeWidth:2}} />
            </g>
        </svg></div></div>
        );
    }
    public componentDidMount() {
        this.setState({
            target: document.querySelector(".c1 svg"),
        });
    }
}
