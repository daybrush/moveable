import { Frame } from "scenejs";
import Moveable from "../../src/Moveable";
import Dragger from "@daybrush/drag";
import KeyContoller from "keycon";

const editor = document.querySelector(".editor");
const rulers = document.querySelector(".rulers");
const guidelines = document.querySelector(".guidelines");
const horizontalRuler = rulers.querySelector(".ruler.horizontal");
const verticalRuler = rulers.querySelector(".ruler.vertical");
const horizontalDivisions = horizontalRuler.querySelector(".divisions");
const verticalDivisions = document.querySelector(".ruler.vertical .divisions");

const divisions = [];
for (let i = 0; i < 1000; ++i) {
  divisions.push(`<div class="division" data-px="${(i + 1) * 5}"></div>`);
}
horizontalDivisions.innerHTML = divisions.join("");
verticalDivisions.innerHTML = divisions.join("");

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
  throttleResize: 1,
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
}).on("rotate", ({ target, beforeRotate }) => {
  frame.set("transform", "rotate", `${beforeRotate}deg`);
  target.style.cssText += frame.toCSS();
}).on("resizeStart", ({ target, setOrigin, dragStart }) => {
  setOrigin(["%", "%"]);
  dragStart && dragStart.set([
    parseFloat(frame.get("transform", "translateX")),
    parseFloat(frame.get("transform", "translateY")),
  ]);
}).on("resize", ({ target, width, height, drag }) => {
  frame.set("width", `${width}px`);
  frame.set("height", `${height}px`);
  frame.set("transform", "translateX", `${drag.beforeTranslate[0]}px`);
  frame.set("transform", "translateY", `${drag.beforeTranslate[1]}px`);
  target.style.cssText += frame.toCSS();
});

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
  const clientPos = dragGuideline({ datas, clientX, clientY });

  if (clientPos < 30) {
    guidelines.removeChild(el);
    return;
  }
  el.setAttribute("data-position", clientPos);

  const horizontalGuidelines = [];
  const verticalGuidelines = [];
  [].slice.call(guidelines.children).forEach(guideline => {
    const type = guideline.getAttribute("data-type");
    const pos = parseFloat(guideline.getAttribute("data-position"));
    (type === "horizontal" ? horizontalGuidelines : verticalGuidelines).push(pos);
  });
  el.classList.remove("dragging");
  moveable.verticalGuidelines = verticalGuidelines;
  moveable.horizontalGuidelines = horizontalGuidelines;
}
new Dragger(guidelines, {
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

new Dragger(rulers, {
  container: document.body,
  dragstart: ({ inputEvent, datas, clientX, clientY }) => {
    const ruler = inputEvent.target;

    if (ruler === horizontalRuler) {
      datas.type = "horizontal";
    } else if (ruler === verticalRuler) {
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
    guidelines.appendChild(el);
  },
  drag: dragGuideline,
  dragend: dragEndGuideline,
});

function toggleShift(shiftKey) {
  if (shiftKey) {
    moveable.throttleRotate = 30;
    moveable.keepRatio = true;
  } else {
    moveable.throttleRotate = 0;
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
