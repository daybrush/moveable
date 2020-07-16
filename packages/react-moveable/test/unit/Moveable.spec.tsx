import * as React from "react";
import * as ReactDOM from "react-dom";
import MoveableExample from "./MoveableExample";
import { wait } from "./TestHelper";
import { MOVEABLE_EVENTS, MOVEABLE_EVENTS_PROPS_MAP, MOVEABLE_EVENTS_MAP } from "../../src/react-moveable";
import { camelize } from "@daybrush/utils";

describe("test Moveable", () => {
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
    it("test Moveable isInside", async () => {
        let moveable!: MoveableExample;

        // 300 x 220
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }} />, document.querySelector(".container"));

        await wait(300);

        const state = moveable.innerMoveable.moveable.state;
        expect(state.left).to.be.equals(2);
        expect(state.top).to.be.equals(2);
        expect(state.width).to.be.equals(302);
        expect(state.height).to.be.equals(222);
        expect(moveable.innerMoveable.isInside(40, 40)).to.be.true;
        expect(moveable.innerMoveable.isInside(300, 40)).to.be.true;
        expect(moveable.innerMoveable.isInside(-40, 40)).to.be.false;
        expect(moveable.innerMoveable.isInside(340, 40)).to.be.false;
        expect(moveable.innerMoveable.isInside(340, 40)).to.be.false;
    });
    it("test Moveable isMoveableElement", async () => {
        let moveable!: MoveableExample;

        // Given
        // 302 x 222
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }} />, document.querySelector(".container"));

        await wait(300);

        const isMoveable1 =
            moveable.innerMoveable.isMoveableElement(document.querySelector<HTMLElement>(".container")!);
        const isMoveable2 =
            moveable.innerMoveable.isMoveableElement(document.querySelector<HTMLElement>(".moveable-control-box")!);

        expect(isMoveable1).to.be.false;
        expect(isMoveable2).to.be.true;
    });
    it("test Moveable updateTarget", async () => {
        let moveable!: MoveableExample;

        // Given
        // 302 x 222
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }} />, document.querySelector(".container"));

        await wait(300);
        const left1 = moveable.innerMoveable.moveable.state.left;
        const top1 = moveable.innerMoveable.moveable.state.top;

        // When
        document.querySelector<HTMLElement>("svg")!.style.left = "100px";

        moveable.innerMoveable.updateTarget();

        const left2 = moveable.innerMoveable.moveable.state.left;
        const top2 = moveable.innerMoveable.moveable.state.top;

        await wait(300);

        // Then
        expect(left2).to.be.equals(left1 + 100);
        expect(top2).to.be.equals(top1);
    });
    it("test Moveable updateRect", async () => {
        let moveable!: MoveableExample;

        // Given
        // 302 x 222
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }} />, document.querySelector(".container"));

        await wait(300);
        const left1 = moveable.innerMoveable.moveable.state.left;
        const top1 = moveable.innerMoveable.moveable.state.top;

        // When
        document.querySelector<HTMLElement>(".c2")!.style.left = "100px";
        document.querySelector<HTMLElement>(".c2")!.style.top = "100px";
        document.querySelector<HTMLElement>("svg")!.style.left = "100px";

        moveable.innerMoveable.updateRect();

        const left2 = moveable.innerMoveable.moveable.state.left;
        const top2 = moveable.innerMoveable.moveable.state.top;

        await wait(300);

        // Then
        expect(left2).to.be.equals(left1 + 200);
        expect(top2).to.be.equals(top1 + 100);
    });
    it ("test Moveable changeTarget", async() => {
        let moveable!: MoveableExample;

        // Given
        // 302 x 222
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }} />, document.querySelector(".container"));

        await wait(300);
        const targetDragger = moveable.innerMoveable.moveable.targetDragger;
        const controlDragger = moveable.innerMoveable.moveable.controlDragger;

        // When
        moveable.setState({
            target: document.querySelector(".c2"),
        });

        await wait(300);

        // Then
        const nextTargetDragger = moveable.innerMoveable.moveable.targetDragger;
        const nextControlDragger = moveable.innerMoveable.moveable.controlDragger;

        expect(targetDragger).to.be.ok;
        expect(nextTargetDragger).to.be.ok;
        expect(nextTargetDragger).to.be.not.equals(targetDragger);
        expect(controlDragger).to.be.not.ok;
        expect(nextControlDragger).to.be.not.ok;
    });
    it ("check event validation", () => {
        const map = MOVEABLE_EVENTS_PROPS_MAP;

        for (const name in map) {
            const result = (map as any)[name];

            expect(camelize(`on ${result}`)).to.be.equals(name);
        }
    });
});
