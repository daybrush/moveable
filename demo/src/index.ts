import Moveable from "../../src/Moveable";
import { codes } from "./consts";
import "./index.css";

declare const hljs: any;

const moveableElement: HTMLElement = document.querySelector(".moveable");
const labelElement: HTMLElement = document.querySelector(".label");

let rotate: number = 0;
const translate = [0, 0];
const scale = [1, 1];

function setTransform(target: HTMLElement | SVGElement) {
    target.style.transform
        = `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg) scale(${scale[0]}, ${scale[1]})`;
}
function setLabel(clientX: number, clientY: number, text) {
    // tslint:disable-next-line: max-line-length
    labelElement.style.cssText = `display: block; transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%);`;
    labelElement.innerHTML = text;
}
const moveable = new Moveable(moveableElement.parentElement, {
    target: moveableElement,
    container: moveableElement.parentElement,
    origin: false,
    draggable: true,
    rotatable: true,
    scalable: true,
    keepRatio: false,
    throttleDrag: 1,
    throttleScale: 0.01,
    throttleRotate: 0.2,
}).on("drag", ({ target, left, top, clientX, clientY }) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
}).on("scale", ({ target, dist, clientX, clientY }) => {
    scale[0] *= dist[0];
    scale[1] *= dist[1];
    setTransform(target);
    setLabel(clientX, clientY, `S: ${scale[0].toFixed(2)}, ${scale[1].toFixed(2)}`);
}).on("rotate", ({ target, beforeDelta, clientX, clientY }) => {
    rotate += beforeDelta;
    setTransform(target);
    setLabel(clientX, clientY, `R: ${rotate.toFixed(1)}`);
}).on("resize", ({ target, width, height }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
}).on("dragEnd", () => {
    labelElement.style.display = "none";
}).on("scaleEnd", () => {
    labelElement.style.display = "none";
}).on("rotateEnd", () => {
    labelElement.style.display = "none";
});

const draggableElement: HTMLElement = document.querySelector(".draggable");
const draggable = new Moveable(draggableElement.parentElement, {
    target: draggableElement,
    container: draggableElement.parentElement,
    origin: false,
    draggable: true,
}).on("drag", ({ target, transform }) => {
    target.style.transform = transform;
});

const resizableElement: HTMLElement = document.querySelector(".resizable");
const resizable = new Moveable(resizableElement.parentElement, {
    target: resizableElement,
    container: resizableElement.parentElement,
    origin: false,
    resizable: true,
}).on("resize", ({ target, width, height}) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
});

const scalableElement: HTMLElement = document.querySelector(".scalable");
const scalable = new Moveable(scalableElement.parentElement, {
    target: scalableElement,
    container: scalableElement.parentElement,
    origin: false,
    scalable: true,
}).on("scale", ({ target, transform }) => {
    target.style.transform = transform;
});

const rotatableElement: HTMLElement = document.querySelector(".rotatable");
const rotatable = new Moveable(rotatableElement.parentElement, {
    target: rotatableElement,
    container: rotatableElement.parentElement,
    origin: false,
    rotatable: true,
}).on("rotate", ({ target, transform }) => {
    target.style.transform = transform;
});

const originElement: HTMLElement = document.querySelector(".origin");
const origin = new Moveable(originElement.parentElement, {
    target: originElement,
    container: originElement.parentElement,
    origin: true,
    draggable: true,
    rotatable: true,
}).on("drag", ({ target, left, top }) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
}).on("rotate", ({ target, transform }) => {
    target.style.transform = transform;
});

window.addEventListener("resize", () => {
    moveable.updateRect();
    draggable.updateRect();
    resizable.updateRect();
    scalable.updateRect();
    rotatable.updateRect();
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("pre").forEach((pre: HTMLElement) => {
        const group = pre.getAttribute("data-group");
        const panel = pre.getAttribute("data-panel");
        const block = pre.querySelector("code");

        let code = codes[group][panel === "preact" ? "react" : panel].trim();

        if (panel === "preact") {
            code = code.replace(/react/g, "preact");
        }
        block.innerText = code;
        hljs.highlightBlock(block);
    });
});

const tabGroups = {};

[].slice.call(document.querySelectorAll("[data-tab]")).forEach(tabElement => {
    const group = tabElement.getAttribute("data-group");
    const tab = tabElement.getAttribute("data-tab");
    const panelElement = document.querySelector(`[data-group="${group}"][data-panel="${tab}"]`);

    !tabGroups[group] && (tabGroups[group] = []);
    tabGroups[group].push([tabElement, panelElement]);

    tabElement.addEventListener("click", () => {
        tabGroups[group].forEach(([otherTabElement, otherPanelElement]) => {
            if (tabElement === otherTabElement) {
                return;
            }
            otherTabElement.classList.remove("selected");
            otherPanelElement.classList.remove("selected");
        });
        tabElement.classList.add("selected");
        panelElement.classList.add("selected");
    });
});
