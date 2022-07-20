/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import Moveable from "@/react-moveable";

const CustomElement = `
class CustomElement extends HTMLElement {
    styleText = ${"`"}
.card {
width: 100%;
height: 100%;
}

.card-header {
width:100%;
height: 80px;
background-color: #3794FF;
}

.card-content {
width: 100%;
height: calc(100% - 80px);
background-color: #EDF0F3;
position: relative;
}
${"`"};

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = ${"`"}
<div class="card-header"></div>
<div class="card-content">
  <slot name="custom-element"></slot>
</div>
${"`"};
        style.textContent = this.styleText;
        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
    }
}
if (!customElements.get("custom-element")) {
    customElements.define('custom-element', CustomElement);
}
`;

if (typeof window !== "undefined") {
    eval(CustomElement);
}



declare global {
    interface HTMLElementTagNameMap {
        "custom-element": HTMLElement;
    }
    namespace JSX {
        interface IntrinsicElements {
            // HTML
            "custom-element": React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

export default function App() {
    return <div className="container">
        <custom-element style={{
            display: "block",
            padding: "10px",
        }}>
            <div id="draggable" slot="custom-element" style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#e79627",
            }}></div>
        </custom-element>
        <Moveable
            target={"#draggable"}
            draggable={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}

