import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {

    return (
        <div className="no-relative" style={{
            // position: "relative",
            height: "400px",
        }}>
            <div className="target" style={{
                marginLeft: "100px",
                // left: "100px",
                // transform: "translate(100px, 0px)",
            }}>Target</div>
            <svg className="target2" data-target="svg" style={{
                top: "45.7%",
                left: "63%",
                width: "17%",
                height: "40%",
                transform: "rotate(0deg)",
                border: "1px solid black",
            }}>
                <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
                <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
                <g style={{ transform: "translate(40px, 10px)" }}>
                    <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
                            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5" />
                    <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{ fill: "yellow", stroke: "purple", strokeWidth: 2 }} />
                </g>
            </svg>
            <Moveable
                target={".target"}
                draggable={true}
                rotatable={true}
                // rootContainer={document.documentElement}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            ></Moveable>
            <Moveable
                target={".target2"}
                draggable={true}
                rotatable={true}
                // rootContainer={document.documentElement}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            ></Moveable>
        </div>
    );
}
