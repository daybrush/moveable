import * as React from "react";
import * as ReactDOM from "react-dom";
import DraggableExample from "./DraggableExample";
import { wait, mousedown, mouseup, mousemove } from "../TestHelper";
import * as sinon from "sinon";

describe("test Moveable(draggable)", () => {
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
    it("test Drag", async () => {
        let moveable!: DraggableExample;

        // Given
        const onDragStart = sinon.spy(e => {
            e.set([50, 0]);
        });
        const onDrag = sinon.spy();
        const onDragEnd = sinon.spy();
        ReactDOM.render(<DraggableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
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
        mouseup(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
        await wait(300);

        // Then
        expect(onDragStart.callCount).to.be.equals(2);
        expect(onDrag.callCount).to.be.equals(2);
        expect(onDragEnd.callCount).to.be.equals(2);
        expect(onDragStart.args[0][0].target).to.be.equals(document.querySelector(".c2"));
        expect(onDrag.args[0][0].target).to.be.equals(document.querySelector(".c2"));
        expect(onDragEnd.args[0][0].target).to.be.equals(document.querySelector(".c2"));

        expect(onDrag.args[0][0].dist[0]).to.be.deep.equals(25);
        expect(onDrag.args[1][0].dist[0]).to.be.deep.equals(50);

        expect(onDrag.args[0][0].delta[0]).to.be.deep.equals(25);
        expect(onDrag.args[1][0].delta[0]).to.be.deep.equals(25);

        expect(onDrag.args[0][0].translate[0]).to.be.deep.equals(75);
        expect(onDrag.args[1][0].translate[0]).to.be.deep.equals(100);
    });
    it("test Cancel Drag", async () => {
        let moveable!: DraggableExample;

        // Given
        const onDragStart = sinon.spy(e => {
            return false;
        });
        const onDrag = sinon.spy();
        const onDragEnd = sinon.spy();
        ReactDOM.render(<DraggableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
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
        mouseup(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
        await wait(300);

        // Then
        expect(onDragStart.callCount).to.be.equals(2);
        expect(onDrag.callCount).to.be.equals(0);
        expect(onDragEnd.callCount).to.be.equals(0);
    });
});
