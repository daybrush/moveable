import { Frame } from "scenejs";
import Moveable from "../../src/Moveable";
import Dragger from "@daybrush/drag";
import agent from "@egjs/agent";
import KeyContoller from "keycon";
import { addClass, removeClass, hasClass } from "@daybrush/utils";

const uaInfo = agent();
const isMobile = uaInfo.isMobile || uaInfo.os.name.indexOf("ios") > -1 || uaInfo.browser.name.indexOf("safari") > -1;

isMobile && addClass(document.body, "mobile");
const editorElement: HTMLElement = document.querySelector(".editor");
const labelElement: HTMLElement = document.querySelector(".label");
const controlsElement: HTMLElement = document.querySelector(".controls");
const rulersElement = document.querySelector(".rulers");
const guidelinesElement = document.querySelector(".guidelines");
const horizontalRulerElement = rulersElement.querySelector(".ruler.horizontal");
const verticalRulerElement = rulersElement.querySelector(".ruler.vertical");
const horizontalDivisionsElement = horizontalRulerElement.querySelector(".divisions");
const verticalDivisionsElement = document.querySelector(".ruler.vertical .divisions");
const controlXElement: HTMLInputElement = document.querySelector(`.control input[name="x"]`);
const controlYElement: HTMLInputElement = document.querySelector(`.control input[name="y"]`);
const controlWElement: HTMLInputElement = document.querySelector(`.control input[name="w"]`);
const controlHElement: HTMLInputElement = document.querySelector(`.control input[name="h"]`);
const controlRElement: HTMLInputElement = document.querySelector(`.control input[name="r"]`);

const divisions = [];
for (let i = 0; i <= 500; ++i) {
    divisions.push(`<div class="division" data-px="${i * 5}"></div>`);
}
horizontalDivisionsElement.innerHTML = divisions.join("");
verticalDivisionsElement.innerHTML = divisions.join("");

const moveableTarget: HTMLElement = document.querySelector(".moveable.target");
const frame = new Frame({
    left: "0px",
    top: "0px",
    width: "250px",
    height: "200px",
    transform: {
        translateX: `${window.innerWidth / 2 - 125}px`,
        translateY: `${Math.max(700, window.innerHeight) / 2 - 250}px`,
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
    },
});

function addControlEvent(el: HTMLInputElement, callback: (value: any) => void) {
    function eventCallback() {
        callback(el.value);
        applyCSS();
        moveable.updateRect();
    }
    new KeyContoller(el).keyup("enter", eventCallback);
    el.addEventListener("blur", eventCallback);
}

function move(translate: number[]) {
    frame.set("transform", "translateX", `${translate[0]}px`);
    frame.set("transform", "translateY", `${translate[1]}px`);
    controlXElement.value = `${translate[0]}`;
    controlYElement.value = `${translate[1]}`;
}
function applyCSS() {
    moveableTarget.style.cssText += frame.toCSS();
}

addControlEvent(controlXElement, value => {
    frame.set("transform", "translateX", `${parseFloat(value)}px`);
});
addControlEvent(controlYElement, value => {
    frame.set("transform", "translateY", `${parseFloat(value)}px`);
});
addControlEvent(controlWElement, value => {
    frame.set("width", `${parseFloat(value)}px`);
});
addControlEvent(controlHElement, value => {
    frame.set("height", `${parseFloat(value)}px`);
});
addControlEvent(controlRElement, value => {
    frame.set("transform", "rotate", `${parseFloat(value)}deg`);
});

controlXElement.value = `${parseFloat(frame.get("transform", "translateX"))}`;
controlYElement.value = `${parseFloat(frame.get("transform", "translateY"))}`;
applyCSS();

let isPinchStart = false;

const moveable = new Moveable(editorElement, {
    target: moveableTarget,
    draggable: true,
    resizable: true,
    rotatable: true,
    snappable: true,
    pinchable: true,
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
}).on("drag", ({ beforeTranslate }) => {
    move(beforeTranslate);
}).on("rotateStart", ({ set }) => {
    set(parseFloat(frame.get("transform", "rotate")));
}).on("rotate", ({ beforeRotate, clientX, clientY, isPinch }) => {
    frame.set("transform", "rotate", `${beforeRotate}deg`);
    controlRElement.value = `${beforeRotate}°`;
    !isPinch && setLabel(clientX, clientY, `${beforeRotate}°`);
}).on("resizeStart", ({ setOrigin, dragStart }) => {
    setOrigin(["%", "%"]);
    dragStart && dragStart.set([
        parseFloat(frame.get("transform", "translateX")),
        parseFloat(frame.get("transform", "translateY")),
    ]);

}).on("resize", ({ width, height, drag, clientX, clientY , isPinch }) => {
    frame.set("width", `${width}px`);
    frame.set("height", `${height}px`);

    move(drag.beforeTranslate);
    controlWElement.value = `${width}`;
    controlHElement.value = `${height}`;
    !isPinch && setLabel(clientX, clientY, `${width} X ${height}`);
}).on("pinchStart", () => {
    isPinchStart = true;
}).on("pinch", ({ clientX, clientY }) => {
    setLabelCSS(clientX, clientY);
}).on("render", () => {
    if (isPinchStart) {
        labelElement.innerHTML
            = `W: ${parseFloat(frame.get("width"))}<br/>`
            + `H: ${parseFloat(frame.get("height"))}<br/>`
            + `R: ${parseFloat(frame.get("transform", "rotate"))}°`;
    }
    // no isPinch
    applyCSS();
}).on("renderEnd", () => {
    isPinchStart = false;
    hideLabel();
});
function setLabelCSS(clientX: number, clientY: number) {
    labelElement.style.cssText
        = `display: block; transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%);`;
}
function setLabel(clientX: number, clientY: number, text: string) {
    setLabelCSS(clientX, clientY);
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
    datas.offset = datas.isHorizontal ? controlsElement.offsetHeight - document.documentElement.scrollTop : 0;
    addClass(guideline, "dragging");

    dragGuideline({ datas, clientX, clientY });
}

function dragGuideline({ clientX, clientY, datas }) {
    const { guideline, isHorizontal, offset} = datas;
    const style = guideline.style;

    if (isHorizontal) {
        const nextPos = snap(datas.horizontalPoses, clientY) - offset;

        style.top = `${nextPos}px`;

        return nextPos;
    } else {
        const nextPos = snap(datas.verticalPoses, clientX) - offset;

        style.left = `${nextPos}px`;

        return nextPos - offset;
    }
}

function dragEndGuideline({ datas, clientX, clientY }) {
    const el = datas.guideline;
    const clientPos = dragGuideline({ datas, clientX, clientY });

    if (clientPos < 30) {
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
    removeClass(el, "dragging");
    moveable.verticalGuidelines = verticalGuidelines;
    moveable.horizontalGuidelines = horizontalGuidelines;
}
new Dragger(guidelinesElement, {
    container: document.body,
    dragstart: ({ inputEvent, datas, clientX, clientY }) => {
        const guideline = inputEvent.target;

        if (hasClass(guideline, "horizontal")) {
            datas.type = "horizontal";
        } else if (hasClass(guideline, "vertical")) {
            datas.type = "vertical";
        } else {
            return false;
        }
        datas.guideline = guideline;

        dragStartGuideline({ datas, clientX, clientY });
        inputEvent.stopPropagation();
        inputEvent.preventDefault();
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

        inputEvent.stopPropagation();
        inputEvent.preventDefault();
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

document.body.addEventListener("gesturestart", e => {
    e.preventDefault();
});
