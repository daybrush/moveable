import { Frame } from "scenejs";
import Moveable from "../../src/Moveable";
import Dragger from "@daybrush/drag";
import KeyContoller from "keycon";

const labelElement: HTMLElement = document.querySelector(".label");
const controlsElement: HTMLElement = document.querySelector(".controls");
const rulersElement = document.querySelector(".rulers");
const guidelinesElement = document.querySelector(".guidelines");
const horizontalRulerElement = rulersElement.querySelector(".ruler.horizontal");
const verticalRulerElement = rulersElement.querySelector(".ruler.vertical");
const horizontalDivisionsElement = horizontalRulerElement.querySelector(".divisions");
const verticalDivisionsElement = document.querySelector(".ruler.vertical .divisions");

const divisions = [];
for (let i = 0; i <= 1000; ++i) {
    divisions.push(`<div class="division" data-px="${i * 5}"></div>`);
}
horizontalDivisionsElement.innerHTML = divisions.join("");
verticalDivisionsElement.innerHTML = divisions.join("");

const frame = new Frame({
    left: "calc(50% - 125px)",
    top: "calc(50% - 250px)",
    width: "250px",
    height: "200px",
    transform: {
        translateX: "0px",
        translateY: "0px",
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
    },
});
const moveableTarget: HTMLElement = document.querySelector(".moveable.target");
const moveable = new Moveable(document.body, {
    target: moveableTarget,
    draggable: true,
    resizable: true,
    rotatable: true,
    snappable: true,
    snapCenter: true,
    snapThreshold: 10,
    throttleResize: 0,
    throttleRotate: 1,
    keepRatio: false,
    origin: false,
    bounds: {
        left: 30,
        top: 30,
    },
}).on("dragStart", ({ set }) => {
    set([
        parseFloat(frame.get("transform", "translateX")),
        parseFloat(frame.get("transform", "translateY")),
    ]);
}).on("drag", ({ target, beforeTranslate }) => {
    frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
    frame.set("transform", "translateY", `${beforeTranslate[1]}px`);

    target.style.cssText += frame.toCSS();
}).on("rotateStart", ({ set }) => {
    set(parseFloat(frame.get("transform", "rotate")));
}).on("rotate", ({ target, beforeRotate, clientX, clientY }) => {
    frame.set("transform", "rotate", `${beforeRotate}deg`);
    target.style.cssText += frame.toCSS();
    setLabel(clientX, clientY, `${beforeRotate}°`);
}).on("resizeStart", ({ setOrigin, dragStart }) => {
    setOrigin(["%", "%"]);

    dragStart && dragStart.set([
        parseFloat(frame.get("transform", "translateX")),
        parseFloat(frame.get("transform", "translateY")),
    ]);

}).on("resize", ({ target, width, height, drag, clientX, clientY }) => {
    frame.set("width", `${width}px`);
    frame.set("height", `${height}px`);
    frame.set("transform", "translateX", `${drag.beforeTranslate[0]}px`);
    frame.set("transform", "translateY", `${drag.beforeTranslate[1]}px`);
    target.style.cssText += frame.toCSS();

    setLabel(clientX, clientY, `${width} X ${height}`);
}).on("rotateEnd", () => {
    hideLabel();
}).on("resizeEnd", () => {
    hideLabel();
});
function setLabel(clientX: number, clientY: number, text: string) {
    // tslint:disable-next-line: max-line-length

    labelElement.style.cssText = `
    display: block; transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%);`;

    labelElement.innerHTML = text;
}
function hideLabel() {
    labelElement.style.display = "none";
}
function snap(poses, targetPos) {
    let nextPos = targetPos;
    let snapDist = Infinity;

    poses.forEach(pos => {
        const dist = Math.abs(pos - targetPos);
        if (dist > 10) {
            return;
        }
        if (snapDist > dist) {
            snapDist = dist;
            nextPos = pos;
        }
    });

    return nextPos;
}
function dragStartGuideline({ datas, clientX, clientY }) {
    const rect = moveableTarget.getBoundingClientRect();
    const type = datas.type;
    const guideline = datas.guideline;

    datas.verticalPoses = [rect.left, rect.left + rect.width];
    datas.horizontalPoses = [rect.top, rect.top + rect.height];
    datas.isHorizontal = type === "horizontal";

    guideline.classList.add("dragging");

    dragGuideline({ datas, clientX, clientY });
}

function dragGuideline({ clientX, clientY, datas }) {
    const { guideline, isHorizontal } = datas;
    const style = guideline.style;

    if (isHorizontal) {
        const nextPos = snap(datas.horizontalPoses, clientY);

        style.top = `${nextPos}px`;

        return nextPos;
    } else {
        const nextPos = snap(datas.verticalPoses, clientX);

        style.left = `${nextPos}px`;

        return nextPos;
    }
}

function dragEndGuideline({ datas, clientX, clientY }) {
    const el = datas.guideline;
    const isHorizontal = datas.isHorizontal;
    const clientPos = dragGuideline({ datas, clientX, clientY });

    if (clientPos < (isHorizontal ? 30 + controlsElement.offsetHeight : 30)) {
        guidelinesElement.removeChild(el);
        return;
    }
    el.setAttribute("data-position", clientPos);

    const horizontalGuidelines = [];
    const verticalGuidelines = [];
    [].slice.call(guidelinesElement.children).forEach(guideline => {
        const type = guideline.getAttribute("data-type");
        const pos = parseFloat(guideline.getAttribute("data-position"));
        (type === "horizontal" ? horizontalGuidelines : verticalGuidelines).push(pos);
    });
    el.classList.remove("dragging");
    moveable.verticalGuidelines = verticalGuidelines;
    moveable.horizontalGuidelines = horizontalGuidelines;
}
new Dragger(guidelinesElement, {
    container: document.body,
    dragstart: ({ inputEvent, datas, clientX, clientY }) => {
        const guideline = inputEvent.target;

        if (guideline.classList.contains("horizontal")) {
            datas.type = "horizontal";
        } else if (guideline.classList.contains("vertical")) {
            datas.type = "vertical";
        } else {
            return false;
        }
        datas.guideline = guideline;

        dragStartGuideline({ datas, clientX, clientY });
    },
    drag: dragGuideline,
    dragend: dragEndGuideline,
});

new Dragger(rulersElement, {
    container: document.body,
    dragstart: ({ inputEvent, datas, clientX, clientY }) => {
        const ruler = inputEvent.target;

        if (ruler === horizontalRulerElement) {
            datas.type = "horizontal";
        } else if (ruler === verticalRulerElement) {
            datas.type = "vertical";
        } else {
            return false;
        }
        const el = document.createElement("div");
        const type = datas.type;

        el.className = `guideline ${type}`;
        el.setAttribute("data-type", type);

        datas.guideline = el;

        dragStartGuideline({ datas, clientX, clientY });
        guidelinesElement.appendChild(el);
    },
    drag: dragGuideline,
    dragend: dragEndGuideline,
});

function toggleShift(shiftKey) {
    if (shiftKey) {
        moveable.throttleRotate = 30;
        moveable.keepRatio = true;
    } else {
        moveable.throttleRotate = 1;
        moveable.keepRatio = false;
    }
}
KeyContoller.global.on("keydown", ({ shiftKey }) => {
    toggleShift(shiftKey);
}).on("keyup", ({ shiftKey }) => {
    toggleShift(shiftKey);
});

window.addEventListener("resize", () => {
    moveable.updateRect();
});
