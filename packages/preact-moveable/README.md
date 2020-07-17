

<p align="middle" ><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/logo.png"/></p>
<h2 align="middle">Preact Moveable</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/preact-moveable" target="_blank"><img src="https://img.shields.io/npm/v/preact-moveable.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://travis-ci.org/daybrush/moveable" target="_blank"><img alt="Travis (.org)" src="https://img.shields.io/travis/daybrush/moveable.svg?style=flat-square&label=build" /></a>
<a href="https://github.com/daybrush/moveable/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/moveable.svg?style=flat-square&label=license&color=08CE5D"/></a>
</p>
<p align="middle">A Preact Component that create Moveable, Draggable, Resizable, Scalable, Rotatable, Warpable, Pinchable, Groupable, Snappable.</p>
<p align="middle">
    <a href="https://daybrush.com/moveable" target="_blank"><strong>Demo</strong></a> /
    <a href="https://daybrush.com/moveable/storybook/" target="_blank"><strong>Storybook</strong></a> /
    <a href="https://daybrush.com/moveable/release/latest/doc/" target="_blank"><strong>API</strong></a> /
    <a href="https://github.com/daybrush/scena" target="_blank"><strong>Main Project</strong></a>
</p>
<p align="middle">
  <a href="https://codesandbox.io/s/preact-moveable-demo-s2ygu" target="_blank"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" /></a>
</p>

<table width="100%" align="center">
<tr>
<th colspan="4">Moveable</th>
</tr>
<tr>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--draggable"><strong>Draggable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--resizable"><strong>Resizable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--scalable"><strong>Scalable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--rotatable"><strong>Rotatable</strong></a></td>
</tr>
<tr>
<td align="center">
<img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/draggable.gif">
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/resizable.gif">
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/scalable.gif">
</td>
<td align="center">
<img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/rotatable.gif">
</td>
</tr>
<tr>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--warpable"><strong>Warpable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/release/latest/doc/Moveable.Pinchable.html"><strong>Pinchable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/group--draggable"><strong>Groupable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/use-snap-bounds-with-ables--snap-guidelines-elements"><strong>Snappable</strong></a></td>
</tr>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/warpable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/pinchable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/groupable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/snappable.gif"></td>
</tr>
<tr>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--clippable"><strong>Clippable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--roundable"><strong>Roundable</strong></a></td>
<td align="center"><a href="https://daybrush.com/moveable/storybook/index.html?path=/story/basic--origindraggable"><strong>OriginDraggable</strong></a></td>
<td align="center"><a href="https://github.com/daybrush/selecto"><strong>Selecto</strong></a></td>
</tr>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/clippable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/roundable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/origindraggable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/selecto.gif"></td>
</tr>
</table>


## 🔥 Features
* **Draggable** refers to the ability to drag and move targets.
* **Resizable** indicates whether the target's width and height can be increased or decreased.
* **Scalable** indicates whether the target's x and y can be scale of transform.
* **Rotatable** indicates whether the target can be rotated.
* **Warpable** indicates whether the target can be warped(distorted, bented).
* **Pinchable** indicates whether the target can be pinched with draggable, resizable, scalable, rotatable.
* **Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.
* **Snappable** indicates whether to snap to the guideline.
* **OriginDraggable*** indicates Whether to drag origin.
* **Clippable** indicates Whether to clip the target.
* **Roundable** indicates Whether to show and drag or double click border-radius.
* Support SVG Elements (svg, path, line, ellipse, g, rect, ...etc)
* Support Major Browsers
* Support 3d Transform

## ⚙️ Installation
```sh
$ npm i preact-moveable
```

## 📄 Documents

* [**Moveable Handbook**](https://github.com/daybrush/moveable/blob/master/handbook/handbook.md)
* [**How to use Group**](https://github.com/daybrush/moveable/blob/master/handbook/handbook.md#toc-group)
* [**How to use custom CSS**](https://github.com/daybrush/moveable/blob/master/handbook/handbook.md#toc-custom-css)
* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)

## 🚀 How to use
```tsx
import Moveable from "preact-moveable";

render() {
    return (
        <Moveable
            target={document.querySelector(".target")}
            container={null}
            origin={true}

            /* Resize, Scale event edges */
            edge={false}

            /* draggable */
            draggable={true}
            throttleDrag={0}
            onDragStart={({ target, clientX, clientY }) => {
                console.log("onDragStart", target);
            }}
            onDrag={({
                target,
                beforeDelta, beforeDist,
                left, top,
                right, bottom,
                delta, dist,
                transform,
                clientX, clientY,
            }: OnDrag) => {
                console.log("onDrag left, top", left, top);
                // target!.style.left = `${left}px`;
                // target!.style.top = `${top}px`;
                console.log("onDrag translate", dist);
                target!.style.transform = transform;
            }}
            onDragEnd={({ target, isDrag, clientX, clientY }) => {
                console.log("onDragEnd", target, isDrag);
            }}

            /* When resize or scale, keeps a ratio of the width, height. */
            keepRatio={true}

            /* resizable*/
            /* Only one of resizable, scalable, warpable can be used. */
            resizable={true}
            throttleResize={0}
            onResizeStart={({ target , clientX, clientY}) => {
                console.log("onResizeStart", target);
            }}
            onResize={({
                target, width, height,
                dist, delta,
                clientX, clientY,
            }: OnResize) => {
                console.log("onResize", target);
                delta[0] && (target!.style.width = `${width}px`);
                delta[1] && (target!.style.height = `${height}px`);
            }}
            onResizeEnd={({ target, isDrag, clientX, clientY }) => {
                console.log("onResizeEnd", target, isDrag);
            }}

            /* scalable */
            /* Only one of resizable, scalable, warpable can be used. */
            scalable={true}
            throttleScale={0}
            onScaleStart={({ target, clientX, clientY }) => {
                console.log("onScaleStart", target);
            }}
            onScale={({
                target, scale, dist, delta, transform,
                clientX, clientY,
            }: OnScale) => {
                console.log("onScale scale", scale);
                target!.style.transform = transform;
            }}
            onScaleEnd={({ target, isDrag, clientX, clientY }) => {
                console.log("onScaleEnd", target, isDrag);
            }}

            /* rotatable */
            rotatable={true}
            throttleRotate={0}
            onRotateStart={({ target, clientX, clientY }) => {
                console.log("onRotateStart", target);
            }}
            onRotate={({
                target,
                delta, dist,
                transform,
                clientX, clientY,
            }: onRotate) => {
                console.log("onRotate", dist);
                target!.style.transform = transform;
            }}
            onRotateEnd={({ target, isDrag, clientX, clientY }) => {
                console.log("onRotateEnd", target, isDrag);
            }}

            /* warpable */
            /* Only one of resizable, scalable, warpable can be used. */
            /*
            this.matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]
            */
            warpable={true}
            onWarpStart={({ target, clientX, clientY }) => {
                console.log("onWarpStart", target);
            }}
            onWarp={({
                target,
                clientX,
                clientY,
                delta,
                dist,
                multiply,
                transform,
            }) => {
                console.log("onWarp", target);
                // target.style.transform = transform;
                this.matrix = multiply(this.matrix, delta);
                target.style.transform = `matrix3d(${this.matrix.join(",")})`;
            }}
            onWarpEnd={({ target, isDrag, clientX, clientY }) => {
                console.log("onWarpEnd", target, isDrag);
            }}

            // Enabling pinchable lets you use events that
            // can be used in draggable, resizable, scalable, and rotateable.
            pinchable={true}
            onPinchStart={({ target, clientX, clientY, datas }) => {
                // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
                console.log("onPinchStart");
            }}
            onPinch={({ target, clientX, clientY, datas }) => {
                // pinch event occur before drag, rotate, scale, resize
                console.log("onPinch");
            }}
            onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
                // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
                console.log("onPinchEnd");
            }}
        />
    )
}

```

## ⚙️ Developments
### `npm start`

Runs the app in the development mode.<br>
Open `demo/index.html` file.



## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!


## 👏 Contributing

If you have any questions or requests or want to contribute to `moveable` or other packages, please write the [issue](https://github.com/daybrush/moveable/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/moveable/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/daybrush/moveable/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2019 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
