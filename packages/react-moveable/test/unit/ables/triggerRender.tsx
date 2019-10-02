import * as React from "react";
import * as ReactDOM from "react-dom";
import DraggableExample from "./DraggableExample";
import { wait, mousedown, mouseup, mousemove } from "../TestHelper";
import * as sinon from "sinon";

describe("test Moveable(triggerRender)", () => {
    beforeEach(() => {
        document.documentElement.style.cssText = "position: relative;height: 100%; width: 100%;margin: 0; padding: 0;";
        document.body.style.cssText = "position: relative;height: 100%; width: 100%;margin: 0;padding: 0;";
        document.body.innerHTML = `<div class="container"></div>`;
    });
    afterEach(() => {
        const container = document.querySelector(".container");

        if (container) {
            ReactDOM.unmountComponentAtNode(container);
        }
    });
    it("test render events", async () => {
        let moveable!: DraggableExample;

        // Given
        const onDragStart = sinon.spy();
        const onDrag = sinon.spy();
        const onDragEnd = sinon.spy();
        const onRenderStart = sinon.spy();
        const onRender = sinon.spy();
        const onRenderEnd = sinon.spy();
        ReactDOM.render(<DraggableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onRenderStart={onRenderStart}
            onRender={onRender}
            onRenderEnd={onRenderEnd}
        />, document.querySelector(".container"));

        await wait(300);

        // When
        // no drag
        mousedown(document.querySelector<HTMLElement>(".c2")!, [0, 0]);
        mouseup(document.querySelector<HTMLElement>(".c2")!, [0, 0]);

        // drag
        mousedown(document.querySelector<HTMLElement>(".c2")!, [0, 0]);
        mousemove(document.querySelector<HTMLElement>(".c2")!, [50, 0]);
        mousemove(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
        // dragEnd
        mouseup(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
        await wait(300);

        console.log(onRenderStart.callCount, onRender.callCount, onRenderEnd.callCount);
        // Then
        expect(onRenderStart.callCount).to.be.equals(2);
        expect(onRender.callCount).to.be.equals(2);
        expect(onRenderEnd.callCount).to.be.equals(2);
    });
});
