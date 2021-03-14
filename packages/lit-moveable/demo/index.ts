import { html } from "lit-element";
import { render } from "lit-html";
import "../src/LitMoveable";

let target: HTMLElement;
let translate = [0, 0];

render(html`
<div class="root">
    <div class="container">
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
    </div>
</div>`, document.body);
