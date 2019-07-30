import Moveable from "../../src/Moveable";
import { codes } from "./consts";
import { Frame } from "scenejs";
import "./index.css";
import { hasClass } from "@daybrush/utils";

declare const hljs: any;

const moveableElement: HTMLElement = document.querySelector(".moveable");
const labelElement: HTMLElement = document.querySelector(".label");

const frame = new Frame({
    width: "250px",
    height: "200px",
    left: "0px",
    top: "0px",
    transform: {
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
        matrix3d: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
    },
});

function setTransform(target: HTMLElement | SVGElement) {
    target.style.cssText = frame.toCSS();
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
    throttleResize: 1,
}).on("drag", ({ target, left, top, clientX, clientY }) => {
    frame.set("left", `${left}px`);
    frame.set("top", `${top}px`);
    setTransform(target);
    setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
}).on("scale", ({ target, dist, clientX, clientY }) => {
    const scaleX = frame.get("transform", "scaleX") * dist[0];
    const scaleY = frame.get("transform", "scaleY") * dist[1];
    frame.set("transform", "scaleX", scaleX);
    frame.set("transform", "scaleY", scaleY);
    setTransform(target);
    setLabel(clientX, clientY, `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`);
}).on("rotate", ({ target, beforeDelta, clientX, clientY }) => {
    const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;

    frame.set("transform", "rotate", `${deg}deg`);
    setTransform(target);
    setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`);
}).on("resize", ({ target, width, height, clientX, clientY }) => {
    frame.set("width", `${width}px`);
    frame.set("height", `${height}px`);
    setTransform(target);
    setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
}).on("warp", ({ target, multiply, delta, clientX, clientY }) => {
    frame.set("transform", "matrix3d", multiply(frame.get("transform", "matrix3d"), delta));
    setTransform(target);
    setLabel(clientX, clientY, `X: ${clientX}px<br/>Y: ${clientY}px`);
}).on("dragEnd", () => {
    labelElement.style.display = "none";
}).on("scaleEnd", () => {
    labelElement.style.display = "none";
}).on("rotateEnd", () => {
    labelElement.style.display = "none";
}).on("resizeEnd", () => {
    labelElement.style.display = "none";
}).on("warpEnd", () => {
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
}).on("resize", ({ target, width, height }) => {
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
const warpableElement: HTMLElement = document.querySelector(".warpable");
const warpable = new Moveable(warpableElement.parentElement, {
    target: warpableElement,
    container: warpableElement.parentElement,
    warpable: true,
    origin: false,
}).on("warp", ({ target, transform }) => {
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
    warpable.updateRect();
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

const ableElement = document.querySelector(".buttons.able");
const ableButtonElements = [].slice.call(ableElement.children);

ableElement.addEventListener("click", e => {
    const target = (e.target as HTMLElement);
    const able = target.getAttribute("data-able");

    if (!able) {
        return;
    }
    ableButtonElements.forEach((el: HTMLElement) => {
        el.classList.remove("selected");
    });
    target.classList.add("selected");

    if (able === "warpable") {
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.warpable = true;
    } else if (able === "scalable") {
        moveable.resizable = false;
        moveable.scalable = true;
        moveable.warpable = false;
    } else if (able === "resizable") {
        moveable.resizable = true;
        moveable.scalable = false;
        moveable.warpable = false;
    }
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
