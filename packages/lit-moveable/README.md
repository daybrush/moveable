
<p align="middle" ><img src="https://daybrush.com/moveable/images/logo.png" /></p>
<h2 align="middle">Lit Moveable</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/lit-moveable" target="_blank"><img src="https://img.shields.io/npm/v/lit-moveable.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square"/>
<a href="https://github.com/daybrush/moveable/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/moveable.svg?style=flat-square&label=license&color=08CE5D"/></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/react-moveable" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/preact-moveable" target="_blank"><img alt="Preact" src="https://img.shields.io/static/v1.svg?label=&message=Preact&style=flat-square&color=673ab8"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/ngx-moveable" target="_blank"><img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/vue-moveable" target="_blank"><img
    alt="Vue"
    src="https://img.shields.io/static/v1.svg?label=&message=Vue&style=flat-square&color=3fb984"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/svelte-moveable" target="_blank"><img
    alt="Svelte"
    src="https://img.shields.io/static/v1.svg?label=&message=Svelte&style=flat-square&color=C82B38"></a>
<a href="https://github.com/daybrush/moveable/tree/master/packages/lit-moveable" target="_blank"><img
    alt="Lit"
    src="https://img.shields.io/static/v1.svg?label=&message=Lit&style=flat-square&color=4E8EE0"></a>
</p>
<p align="middle">Lit Component that create Moveable, Draggable, Resizable, Scalable, Rotatable, Warpable, Pinchable, Groupable.</p>

<p align="middle">
    <a href="https://daybrush.com/moveable" target="_blank"><strong>Demo</strong></a> /
    <a href="https://daybrush.com/moveable/release/latest/doc/" target="_blank"><strong>API</strong></a> /
    <a href="https://github.com/daybrush/scena" target="_blank"><strong>Main Project</strong></a>
</p>

## ⚙️ Installation
### npm
```bash
$ npm install lit-moveable
```

## 🚀 How to use
* The event name is prefixed with **lit** (`litDragStart`, `litDrag`).
* `draggable` property is prefixed with **lit** (`litMoveable`).
* `dragStart` method name is suffixed with **moveable** (`dragStartMoveable`)

```js
import "lit-moveable";
import { render } from "lit-html":

render(html`
<div class="target" style="width: 200px;height: 100px;">Target</div>
<lit-moveable
    .target=${".target"}
    .mvDraggable=${true}
    .resizable=${true}
    @litDragStart=${({ detail: e }) => {
        e.set(translate);
    }}
    @litDrag=${({ detail: e }) => {
        e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
        translate = e.beforeTranslate;
    }}
    @litResizeStart=${({ detail: e }) => {
        e.dragStart && e.dragStart.set(translate);
    }}
    @litResize=${({ detail: e }) => {
        const beforeTranslate = e.drag.beforeTranslate;

        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        translate = beforeTranslate;
    }}
/>
`);
```

## ⚙️ Developments
### `npm run start`

Open ./demo/index.html

## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!


## 👏 Contributing

If you have any questions or requests or want to contribute to `moveable` or other packages, please write the [issue](https://github.com/daybrush/moveable/issues) or give me a Pull Request freely.


### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/daybrush/moveable/blob/master/CONTRIBUTING.md)].

<a href="https://github.com/daybrush/moveable/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=daybrush/moveable" />
</a>

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/daybrush/moveable/issues) on GitHub.

## Sponsors
<p align="center">
	<a href="https://daybrush.com/sponsors/sponsors.svg">
		<img src="https://daybrush.com/sponsors/sponsors.svg"/>
	</a>
</p>


## 📝 License

This project is [MIT](https://github.com/daybrush/moveable/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2021 Daybrush

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
