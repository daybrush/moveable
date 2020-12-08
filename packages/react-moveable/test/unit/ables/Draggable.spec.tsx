import * as React from "react";
import * as ReactDOM from "react-dom";
import DraggableExample from "./DraggableExample";
import { wait, mousedown, mouseup, mousemove } from "../TestHelper";
import * as sinon from "sinon";
import RotateDraggableExample from "./RotateDraggableExample";
import { OnDrag } from "../../../src/react-moveable";

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
    })
    it("test Drag (rotate: 270deg)", async () => {
        let moveable!: RotateDraggableExample;

        // Given
        const onDragStart = sinon.spy(e => {
            e.set([0, 0]);
        });
        const onDrag = sinon.spy((e: OnDrag) => {
            console.log(e.beforeDist, e.beforeTranslate);
            console.log(e.dist, e.translate);
            e.target.style.transform = `translate(${e.dist[0]}px, ${e.dist[1]}px)`;
        });
        const onDragEnd = sinon.spy();
        ReactDOM.render(<RotateDraggableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
            scale={1.2}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
        />, document.querySelector(".container"));

        await wait(300);

        // When
        const target = document.querySelector<HTMLElement>(".child")!;
        // drag
        mousedown(target, [0, 0]);
        mousemove(target, [50, 0]);
        mousemove(target, [100, 0]);
        mouseup(target, [100, 0]);
        await wait(300);

        // Then
        expect(onDragStart.callCount).to.be.equals(1);
        expect(onDrag.callCount).to.be.equals(2);
        expect(onDragEnd.callCount).to.be.equals(1);
        expect(onDragStart.args[0][0].target).to.be.equals(target);
        expect(onDrag.args[0][0].target).to.be.equals(target);
        expect(onDragEnd.args[0][0].target).to.be.equals(target);

        expect(onDrag.args[0][0].dist[0]).to.be.equals(0);
        expect(onDrag.args[1][0].dist[0]).to.be.equals(0);
        expect(onDrag.args[0][0].dist[1]).to.be.closeTo(50 / 1.2, 0.0001);
        expect(onDrag.args[1][0].dist[1]).to.be.closeTo(100 / 1.2, 0.0001);

        expect(onDrag.args[0][0].delta[0]).to.be.equals(0);
        expect(onDrag.args[1][0].delta[0]).to.be.equals(0);
        expect(onDrag.args[0][0].delta[1]).to.be.closeTo(50 / 1.2, 0.0001);
        expect(onDrag.args[1][0].delta[1]).to.be.closeTo(50 / 1.2, 0.0001);
    });
    it("test Drag (rotate: 270deg)", async () => {
        let moveable!: RotateDraggableExample;

        // Given
        const onDragStart = sinon.spy(e => {
            e.set([0, 0]);
        });
        const onDrag = sinon.spy((e: OnDrag) => {
            e.target.style.transform = `translate(${e.dist[0]}px, ${e.dist[1]}px)`;
        });
        const onDragEnd = sinon.spy();
        ReactDOM.render(<RotateDraggableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
            scale={1.3}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
        />, document.querySelector(".container"));

        await wait(300);

        // When
        const target = document.querySelector<HTMLElement>(".child")!;
        // drag
        mousedown(target, [0, 0]);
        mousemove(target, [50, 0]);
        mousemove(target, [100, 0]);
        mouseup(target, [100, 0]);
        await wait(300);

        // Then
        expect(onDragStart.callCount).to.be.equals(1);
        expect(onDrag.callCount).to.be.equals(2);
        expect(onDragEnd.callCount).to.be.equals(1);
        expect(onDragStart.args[0][0].target).to.be.equals(target);
        expect(onDrag.args[0][0].target).to.be.equals(target);
        expect(onDragEnd.args[0][0].target).to.be.equals(target);

        expect(onDrag.args[0][0].dist[0]).to.be.equals(0);
        expect(onDrag.args[1][0].dist[0]).to.be.equals(0);

        expect(onDrag.args[0][0].dist[1]).to.be.closeTo(50 / 1.3, 0.0001);
        expect(onDrag.args[1][0].dist[1]).to.be.closeTo(100 / 1.3, 0.0001);

        expect(onDrag.args[0][0].delta[0]).to.be.equals(0);
        expect(onDrag.args[1][0].delta[0]).to.be.equals(0);

        expect(onDrag.args[0][0].delta[1]).to.be.closeTo(50 / 1.3, 0.0001);
        expect(onDrag.args[1][0].delta[1]).to.be.closeTo(50 / 1.3, 0.0001);
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
