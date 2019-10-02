## 🚀 How to use Groupable
* **Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.

* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)
* **draggable**
    * [onDragGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupStart)
    * [onDragGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroup)
    * [onDragGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupEnd)
* **resizable**
    * [onResizeGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupStart)
    * [onResizeGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroup)
    * [onResizeGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupEnd)
* **scalable**
    * [onScaleGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupStart)
    * [onScaleGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroup)
    * [onScaleGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rscaleGroupEnd)
* **rotatable**
    * [onRotateGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupStart)
    * [onRotateGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroup)
    * [onRotateGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupEnd)
* **pinchable**
    * [onPinchGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroupStart)
    * [onPinchGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroup)
    * [onPinchGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroupEnd)


```tsx
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    // If the container is null, the position is fixed. (default: parentElement(document.body))
    container: document.body,
    draggable: true,
    resizable: true,
    scalable: true,
    rotatable: true,
    warpable: true,
    // Enabling pinchable lets you use events that
    // can be used in draggable, resizable, scalable, and rotateable.
    pinchable: true, // ["resizable", "scalable", "rotatable"]
    origin: true,
    keepRatio: true,
    // Resize, Scale Events at edges.
    edge: false,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
});

/* draggable */
moveable.on("draGroupStart", ({ targets }) => {
    console.log("onDragGroupStart", targets);
}).on("dragGroup", ({ targets, events }) => {
    console.log("onDragGroup", targets);

    events.forEach(ev => {
        // drag event
        console.log("onDrag left, top", ev.left, ev.top);
        // ev.target!.style.left = `${ev.left}px`;
        // ev.target!.style.top = `${ev.top}px`;
        console.log("onDrag translate", ev.dist);
        ev.target!.style.transform = ev.transform;)
    });
}).on("dragGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onDragGroupEnd", targets, isDrag);
});

/* resizable */
moveable.on("resizeGroupStart", ({ target, clientX, clientY }) => {
    console.log("onResizeGroupStart", target);
}).on("resizeGroup", ({ targets, events, direction }) => {
    console.log("onResizeGroup", targets);

    events.forEach(ev => {
        const offset = [
            direction[0] < 0 ? -ev.delta[0] : 0,
            direction[1] < 0 ? -ev.delta[1] : 0,
        ];
        // ev.drag is a drag event that occurs when the group resize.
        const left = offset[0] + ev.drag.beforeDist[0];
        const top = offset[1] + ev.drag.beforeDist[1];
        const width = ev.width;
        const top = ev.top;
    });
}).on("resizeGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onResizeGroupEnd", targets, isDrag);
});

/* scalable */
moveable.on("scaleGroupStart", ({ targets, clientX, clientY }) => {
    console.log("onScaleGroupStart", targets);
}).on("scaleGroup", (({ targets, events }) => {
    console.log("onScaleGroup", targets);

    events.forEach(ev => {
        const target = ev.target;
        // ev.drag is a drag event that occurs when the group scale.
        const left = ev.drag.beforeDist[0];
        const top = ev.drag.beforeDist[1];
        const scaleX = ev.scale[0];
        const scaleY = ev.scale[1];
    });
}).on("scaleGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onScaleGroupEnd", targets, isDrag);
});

/* rotatable */
moveable.on("rotateGroupStart", ({ targets, clientX, clientY }) => {
    console.log("onRotateGroupStart", targets);
}).on("rotateGroup", ({
    targets,
    events
    delta, dist,
}) => {
    e.events.forEach(ev => {
        const target = ev.target;
        // ev.drag is a drag event that occurs when the group rotate.
        const left = ev.drag.beforeDist[0];
        const top = ev.drag.beforeDist[1];
        const deg = ev.beforeDist;
    });
}).on("rotateGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onRotateGroupEnd", targets, isDrag);
});

/* pinchable */
// Enabling pinchable lets you use events that
// can be used in draggable, resizable, scalable, and rotateable.
moveable.on("pinchGroupStart", ({ targets, clientX, clientY }) => {
    // pinchGroupStart event occur before dragGroupStart, rotateGroupStart, scaleGroupStart, resizeGroupStart
    console.log("onPinchGroupStart", targets);
}).on("pinchGroup", ({ targets, clientX, clientY, datas }) => {
    // pinchGroup event occur before dragGroup, rotateGroup, scaleGroup, resizeGroup
    console.log("onPinchGroup", targets);
}).on("pinchGroupEnd", ({ isDrag, targets, clientX, clientY, datas }) => {
    // pinchGroupEnd event occur before dragGroupEnd, rotateGroupEnd, scaleGroupEnd, resizeGroupEnd
    console.log("onPinchGroupEnd", targets);
});


```
