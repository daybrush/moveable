import Moveable from "../../src/Moveable";
import { codes } from "./consts";
import "./Editor";
import "./index.css";
import "./editor.css";

declare const hljs: any;

const draggableElement: HTMLElement = document.querySelector(".draggable");
const draggable = new Moveable(draggableElement.parentElement, {
    target: draggableElement,
    origin: false,
    draggable: true,
}).on("drag", ({ target, transform }) => {
    target.style.transform = transform;
});

const resizableElement: HTMLElement = document.querySelector(".resizable");
const resizable = new Moveable(resizableElement.parentElement, {
    target: resizableElement,
    origin: false,
    resizable: true,
}).on("resize", ({ target, width, height }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
});

const scalableElement: HTMLElement = document.querySelector(".scalable");
const scalable = new Moveable(scalableElement.parentElement, {
    target: scalableElement,
    origin: false,
    scalable: true,
}).on("scale", ({ target, transform }) => {
    target.style.transform = transform;
});

const rotatableElement: HTMLElement = document.querySelector(".rotatable");
const rotatable = new Moveable(rotatableElement.parentElement, {
    target: rotatableElement,
    origin: false,
    rotatable: true,
}).on("rotate", ({ target, transform }) => {
    target.style.transform = transform;
});
const warpableElement: HTMLElement = document.querySelector(".warpable");
const warpable = new Moveable(warpableElement.parentElement, {
    target: warpableElement,
    warpable: true,
    origin: false,
}).on("warp", ({ target, transform }) => {
    target.style.transform = transform;
});

const originElement: HTMLElement = document.querySelector(".origin");
const origin = new Moveable(originElement.parentElement, {
    target: originElement,
    origin: true,
    draggable: true,
    rotatable: true,
}).on("drag", ({ target, left, top }) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
}).on("rotate", ({ target, transform }) => {
    target.style.transform = transform;
});

const pinchableElement: HTMLElement = document.querySelector(".pinchable");
const scale = [1, 1];
let rotate = 0;
const pinchable = new Moveable(pinchableElement.parentElement, {
    target: pinchableElement,
    pinchable: ["rotatable", "scalable"],
    origin: false,
}).on("rotate", ({ beforeDelta }) => {
    rotate += beforeDelta;

    pinchableElement.style.transform = `scale(${scale.join(", ")}) rotate(${rotate}deg)`;
}).on("scale", ({ delta }) => {
    scale[0] *= delta[0];
    scale[1] *= delta[1];

    pinchableElement.style.transform = `scale(${scale.join(", ")}) rotate(${rotate}deg)`;
});

const groupableElement: HTMLElement = document.querySelector(".groupable");
const poses = [
    [0, 0],
    [0, 0],
    [0, 0],
];

const groupable = new Moveable(groupableElement.parentElement, {
    target: [].slice.call(groupableElement.querySelectorAll("span")),
    origin: false,
    draggable: true,
}).on("dragGroup", ({ events }) => {
    events.forEach(({ target, beforeDelta }, i) => {
        poses[i][0] += beforeDelta[0];
        poses[i][1] += beforeDelta[1];

        target.style.transform = `translate(${poses[i][0]}px, ${poses[i][1]}px)`;
    });
});

window.addEventListener("resize", () => {
    // moveable.updateRect();
    draggable.updateRect();
    resizable.updateRect();
    scalable.updateRect();
    rotatable.updateRect();
    warpable.updateRect();
    pinchable.updateRect();
    groupable.updateRect();
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

    // if (able === "warpable") {
    //     moveable.resizable = false;
    //     moveable.scalable = false;
    //     moveable.warpable = true;
    // } else if (able === "scalable") {
    //     moveable.resizable = false;
    //     moveable.scalable = true;
    //     moveable.warpable = false;
    // } else if (able === "resizable") {
    //     moveable.resizable = true;
    //     moveable.scalable = false;
    //     moveable.warpable = false;
    // }
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
