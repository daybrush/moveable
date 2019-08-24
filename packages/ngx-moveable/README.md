

<p align="middle" ><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/logo.png"/></p>
<h2 align="middle">Angular Moveable</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/ngx-moveable" target="_blank"><img src="https://img.shields.io/npm/v/ngx-moveable.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/moveable/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/moveable.svg?style=flat-square&label=license&color=08CE5D"/></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/react-moveable" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/preact-moveable" target="_blank"><img alt="Preact" src="https://img.shields.io/static/v1.svg?label=&message=Preact&style=flat-square&color=673ab8"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/ngx-moveable" target="_blank"><img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38"></a>
<a href="https://github.com/probil/vue-moveable" target="_blank"><img
    alt="Vue"
    src="https://img.shields.io/static/v1.svg?label=&message=Vue&style=flat-square&color=3fb984"></a>
</p>
<p align="middle">An Angular Component that create Moveable, Draggable, Resizable, Scalable, Rotatable, Warpable, Pinchable, Groupable.</p>
<p align="middle">
  <a href="https://github.com/daybrush/moveable" target="_blank"><strong>About Moveable</strong></a> /
  <a href="https://daybrush.com/moveable/release/latest/doc/" target="_blank"><strong>API</strong></a> /
  <a href="https://github.com/daybrush/scenejs-timeline" target="_blank"><strong>Main Project</strong></a>
</p>
<p align="middle">
  <a href="https://codesandbox.io/s/ngx-moveable-demo-o6o5w" target="_blank"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" /></a>
</p>

<table width="100%" align="center">
<tr>
<th colspan="4">Moveable</th>
</tr>
<tr>
<td align="center"><strong>Draggable</strong></td>
<td align="center"><strong>Resizable</strong></td>
<td align="center"><strong>Scalable</strong></td>
<td align="center"><strong>Rotatable</strong></td>
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
<td align="center"><strong>Warpable</strong></td>
<td align="center"><strong>Pinchable</strong></td>
<td align="center"><a href="https://github.com/daybrush/moveable/blob/master/packages/ngx-moveable/groupable.md"><strong>Groupable</strong></a></td>
<td align="center"><strong></strong></td>
</tr>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/warpable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/pinchable.gif"></td>
<td align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/groupable.gif"></td>
<td align="center"><strong></strong></td>
</tr>
</table>

## 🔥 Features
* **Draggable** refers to the ability to drag and move targets.
* **Resizable** indicates whether the target's width and height can be increased or decreased.
* **Scalable** indicates whether the target's x and y can be scale of transform.
* **Rotatable** indicates whether the target can be rotated.
* **Warpable** indicates whether the target can be warped(distorted, bented).
* **Pinchable** indicates whether the target can be pinched with draggable, resizable, scalable, rotatable.
* **[Groupable](https://github.com/daybrush/moveable/blob/master/packages/ngx-moveable/groupable.md)** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.
* Support SVG Elements (svg, path, line, ellipse, g, rect, ...etc)
* Support 3d Transform

## ⚙️ Installation
```sh
$ npm i ngx-moveable
```

## 📄 Documents
* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)
* 🚀 [**How to use Groupable**](https://github.com/daybrush/moveable/blob/master/packages/ngx-moveable/groupable.md)
* ✨ [**How to use custom CSS**](https://github.com/daybrush/moveable/blob/master/custom_css.md)

## 🚀 How to use
```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxMoveableModule, NgxMoveableComponent } from '../ngx-moveable';

@NgModule({
  declarations: [
    AppComponent,
    NgxMoveableComponent,
  ],
  imports: [
    BrowserModule,
    // NgxMoveableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Template
```html
<ngx-moveable
  [target]="target"
  [origin]="true"
  [edge]="false"

  [draggable]="true"
  [throttleDrag]="0"
  (drgStart)="onDragStart($event)"
  (drag)="onDrag($event)"
  (dragEnd)="onDragEnd($event)"


  [keepRatio]="false"

  [resizable]="false"
  [throttleResize]="0"
  (resizeStart)="onResizeStart($event)"
  (resize)="onResize($event)"
  (resizeEnd)="onResizeEnd($event)"
  
  [scalable]="false"
  [throttleScale]="0"
  (scaleStart)="onScaleStart($event)"
  (scale)="onScale($event)"
  (sacleEnd)="onScaleEnd($event)"


  [rotatable]="false"
  [throttleRotate]="0"
  (rotateStart)="onRotateStart($event)"
  (rotate)="onRotate($event)"
  (rotateEnd)="onRotateEnd($event)"

  [warpable]="false"
  (warpStart)="onRotateStart($event)"
  (warp)="onRotate($event)"
  (warpEnd)="onRotateEnd($event)"

  [pinchable]="false"
  (pinchStart)="onPinchStart($event)"
  (pinch)="onPinch($event)"
  (pinchEnd)="onPinchEnd($event)"
/>
```


## ⚙️ Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.



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
