import * as React from "react";
import * as ReactDOM from "react-dom";
import RotatableExample from "./RotatableExample";
import { wait, rotateStart, rotate, rotateEnd } from "../TestHelper";
import * as sinon from "sinon";

describe("test Moveable(rotatable)", () => {
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
    it("test Rotate", async () => {
        let moveable!: RotatableExample;

        // Given
        const onRotateStart = sinon.spy(e => {
            e.set(45);
        });
        const onRotate = sinon.spy();
        const onRotateEnd = sinon.spy();
        ReactDOM.render(<RotatableExample ref={e => {
            if (e) {
                moveable = e as any;
            }
        }}
        onRotateStart={onRotateStart}
        onRotate={onRotate}
        onRotateEnd={onRotateEnd}
        />, document.querySelector(".container"));

        await wait(300);

        // When
        // no drag
        const startInfo = rotateStart(moveable.innerMoveable.moveable);
        rotateEnd(startInfo);

        // drag
        const startInfo2 = rotateStart(moveable.innerMoveable.moveable);
        rotate(startInfo2, 45);
        rotate(startInfo2, 90);
        rotateEnd(startInfo2);
        await wait(300);

        // Then
        expect(onRotateStart.callCount).to.be.equals(2);
        expect(onRotate.callCount).to.be.equals(2);
        expect(onRotateEnd.callCount).to.be.equals(2);
        expect(onRotateStart.args[0][0].target).to.be.equals(document.querySelector(".c2"));
        expect(onRotate.args[0][0].target).to.be.equals(document.querySelector(".c2"));
        expect(onRotateEnd.args[0][0].target).to.be.equals(document.querySelector(".c2"));

        expect(onRotate.args[0][0].beforeDist).to.be.closeTo(45, 1);
        expect(onRotate.args[1][0].beforeDist).to.be.closeTo(90, 1);

        expect(onRotate.args[0][0].beforeDelta).to.be.closeTo(45, 1);
        expect(onRotate.args[1][0].beforeDelta).to.be.closeTo(45, 1);

        expect(onRotate.args[0][0].beforeRotate).to.be.closeTo(90, 1);
        expect(onRotate.args[1][0].beforeRotate).to.be.closeTo(135, 1);
    });
    // it("test Cancel rotate", async () => {
    //     let moveable!: RotatableExample;

    //     // Given
    //     const onRotateStart = sinon.spy(e => {
    //         return false;
    //     });
    //     const onRotate = sinon.spy();
    //     const onRotateEnd = sinon.spy();
    //     ReactDOM.render(<RotatableExample ref={e => {
    //         if (e) {
    //             moveable = e as any;
    //         }
    //     }}
    //     onRotateStart={onRotateStart}
    //     onRotate={onRotate}
    //     onRotateEnd={onRotateEnd}
    //     />, document.querySelector(".container"));

    //     await wait(300);

    //     // When
    //     // no drag
    //     mousedown(document.querySelector<HTMLElement>(".c2")!, [0, 0]);
    //     mouseup(document.querySelector<HTMLElement>(".c2")!, [0, 0]);

    //     // drag
    //     mousedown(document.querySelector<HTMLElement>(".c2")!, [0, 0]);
    //     mousemove(document.querySelector<HTMLElement>(".c2")!, [50, 0]);
    //     mousemove(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
    //     mouseup(document.querySelector<HTMLElement>(".c2")!, [100, 0]);
    //     await wait(300);


    // });
});
