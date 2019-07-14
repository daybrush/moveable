
<p align="middle" ><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/logo.png"/></p>
<h2 align="middle">Moveable</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/moveable" target="_blank"><img src="https://img.shields.io/npm/v/moveable.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/moveable/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/moveable.svg?style=flat-square&label=license&color=08CE5D"/></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/react-moveable" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/preact-moveable" target="_blank"><img alt="Preact" src="https://img.shields.io/static/v1.svg?label=&message=Preact&style=flat-square&color=673ab8"></a>
</p>
<p align="middle">Moveable is Draggable, Resizable, Scalable, Rotatable</p>
<p align="middle">
    <a href="https://daybrush.com/moveable"><strong>Demo</strong></a> /
    <a href="https://github.com/daybrush/moveable/tree/master/packages/react-moveable"><strong>React Moveable</strong></a> /
    <a href="https://github.com/daybrush/moveable/tree/master/packages/preact-moveable"><strong>Preact Moveable</strong></a>
</p>

<table width="100%" align="center">
<tr>
<th colspan="4">Moveable</th>
</tr>
<tr>
<th>Draggable</th>
<th>Resizable</th>
<th>Scalable</th>
<th>Rotatable</th>
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
</table>

## ⚙️ Installation
### npm
```sh
$ npm i moveable
```

### scripts
```html
<script src="//daybrush.com/moveable/release/latest/dist/moveable.min.js"></script>
```


## 📄 Documents
* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)

## 🚀 How to use
```ts
import Moveable, {
    OnDragStart
    OnDrag,
    OnDragEnd,
    OnResizableStart
    OnResizable,
    OnResizableEnd,
    OnScaleStart
    OnScale,
    OnScaleEnd,
    OnRotateStart
    OnRotate,
    OnRotateEnd,
} from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    container: null,
    draggable: true,
    resizable: true,
    scalable: true,
    rotatable: true,
    origin: true,
}).on("dragStart", ({ target }: OnDragStart) => {
    console.log("onDragStart", target);
}).on("drag", ({
    target,
    beforeDelta, beforeDist,
    left, top,
    right, bottom,
    delta, dist,
    transform,
}: OnDrag) => {
    console.log("onDrag left, top", left, top);
    // target!.style.left = `${left}px`;
    // target!.style.top = `${top}px`;
    console.log("onDrag translate", dist);
    target!.style.transform = transform;
}).on("dragEnd", ({ target, isDrag }: OnDragEnd) => {
    console.log("onDragEnd", target, isDrag);
}).on("resizeStart", ({ target }: OnResizeStart) => {
    console.log("onResizeStart", target);
}).on("resize", ({ target, width, height, dist, delta }: OnResize) => {
    console.log("onResize", target);
    delta[0] && (target!.style.width = `${width}px`);
    delta[1] && (target!.style.height = `${height}px`);
}).on("resizeEnd", ({ target, isDrag }: OnResizeEnd) => {
    console.log("onResizeEnd", target, isDrag);
}).on("scaleStart", ({ target }: OnScalableStart) => {
    console.log("onScaleStart", target);
}).on("scale", ({
    target, scale, dist, delta, transform,
}: OnScale) => {
    console.log("onScale scale", scale);
    target!.style.transform = transform;
}).on("scaleEnd", ({ target, isDrag }: OnScaleEnd) => {
    console.log("onScaleEnd", target, isDrag);
}).on("rotateStart", ({ target }: OnRotateStart) => {
    console.log("onRotateStart", target);
}).on("rotate", ({ target, delta, dist, transform }: onRotate) => {
    console.log("onRotate", dist);
    target!.style.transform = transform;
}).on("rotateEnd", ({ target, isDrag }: OnRotateEnd) => {
    console.log("onRotateEnd", target, isDrag);
});
```


## 📦 Packages
* [**react-moveable**](https://github.com/daybrush/moveable/blob/master/packages/react-moveable): A React Component that create Moveable, Draggable, Resizable, Scalable, Rotatable.
* [**preact-moveable**](https://github.com/daybrush/moveable/blob/master/packages/preact-moveable): A Preact Component that create Moveable, Draggable, Resizable, Scalable, Rotatable.




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
