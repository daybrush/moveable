import { Frame } from "scenejs";
import Moveable from "../../src/Moveable";
import Guides from "@scena/guides";
import agent from "@egjs/agent";
import KeyContoller from "keycon";
import { addClass } from "@daybrush/utils";

const uaInfo = agent();
const isMobile = uaInfo.isMobile || uaInfo.os.name.indexOf("ios") > -1 || uaInfo.browser.name.indexOf("safari") > -1;

isMobile && addClass(document.body, "mobile");
const editorElement: HTMLElement = document.querySelector(".editor .view");
const labelElement: HTMLElement = document.querySelector(".label");
const rulersElement = document.querySelector(".rulers");
const horizontalRulerElement: HTMLElement = rulersElement.querySelector(".ruler.horizontal");
const verticalRulerElement: HTMLElement = rulersElement.querySelector(".ruler.vertical");
const controlXElement: HTMLInputElement = document.querySelector(`.control input[name="x"]`);
const controlYElement: HTMLInputElement = document.querySelector(`.control input[name="y"]`);
const controlWElement: HTMLInputElement = document.querySelector(`.control input[name="w"]`);
const controlHElement: HTMLInputElement = document.querySelector(`.control input[name="h"]`);
const controlRElement: HTMLInputElement = document.querySelector(`.control input[name="r"]`);

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
    }
    new KeyContoller(el).keyup("enter", eventCallback);
    el.addEventListener("blur", eventCallback);
}

function move(translate: number[]) {
    frame.set("transform", "translateX", `${translate[0]}px`);
    frame.set("transform", "translateY", `${translate[1]}px`);

    setTimeout(() => {
        const rect = moveable.getRect();
        controlXElement.value = `${Math.round(rect.left * 10) / 10}`;
        controlYElement.value = `${Math.round(rect.top * 10) / 10}`;
    });
}
function applyCSS() {
    moveableTarget.style.cssText += frame.toCSS();
}

addControlEvent(controlXElement, value => {
    moveable.request("draggable", { x: parseFloat(value), isInstant: true });
});
addControlEvent(controlYElement, value => {
    moveable.request("draggable", { y: parseFloat(value), isInstant: true });
});
addControlEvent(controlWElement, value => {
    moveable.request("resizable", { offsetWidth: parseFloat(value), isInstant: true });
});
addControlEvent(controlHElement, value => {
    moveable.request("resizable", { offsetHeight: parseFloat(value), isInstant: true });
});
addControlEvent(controlRElement, value => {
    moveable.request("rotatable", {
        deltaRotate: parseFloat(value) - parseFloat(frame.get("transform", "rotate")),
        isInstant: true,
    });
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
        left: 0,
        top: 0,
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

const guides1 = new Guides(horizontalRulerElement, {
    type: "horizontal",
    setGuides: refreshGuidelines,
    backgroundColor: "#444444",
});
const guides2 = new Guides(verticalRulerElement, {
    type: "vertical",
    setGuides: refreshGuidelines,
    backgroundColor: "#444444",
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
function refreshGuidelines() {
    const centerX = window.innerWidth / 2 + 15;
    const centerY = window.innerHeight / 2;

    moveable.verticalGuidelines = [...guides2.getGuides(), centerX];
    moveable.horizontalGuidelines = [...guides1.getGuides(), centerY];
}
function toggleShift(shiftKey) {
    if (shiftKey) {
        moveable.throttleRotate = 30;
        moveable.throttleDragRotate = 45;
        moveable.keepRatio = true;
    } else {
        moveable.throttleRotate = 1;
        moveable.throttleDragRotate = 0;
        moveable.keepRatio = false;
    }
}
KeyContoller.global.on("keydown", ({ shiftKey }) => {
    toggleShift(shiftKey);
}).on("keyup", ({ shiftKey }) => {
    toggleShift(shiftKey);
});

window.addEventListener("resize", () => {
    refreshGuidelines();
    moveable.updateRect();
    guides1.resize();
    guides2.resize();
});

document.body.addEventListener("gesturestart", e => {
    e.preventDefault();
});
refreshGuidelines();
