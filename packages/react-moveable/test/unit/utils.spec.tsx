import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    getTransformMatrix, getAbsoluteMatrix,
    getSize, caculateMatrixStack,
    throttle, throttleArray, getTransform, isInside,
} from "../../src/react-moveable/utils";
import { getRad } from "@moveable/matrix";

describe("test utils", () => {
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
    it("test getTransformMatrix", () => {
        const matrix1 = getTransformMatrix("none");
        const matrix2 = getTransformMatrix("");
        const matrix3 = getTransformMatrix("matrix(1, 0, 0, 10, 0, 0)");
        const matrix4 = getTransformMatrix([10, 10, 0, 1, 2, 3]);

        expect(matrix1).to.be.deep.equals([1, 0, 0, 1, 0, 0]);
        expect(matrix2).to.be.deep.equals([1, 0, 0, 1, 0, 0]);
        expect(matrix3).to.be.deep.equals([1, 0, 0, 10, 0, 0]);
        expect(matrix4).to.be.deep.equals([10, 10, 0, 1, 2, 3]);
    });
    it("test getAbsoluteMatrix", () => {
        const matrix1 = getAbsoluteMatrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ], 3, [50, 50]);
        const matrix2 = getAbsoluteMatrix([
            2, 0, 40,
            0, 3, 50,
            0, 0, 1,
        ], 3, [50, 50]);

        expect(matrix1).to.be.deep.equals([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
        expect(matrix2).to.be.deep.equals([
            2, 0, -10,
            0, 3, -50,
            0, 0, 1,
        ]);
    });
    it("test getSize", () => {
        // Given
        ReactDOM.render(
        <div className="c1" style={{ position: "relative", width: "500px", height: "500px", border: "2px solid black" }}>
            <svg data-target="svg" viewBox="0 0 150 110" style={{width: "300px", border: "1px solid #fff"}}>
            <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
            <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
            <g style={{transform: "translate(40px, 10px)"}}>
                <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5"/>
            <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{fill: "yellow",stroke:"purple", strokeWidth:2}} />
            </g>
        </svg></div>, document.querySelector(".container"));

        const c1 = document.querySelector(".c1")! as HTMLElement;
        const c2 = document.querySelector("svg")! as SVGElement;

        // When
        const size1 = getSize(c1, undefined, true);
        const size2 = getSize(c1, undefined, false);
        const size3 = getSize(c2, undefined, true);
        const size4 = getSize(c2, undefined, false);

        // Then
        expect(size1).to.be.deep.equals([504, 504]);
        expect(size2).to.be.deep.equals([500, 500]);
        // 300 + 2, 220 + 2
        expect(size3).to.be.deep.equals([302, 222]);
        expect(size4).to.be.deep.equals([300, 220]);
    });
    it("test getRad", () => {
        // Given, When
        const deg1 = getRad([0, 0], [10, 0]) / Math.PI * 180;
        const deg2 = getRad([0, 0], [10, 10]) / Math.PI * 180;
        const deg3 = getRad([0, 0], [0, 10]) / Math.PI * 180;
        const deg4 = getRad([0, 0], [-10, 10]) / Math.PI * 180;
        const deg5 = getRad([0, 0], [-10, 0]) / Math.PI * 180;
        const deg6 = getRad([0, 0], [-10, -10]) / Math.PI * 180;
        const deg7 = getRad([0, 0], [0, -10]) / Math.PI * 180;
        const deg8 = getRad([0, 0], [10, -10]) / Math.PI * 180;

        // Then
        expect(deg1).to.be.equals(360);
        expect(deg2).to.be.equals(45);
        expect(deg3).to.be.equals(90);
        expect(deg4).to.be.equals(135);
        expect(deg5).to.be.equals(180);
        expect(deg6).to.be.equals(225);
        expect(deg7).to.be.equals(270);
        expect(deg8).to.be.equals(315);
    });
    it("test getTransform", () => {
        // Given
        ReactDOM.render(
        <div className="c1" style={{
            position: "relative", width: "500px", height: "500px", border: "2px solid black", transform: "scale(2)",
        }}>
            <div className="c2"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "100px" }}></div>
            <div className="c3"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "100px", transform: "translate(100px, 40px)" }}></div>
            <div className="c4"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "150px", transform: "translateZ(100px)" }}></div>
        </div>, document.querySelector(".container"));

        const c1 = document.querySelector(".c1") as HTMLElement;
        const c2 = document.querySelector(".c2") as HTMLElement;
        const c3 = document.querySelector(".c3") as HTMLElement;
        const c4 = document.querySelector(".c4") as HTMLElement;

        // When
        const t1 = getTransform(c1, true);
        const t2 = getTransform(c1, false);
        const t3 = getTransform(c2, true);
        const t4 = getTransform(c2, false);
        const t5 = getTransform(c3, true);
        const t6 = getTransform(c3, false);
        const t7 = getTransform(c4, true);
        const t8 = getTransform(c4, false);

        // Then
        expect(t1).to.be.deep.equals([2, 0, 0, 2, 0, 0]);
        expect(t2).to.be.deep.equals([2, 0, 0, 2, 0, 0]);

        expect(t3).to.be.deep.equals([1, 0, 0, 1, 0, 0]);
        expect(t4).to.be.deep.equals("none");

        expect(t5).to.be.deep.equals([1, 0, 0, 1, 100, 40]);
        expect(t6).to.be.deep.equals([1, 0, 0, 1, 100, 40]);

        expect(t7).to.be.deep.equals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 100, 1]);
        expect(t8).to.be.deep.equals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 100, 1]);

    });
    it("test caculateMatrixStack(HTMLElement)", () => {
        // Given
        ReactDOM.render(
        <div className="c1" style={{
            position: "relative", width: "500px", height: "500px", border: "2px solid black", transform: "scale(2)",
        }}>
            <div className="c2"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "100px" }}></div>
            <div className="c3"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "100px", transform: "translate(100px, 40px)" }}></div>
            <div className="c4"
                style={{ position: "relative", width: "100px", height: "100px", left: "100px", top: "150px", transform: "translateZ(100px)" }}></div>
        </div>, document.querySelector(".container"));

        const c1 = document.querySelector(".c1") as HTMLElement;
        const c2 = document.querySelector(".c2") as HTMLElement;
        const c3 = document.querySelector(".c3") as HTMLElement;
        const c4 = document.querySelector(".c4") as HTMLElement;

        // When
        const stack1 = caculateMatrixStack(c2, document.body);
        const stack2 = caculateMatrixStack(c3, document.body);
        const stack3 = caculateMatrixStack(c4, document.body);
        const stack4 = caculateMatrixStack(c4, c4);

        // [2, 0, -252, 0, 2, -252, 0, 0, 1], [2, 0, -52, 0, 2, -52, 0, 0, 1], [2, 0, -52, 0, 2, -52, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1], 'matrix(1,0,0,1,0,0)', [50, 50], false
        const [beforeMatrix1, offsetMatrix1, matrix1, targetMatrix1, transform1, transformOrigin1, is3d1] = stack1;
        // [2, 0, -252, 0, 2, -252, 0, 0, 1], [2, 0, -52, 0, 2, 148, 0, 0, 1], [2, 0, 148, 0, 2, 228, 0, 0, 1], [1, 0, 100, 0, 1, 40, 0, 0, 1], 'matrix(1,0,0,1,100,40)', [50, 50], false
        const [beforeMatrix2, offsetMatrix2, matrix2, targetMatrix2, transform2, transformOrigin2, is3d2] = stack2;
        // [[2, 0, 0, -252, 0, 2, 0, -252, 0, 0, 1, 0, 0, 0, 0, 1], [2, 0, 0, -52, 0, 2, 0, 448, 0, 0, 1, 0, 0, 0, 0, 1], [2, 0, 0, -52, 0, 2, 0, 448, 0, 0, 1, 100, 0, 0, 0, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1], 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)', [50, 50], true]
        const [beforeMatrix3, offsetMatrix3, matrix3, targetMatrix3, transform3, transformOrigin3, is3d3] = stack3;
        // [[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [1, 0, 0, 100, 0, 1, 0, 350, 0, 0, 1, 0, 0, 0, 0, 1], [1, 0, 0, 100, 0, 1, 0, 350, 0, 0, 1, 100, 0, 0, 0, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1], 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)', [50, 50], true]
        const [beforeMatrix4, offsetMatrix4, matrix4, targetMatrix4, transform4, transformOrigin4, is3d4] = stack4;

        // Then
        expect(beforeMatrix1).to.be.deep.equals([2, 0, -252, 0, 2, -252, 0, 0, 1]);
        expect(offsetMatrix1).to.be.deep.equals( [2, 0, -52, 0, 2, -52, 0, 0, 1]);
        expect(matrix1).to.be.deep.equals([2, 0, -52, 0, 2, -52, 0, 0, 1]);
        expect(targetMatrix1).to.be.deep.equals([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        expect(transform1).to.be.equals("matrix(1,0,0,1,0,0)");
        expect(transformOrigin1).to.be.deep.equals([50, 50]);
        expect(is3d1).to.be.false;

        expect(beforeMatrix2).to.be.deep.equals([2, 0, -252, 0, 2, -252, 0, 0, 1]);
        expect(offsetMatrix2).to.be.deep.equals([2, 0, -52, 0, 2, 148, 0, 0, 1]);
        expect(matrix2).to.be.deep.equals([2, 0, 148, 0, 2, 228, 0, 0, 1]);
        expect(targetMatrix2).to.be.deep.equals([1, 0, 100, 0, 1, 40, 0, 0, 1]);
        expect(transform2).to.be.equals("matrix(1,0,0,1,100,40)");
        expect(transformOrigin2).to.be.deep.equals([50, 50]);
        expect(is3d2).to.be.false;

        expect(beforeMatrix3).to.be.deep.equals([2, 0, 0, -252, 0, 2, 0, -252, 0, 0, 1, 0, 0, 0, 0, 1]);
        expect(offsetMatrix3).to.be.deep.equals([2, 0, 0, -52, 0, 2, 0, 448, 0, 0, 1, 0, 0, 0, 0, 1]);
        expect(matrix3).to.be.deep.equals([2, 0, 0, -52, 0, 2, 0, 448, 0, 0, 1, 100, 0, 0, 0, 1]);
        expect(targetMatrix3).to.be.deep.equals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1]);
        expect(transform3).to.be.equals("matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)");
        expect(transformOrigin3).to.be.deep.equals([50, 50]);
        expect(is3d3).to.be.true;

        expect(beforeMatrix4).to.be.deep.equals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        expect(offsetMatrix4).to.be.deep.equals([1, 0, 0, 100, 0, 1, 0, 350, 0, 0, 1, 0, 0, 0, 0, 1]);
        expect(matrix4).to.be.deep.equals([1, 0, 0, 100, 0, 1, 0, 350, 0, 0, 1, 100, 0, 0, 0, 1]);
        expect(targetMatrix4).to.be.deep.equals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1]);
        expect(transform4).to.be.equals("matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)");
        expect(transformOrigin4).to.be.deep.equals([50, 50]);
        expect(is3d4).to.be.true;
    });

    it("test throttle", () => {
        // Given, When
        const t0 = throttle(0.05, 0);
        const t1 = throttle(0.05, 0.1);
        const t2 = throttle(0.005, 0.1);
        const t3 = throttle(1.05, 0.1);
        const t4 = throttle(1.05, 1);
        const t5 = throttle(1.5, 1);
        const t6 = throttle(2.1, 2);
        const t7 = throttle(1.9, 2);
        const t8 = throttle(3, 2);

        // Then
        expect(t0).to.be.equals(0.05);
        expect(t1).to.be.equals(0.1);
        expect(t2).to.be.equals(0);
        expect(t3).to.be.equals(1.1);
        expect(t4).to.be.equals(1);
        expect(t5).to.be.equals(2);
        expect(t6).to.be.equals(2);
        expect(t7).to.be.equals(2);
        expect(t8).to.be.equals(4);
    });
    it("test throttleArray", () => {
        // Given, When
        const t0 = throttleArray([0.05, 0.06], 0);
        const t1 = throttleArray([0.05, 0.005], 0.1);
        const t2 = throttleArray([1.05, 1.04], 0.1);
        const t3 = throttleArray([1.05, 1.5], 1);
        const t4 = throttleArray([2.1, 1.9, 3], 2);

        // Then
        expect(t0).to.be.deep.equals([0.05, 0.06]);
        expect(t1).to.be.deep.equals([0.1, 0]);
        expect(t2).to.be.deep.equals([1.1, 1]);
        expect(t3).to.be.deep.equals([1, 2]);
        expect(t4).to.be.deep.equals([2, 2, 4]);
    });

    it("test isInside", () => {
        const pos1 = [0, 0];
        const pos2 = [302, 0];
        const pos3 = [302, 222];
        const pos4 = [0, 222];

        expect(isInside([30, 30], pos1, pos2, pos3, pos4)).to.be.true;
    });
});
