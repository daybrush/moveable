# Moveable Handbook

This document explains how to use [moveable](https://github.com/daybrush/moveable).

# Table of Contents
  * [API Documentation](https://daybrush.com/moveable/release/latest/doc/)
  * [Introduction](#toc-introduction)
  * [Basic Support](#toc-support)
  * [Ables](#toc-ables)
      * [Draggable](#toc-draggable)
      * [Resizable](#toc-resizable)
      * [Scalable](#toc-scalable)
      * [Rotatable](#toc-rotatable)
      * [Warpable](#toc-warpable)
      * [Pinchable](#toc-pinchable)
      * [Snappable(Guidelines & Boundaries)](#toc-snappable)
  * [How to use Group](#toc-group)
    * [Group with Draggable](#toc-group-draggable)
    * [Group with Resizable](#toc-group-resizable)
    * [Group with Scalable](#toc-group-scalable)
    * [Group with Rotatable](#toc-group-rotatable)
    * [Group with Pinchable](#toc-group-pinchable)
  * [How to use custom css](#toc-custom-css)


# <a id="toc-introduction"></a>Introduction

<p align="middle" ><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/logo.png"/></p>
<h2 align="middle">Moveable</h2>

Moveable makes the target draggable, resizable, scalable, warpable, rotatable, pinchable and snappable.

The reason for creating a moveable is to create an editor. Main Project is **[scenejs-editor](https://github.com/daybrush/scenejs-editor)**.


Another reason for this is the [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

If the transform overlaps from the root element to the parent element, the distance it moves is not equal to the amount actually moved. So I made it to calculate the distance actually moved.


# <a id="toc-support"></a>Basic Support

* Support Webkit Safari(Mac, iOS)
* Support SVG Elements (Not Support Resizable, Use scaldable instead of resizable.)
* Support 3d Transform
* [Support Group](#toc-group)


If you have any questions or requests or want to contribute to `moveable` or other packages, please write the [issue](https://github.com/daybrush/moveable/issues) or give me a Pull Request freely.


# <a id="toc-ables"></a>Ables
You can Drag, Resize, Scale, Rotate, Warp, Pinch, Snap.

* [Draggable](#toc-draggable)
* [Resizable](#toc-resizable)
* [Scalable](#toc-scalable)
* [Rotatable](#toc-rotatable)
* [Warpable](#toc-warpable)
* [Pinchable](#toc-pinchable)
* [Snappable(Guidelines)](#toc-snappable)

## <a id="toc-draggable"></a>Draggable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/draggable.gif"></a>


* **Draggable** refers to the ability to drag and move targets.



## <a id="toc-resizable"></a>Resizable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/resizable.gif"></a>


* **Resizable** indicates whether the target's width and height can be increased or decreased.

## <a id="toc-scalable"></a>Scalable
<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/scalable.gif"></a>

* **Scalable** indicates whether the target's x and y can be scale of transform.

## <a id="toc-rotatable"></a>Rotatable
<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/rotatable.gif"></a>


* **Rotatable** indicates whether the target can be rotated.

## <a id="toc-warpable"></a>Warpable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/warpable.gif"></a>


* **Warpable** indicates whether the target can be warped(distorted, bented).


## <a id="toc-pinchable"></a>Pinchable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/pinchable.gif"></a>

* **Pinchable** indicates whether the target can be pinched with draggable, resizable, scalable, rotatable.

## <a id="toc-snappable"></a>Snappable(Guidelines & Boundaries)

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/snappable.gif"></a>

* **Snappable** indicates whether to snap to the guidelines.

* **bounds**: You can set up boundaries.
* **snapThreshold**: Distance value that can snap to guidelines.
* **snapCenter**: When you drag, make the snap in the center of the target.

* verticalGuidelines & horizontalGuidelines

![](../demo/images/guidelines.png)

* elementGuidelines

![](../demo/images/element_guidelines.png)


### Example

```ts
const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    snappable: true,
    snapThreshold: 5,
    bounds: { left: 0, top: 0, bottom: 1000, right: 1000 },
    verticalGuidelines: [100, 200, 300],
    horizontalGuidelines: [0, 100, 200],
    elementGuidelines: [document.querySelector(".element")],
});
```




# <a id="toc-group"></a> How to use Group

**Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.

If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).

When using group, event name changes. (ex: dragStart => dragGroupStart, pinchStart => pinchGroupStart)

The drag event always occurs with the group event.(Resizable, Scalable, Rotatable)

In a group, Pinchable and Snappable are the same as they used to be. But warpable is not available.

## How to use Group with ables
* [**draggable**](#toc-group-draggable)
* [**resizable**](#toc-group-resizable)
* [**scalable**](#toc-group-scalable)
* [**rotatable**](#toc-group-rotatable)

## <a id="toc-group-draggable"></a>Group with Draggable
* [onDragGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupStart)
* [onDragGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroup)
* [onDragGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupEnd)


```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    draggable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
}));
moveable.on("draGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];
        ev.set(frame.translate);
    });
}).on("dragGroup", ({ targets, events }) => {
    events.forEach(({ target, beforeTranslate }, i) => {
        const frame = frames[i];

        frame.translate = beforeTranslate;
        target.style.transform
            = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    });
}).on("dragGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onDragGroupEnd", targets, isDrag);
});
```

## <a id="toc-group-resizable"></a>Group with Resizable
* [onReiszeGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupStart)
* [onResizeGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroup)
* [onResizeGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupEnd)

```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    resizable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
}));
moveable.on("resizeGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];

        // Set origin if transform-orgin use %.
        ev.setOrigin(["%", "%"]);

        // If cssSize and offsetSize are different, set cssSize.
        const style = window.getComputedStyle(ev.target);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        ev.set([cssWidth, cssHeight]);

        // If a drag event has already occurred, there is no dragStart.
        ev.dragStart && ev.dragStart.set(frame.translate);
    });
}).on("resizeGroup", ({ events }) => {
    events.forEach(({ target, width, height, drag }, i) => {
        const frame = frames[i];

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        // get drag event
        frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
    });
}).on("resizeGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onResizeGroupEnd", targets, isDrag);
});
```

## <a id="toc-group-scalable"></a>Group with Scalable
* [onScaleGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupStart)
* [onScaleGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroup)
* [onScaleGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupEnd)

## <a id="toc-group-rotatable"></a>Group with Rotatable
* [onScaleGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupStart)
* [onScaleGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroup)
* [onScaleGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupEnd)


# <a id="toc-custom-css"></a>✨ How to use custom CSS

If you want to custom CSS, use **`!important`**.

```css
.moveable-control {
    width: 20px!important;
    height: 20px!important;
    margin-top: -10px!important;
    margin-left: -10px!important;
}
```

## moveable-line

```css
.moveable-line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
}
```

![](../demo/images/line.png)


```css
.moveable-line.moveable-rotation-line {
    height: 40px;
    width: 1px;
    transform-origin: 0.5px 39.5px;
}
```
## moveable-control

```css
.moveable-control {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-sizing: border-box;
    background: #4af;
    margin-top: -7px;
    margin-left: -7px;
    z-index: 10;
}
```

![](../demo/images/control.png)

## moveable-rotataion

```css
/* moveable-rotation */
.moveable-line.moveable-rotation-line .moveable-control {
    border-color: #4af;
    background:#fff;
    cursor: alias;
}
```

## moveable-origin
```css
.moveable-control.moveable-origin {
    border-color: #f55;
    background: #fff;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    margin-left: -6px;
    pointer-events: none;
}
```

## moveable-direction

```css
.moveable-direction.moveable-e, .moveable-direction.moveable-w {
    cursor: ew-resize;
}
.moveable-direction.moveable-s, .moveable-direction.moveable-n {
    cursor: ns-resize;
}
.moveable-direction.moveable-nw, .moveable-direction.moveable-se, .moveable-reverse .moveable-direction.moveable-ne, .moveable-reverse .moveable-direction.moveable-sw {
    cursor: nwse-resize;
}
.moveable-direction.moveable-ne, .moveable-direction.moveable-sw, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-nw, moveable-reverse .moveable-direction.moveable-se {
    cursor: nesw-resize;
}
```


## Default CSS

```css
.moveable-control-box {
	position: fixed;
	width: 0;
	height: 0;
	left: 0;
	top: 0;
	z-index: 3000;
}
.moveable-control-box .moveable-control-box{
    z-index: 0;
}
.moveable-control-box .moveable-line,
.moveable-control-box .moveable-control{
	left: 0;
	top: 0;
}
.moveable-control-box .moveable-control{
	position: absolute;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 2px solid #fff;
	box-sizing: border-box;
	background: #4af;
	margin-top: -7px;
    margin-left: -7px;
    z-index: 10;
}
.moveable-control-box .moveable-line{
	position: absolute;
	width: 1px;
	height: 1px;
	background: #4af;
	transform-origin: 0px 0.5px;
}
.moveable-control-box .moveable-line.moveable-rotation-line{
	height: 40px;
	width: 1px;
	transform-origin: 0.5px 39.5px;
}
.moveable-control-box .moveable-line.moveable-rotation-line .moveable-control{
	border-color: #4af;
	background:#fff;
	cursor: alias;
}
.moveable-control-box .moveable-line.moveable-vertical.moveable-bold{
    width: 2px;
    margin-left: -1px;
}
.moveable-control-box .moveable-line.moveable-horizontal.moveable-bold{
    height: 2px;
    margin-top: -1px;
}
.moveable-control-box .moveable-control.moveable-origin{
	border-color: #f55;
	background: #fff;
	width: 12px;
	height: 12px;
	margin-top: -6px;
	margin-left: -6px;
	pointer-events: none;
}
.moveable-control-box .moveable-direction.moveable-e,
.moveable-control-box .moveable-direction.moveable-w{
	cursor: ew-resize;
}
.moveable-control-box .moveable-direction.moveable-s,
.moveable-control-box .moveable-direction.moveable-n{
	cursor: ns-resize;
}
.moveable-control-box .moveable-direction.moveable-nw,
.moveable-control-box .moveable-direction.moveable-se, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-ne, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-sw{
	cursor: nwse-resize;
}
.moveable-control-box .moveable-direction.moveable-ne,
.moveable-control-box .moveable-direction.moveable-sw, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-nw, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-se{
	cursor: nesw-resize;
}
.moveable-control-box .moveable-group{
    z-index: -1;
}
.moveable-control-box .moveable-area{
    position: absolute;
}
.moveable-control-box .moveable-area.moveable-avoid,
.moveable-control-box .moveable-area.moveable-avoid:before,
.moveable-control-box .moveable-area.moveable-avoid:after{
    transform-origin: 50% calc(100% + 20px);
}
.moveable-control-box .moveable-area.moveable-avoid:before,
.moveable-control-box .moveable-area.moveable-avoid:after{
    content: "";
    top: 0px;
    left: 0px;
    position: absolute;
    width: 100%;
    height: 100%;
}
.moveable-control-box .moveable-area.moveable-avoid:before{
    transform: rotate(120deg);
}
.moveable-control-box .moveable-area.moveable-avoid:after{
    transform: rotate(-120deg);
}


```
