import Moveable, { OnDrag, OnScale, OnRotate, OnResize } from "../../src/";
import { codes } from "./consts";
import "./index.css";

declare const hljs: any;

const moveableElement: HTMLElement = document.querySelector(".moveable");
const moveable = new Moveable(moveableElement.parentElement, {
    target: moveableElement,
    container: moveableElement.parentElement,
    origin: false,
    draggable: true,
    rotatable: true,
    scalable: true,
}).on("drag", ({ target, left, top }: OnDrag) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
}).on("scale", ({ target, transform}: OnScale) => {
    target.style.transform = transform;
}).on("rotate", ({ target, transform }: OnRotate) => {
    target.style.transform = transform;
}).on("resize", ({ target, width, height }: OnResize) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
});

const draggableElement: HTMLElement = document.querySelector(".draggable");
const draggable = new Moveable(draggableElement.parentElement, {
    target: draggableElement,
    container: draggableElement.parentElement,
    origin: false,
    draggable: true,
}).on("drag", ({ target, transform }: OnDrag) => {
    target.style.transform = transform;
});

const resizableElement: HTMLElement = document.querySelector(".resizable");
const resizable = new Moveable(resizableElement.parentElement, {
    target: resizableElement,
    container: resizableElement.parentElement,
    origin: false,
    resizable: true,
}).on("resize", ({ target, width, height}: OnResize) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
});

const scalableElement: HTMLElement = document.querySelector(".scalable");
const scalable = new Moveable(scalableElement.parentElement, {
    target: scalableElement,
    container: scalableElement.parentElement,
    origin: false,
    scalable: true,
}).on("scale", ({ target, transform }: OnScale) => {
    target.style.transform = transform;
});

const rotatableElement: HTMLElement = document.querySelector(".rotatable");
const rotatable = new Moveable(rotatableElement.parentElement, {
    target: rotatableElement,
    container: rotatableElement.parentElement,
    origin: false,
    rotatable: true,
}).on("rotate", ({ target, transform }: OnRotate) => {
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
