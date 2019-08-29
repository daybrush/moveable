import * as React from "react";
import * as ReactDOM from "react-dom";
import MoveableExample from "./MoveableExample";
import { wait } from "./TestHelper";

describe("test Moveable", () => {
    beforeEach(() => {
        document.documentElement.style.cssText = "position: relative;height: 100%; width: 100%;";
        document.body.style.cssText = "position: relative;height: 100%; width: 100%;";
        document.body.innerHTML = `<div class="container"></div>`;
    });
    afterEach(() => {
        const container = document.querySelector(".container");

        if (container) {
            ReactDOM.unmountComponentAtNode(container);
        }
    });
    it("test Moveable", async () => {
        let moveable!: MoveableExample;

        // 300 x 220
        ReactDOM.render(<MoveableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}/>, document.querySelector(".container"));

        await wait(300);

        const state = moveable.innerMoveable.moveable.state;
        expect(state.width).to.be.equals(302);
        expect(state.height).to.be.equals(222);
        expect(moveable.innerMoveable.isInside(40, 40)).to.be.true;
        expect(moveable.innerMoveable.isInside(300, 40)).to.be.true;
        expect(moveable.innerMoveable.isInside(-40, 40)).to.be.false;
        expect(moveable.innerMoveable.isInside(340, 40)).to.be.false;
        expect(moveable.innerMoveable.isInside(340, 40)).to.be.false;
    });
});
