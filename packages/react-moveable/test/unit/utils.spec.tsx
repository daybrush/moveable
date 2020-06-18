import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    getTransformMatrix, getAbsoluteMatrix,
    getSize, caculateMatrixStack,
    throttle, throttleArray, isInside, caculateBoundSize,
} from "../../src/react-moveable/utils";
import { getRad, multiply, invert, transpose, createWarpMatrix, caculate } from "../../src/react-moveable/matrix";
import { helperInvert, helperMultiply, helperCreateWarpMatrix, helperCaculate } from "./TestHelper";

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
    it("test multiply", () => {
        // Given
        const matrix1 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        const matrix2 = [0.75, 0, 0, 0, 0.75, 0, 0, 0, 1];

        // When, Then
        expect(multiply(matrix1, matrix2)).to.be.deep.equals([0.75, 0, 0, 0, 0.75, 0, 0, 0, 1]);
        expect(multiply(matrix2, matrix2)).to.be.deep.equals([0.5625, 0, 0, 0, 0.5625, 0, 0, 0, 1]);
    });
    it("test invert", () => {
        // Given
        const matrix1 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        const matrix2 = [0.5, 0, 0, 0, 0.5, 0, 0, 0, 1];

        // When, Then
        expect(invert(matrix1)).to.be.deep.equals([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        expect(invert(matrix2)).to.be.deep.equals([2, 0, 0, 0, 2, 0, 0, 0, 1]);
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
        // Given, When
        const matrix1 = getAbsoluteMatrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ], 3, [50, 50]);
        // const matrix2 = getAbsoluteMatrix([
        //     2, 0, 40,
        //     0, 3, 50,
        //     0, 0, 1,
        // ], 3, [50, 50]);
        const matrix2 = getAbsoluteMatrix([
            2, 0, 0,
            0, 3, 0,
            40, 50, 1,
        ], 3, [50, 50]);

        // Then
        expect(matrix1).to.be.deep.equals([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
        // expect(matrix2).to.be.deep.equals([
        //     2, 0, -10,
        //     0, 3, -50,
        //     0, 0, 1,
        // ]);
        expect(matrix2).to.be.deep.equals([
            2, 0, 0,
            0, 3, 0,
            -10, -50, 1,
        ]);
    });
    it("test getSize", () => {
        // Given
        ReactDOM.render(
            <div className="c1" style={{ position: "relative", width: "500px", height: "500px", border: "2px solid black" }}>
                <svg data-target="svg" viewBox="0 0 150 110" style={{ width: "300px", border: "1px solid #fff" }}>
                    <path data-target="path1" d="M 74 53.64101615137753 L 14.000000000000027 88.28203230275507 L 14 19 L 74 53.64101615137753 Z" fill="#f55" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#5f5" origin="50% 50%" />
                    <path data-target="path2" d="M 84 68.64101615137753 L 24.00000000000003 103.28203230275507 L 24 34 L 84 68.64101615137753 Z" fill="#55f" stroke-linejoin="round" stroke-width="8" opacity="1" stroke="#333" origin="50% 50%" />
                    <g style={{ transform: "translate(40px, 10px)" }}>
                        <path data-target="pathline" d="M3,19.333C3,17.258,9.159,1.416,21,5.667
            c13,4.667,13.167,38.724,39.667,7.39" fill="transparent" stroke="#ff5" />
                        <ellipse data-target="ellipse" cx="40" cy="80" rx="40" ry="10" style={{ fill: "yellow", stroke: "purple", strokeWidth: 2 }} />
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
        expect(deg1).to.be.equals(0);
        expect(deg2).to.be.equals(45);
        expect(deg3).to.be.equals(90);
        expect(deg4).to.be.equals(135);
        expect(deg5).to.be.equals(180);
        expect(deg6).to.be.equals(225);
        expect(deg7).to.be.equals(270);
        expect(deg8).to.be.equals(315);
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

                <div className="c5"
                    style={{ position: "static", width: "100px", height: "100px" }}>
                    <div className="c6"
                        style={{ position: "static", width: "100px", height: "100px" }}></div>
                </div>
            </div>, document.querySelector(".container"));

        const c1 = document.querySelector(".c1") as HTMLElement;
        const c2 = document.querySelector(".c2") as HTMLElement;
        const c3 = document.querySelector(".c3") as HTMLElement;
        const c4 = document.querySelector(".c4") as HTMLElement;
        const c5 = document.querySelector(".c5") as HTMLElement;
        const c6 = document.querySelector(".c6") as HTMLElement;

        // When
        const stack1 = caculateMatrixStack(c2, document.body, document.body);
        const stack2 = caculateMatrixStack(c3, document.body, document.body);
        const stack3 = caculateMatrixStack(c4, document.body, document.body);
        const stack5 = caculateMatrixStack(c6, c5, c5);
        const stack6 = caculateMatrixStack(c6, c4, c4);
        const stack7 = caculateMatrixStack(c6, null, null);

        // [2, 0, -252, 0, 2, -252, 0, 0, 1], [2, 0, -48, 0, 2, -48, 0, 0, 1], [2, 0, -48, 0, 2, -48, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1], 'matrix(1,0,0,1,0,0)', [50, 50], false
        const [
            , beforeMatrix1, offsetMatrix1, matrix1, targetMatrix1, transform1, transformOrigin1, is3d1,
        ] = stack1;
        // [2, 0, -252, 0, 2, -252, 0, 0, 1], [2, 0, -48, 0, 2, 152, 0, 0, 1], [2, 0, 152, 0, 2, 232, 0, 0, 1], [1, 0, 100, 0, 1, 40, 0, 0, 1], 'matrix(1,0,0,1,100,40)', [50, 50], false
        const [
            , beforeMatrix2, offsetMatrix2, matrix2, targetMatrix2, transform2, transformOrigin2, is3d2,
        ] = stack2;
        // [[2, 0, 0, -252, 0, 2, 0, -252, 0, 0, 1, 0, 0, 0, 0, 1], [2, 0, 0, -48, 0, 2, 0, 448, 0, 0, 1, 0, 0, 0, 0, 1], [2, 0, 0, -48, 0, 2, 0, 448, 0, 0, 1, 100, 0, 0, 0, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1], 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)', [50, 50], true]
        const [
            , beforeMatrix3, offsetMatrix3, matrix3, targetMatrix3, transform3, transformOrigin3, is3d3,
        ] = stack3;

        // Then
        expect(beforeMatrix1).to.be.deep.equals(transpose([2, 0, -252, 0, 2, -252, 0, 0, 1]));
        expect(offsetMatrix1).to.be.deep.equals(transpose([2, 0, -48, 0, 2, -48, 0, 0, 1]));
        expect(matrix1).to.be.deep.equals(transpose([2, 0, -48, 0, 2, -48, 0, 0, 1]));
        expect(targetMatrix1).to.be.deep.equals(transpose([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        expect(transform1).to.be.equals("matrix(1,0,0,1,0,0)");
        expect(transformOrigin1).to.be.deep.equals([50, 50]);
        expect(is3d1).to.be.false;

        expect(beforeMatrix2).to.be.deep.equals(transpose([2, 0, -252, 0, 2, -252, 0, 0, 1]));
        expect(offsetMatrix2).to.be.deep.equals(transpose([2, 0, -48, 0, 2, 152, 0, 0, 1]));
        expect(matrix2).to.be.deep.equals(transpose([2, 0, 152, 0, 2, 232, 0, 0, 1]));
        expect(targetMatrix2).to.be.deep.equals(transpose([1, 0, 100, 0, 1, 40, 0, 0, 1]));
        expect(transform2).to.be.equals("matrix(1,0,0,1,100,40)");
        expect(transformOrigin2).to.be.deep.equals([50, 50]);
        expect(is3d2).to.be.false;

        expect(beforeMatrix3).to.be.deep.equals(transpose([2, 0, 0, -252, 0, 2, 0, -252, 0, 0, 1, 0, 0, 0, 0, 1]));
        expect(offsetMatrix3).to.be.deep.equals(transpose([2, 0, 0, -48, 0, 2, 0, 452, 0, 0, 1, 0, 0, 0, 0, 1]));
        expect(matrix3).to.be.deep.equals(transpose([2, 0, 0, -48, 0, 2, 0, 452, 0, 0, 1, 100, 0, 0, 0, 1]));
        expect(targetMatrix3).to.be.deep.equals(transpose([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 100, 0, 0, 0, 1]));
        expect(transform3).to.be.equals("matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,100,1)");
        expect(transformOrigin3).to.be.deep.equals([50, 50]);
        expect(is3d3).to.be.true;
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
    [
        {
            poses: [[-100, -101.318], [100, -101.318], [-100, 101.682], [100, 101.682]],
            nextPoses: [[-100, -102.651, 0, 1], [100, -102.651, 0, 1], [-100, 101.682, 0, 1], [100, 101.682, 0, 1]],
        },
        {
            poses: [[0, 0], [320, 0], [0, 220], [320, 220]],
            nextPoses: [[100, 0], [420, 0], [100, 220], [420, 220]],
        },
        {
            poses: [
                [-100, -101.318],
                [-100, 101.682],
                [100, -101.318],
                [100, 101.682],
            ],
            nextPoses: [
                [-100, -101.318, 0, 1],
                [-100, 101.682, 0, 1],
                [289, -104.318, 0, 1],
                [289, 98.682, 0, 1],
            ],
        },
    ].forEach(({ poses, nextPoses }, i) => {
        it(`test createWarpMatrix${i}`, () => {
            // Given
            const [x0, y0] = poses[0];
            const [x1, y1] = poses[1];
            const [x2, y2] = poses[2];
            const [x3, y3] = poses[3];

            const [u0, v0] = nextPoses[0];
            const [u1, v1] = nextPoses[1];
            const [u2, v2] = nextPoses[2];
            const [u3, v3] = nextPoses[3];

            const matrix1 = [
                x0, y0, 1, 0, 0, 0, -u0 * x0, -u0 * y0,
                0, 0, 0, x0, y0, 1, -v0 * x0, -v0 * y0,
                x1, y1, 1, 0, 0, 0, -u1 * x1, -u1 * y1,
                0, 0, 0, x1, y1, 1, -v1 * x1, -v1 * y1,
                x2, y2, 1, 0, 0, 0, -u2 * x2, -u2 * y2,
                0, 0, 0, x2, y2, 1, -v2 * x2, -v2 * y2,
                x3, y3, 1, 0, 0, 0, -u3 * x3, -u3 * y3,
                0, 0, 0, x3, y3, 1, -v3 * x3, -v3 * y3,
            ];

            const matrix2 = [
                x0, 0, x1, 0, x2, 0, x3, 0,
                y0, 0, y1, 0, y2, 0, y3, 0,
                1, 0, 1, 0, 1, 0, 1, 0,
                0, x0, 0, x1, 0, x2, 0, x3,
                0, y0, 0, y1, 0, y2, 0, y3,
                0, 1, 0, 1, 0, 1, 0, 1,
                -u0 * x0, -v0 * x0, -u1 * x1, -v1 * x1, -u2 * x2, -v2 * x2, -u3 * x3, -v3 * x3,
                -u0 * y0, -v0 * y0, -u1 * y1, -v1 * y1, -u2 * y2, -v2 * y2, -u3 * y3, -v3 * y3,
            ];

            // When
            const helperInvertMatrix = helperInvert(matrix1, 8);
            const invertMatrix = invert(matrix2, 8);

            const h = multiply(invertMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);
            const helperH = helperMultiply(helperInvertMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);

            // Then
            const pp = [...poses, ...nextPoses];
            poses.forEach((pos, j) => {
                const [x, y] = caculate((createWarpMatrix as any)(...pp), [pos[0], pos[1], 0, 1]);

                expect(x).to.be.closeTo(nextPoses[j][0], 0.01);
                expect(y).to.be.closeTo(nextPoses[j][1], 0.01);
            });
            expect(h).to.be.deep.equals(helperH);
            expect(invertMatrix).to.be.deep.equals(transpose(helperInvertMatrix));
        });
    });
    it("test isInside", () => {
        const pos1 = [0, 0];
        const pos2 = [302, 0];
        const pos3 = [0, 222];
        const pos4 = [302, 222];

        expect(isInside([30, 30], pos1, pos2, pos3, pos4)).to.be.true;
    });
    it("test caculateBoundSize", () => {
        const size1 = caculateBoundSize([100, 100], [0, 0], [100, 50]);
        const size2 = caculateBoundSize([-10, 100], [0, 0], [100, 50]);
        const size3 = caculateBoundSize([100, 100], [0, 0], [100, 50], true);
        const size4 = caculateBoundSize([100, 100], [50, 40], [100, 50], true);
        const size5 = caculateBoundSize([40, 100], [50, 40], [Infinity, 150], true);

        expect(size1).to.be.deep.equals([100, 50]);
        expect(size2).to.be.deep.equals([0, 50]);
        expect(size3).to.be.deep.equals([50, 50]);
        expect(size4).to.be.deep.equals([50, 50]);
        expect(size5).to.be.deep.equals([50, 125]);
    });
});
