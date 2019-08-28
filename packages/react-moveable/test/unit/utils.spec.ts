// import * as React from "react";
// import * as ReactDOM from "react-dom";
import { getTransformMatrix, getAbsoluteMatrix } from "../../src/react-moveable/utils";

// describe("test utils", () => {
//     it("test getTransformMatrix", () => {
//         const matrix1 = getTransformMatrix("none");
//         const matrix2 = getTransformMatrix("");
//         const matrix3 = getTransformMatrix("matrix(1, 0, 0, 10, 0, 0)");
//         const matrix4 = getTransformMatrix([10, 10, 0, 1, 2, 3]);

//         expect(matrix1).to.be.deep.equals([1, 0, 0, 1, 0, 0]);
//         expect(matrix2).to.be.deep.equals([1, 0, 0, 1, 0, 0]);
//         expect(matrix3).to.be.deep.equals([1, 0, 0, 10, 0, 0]);
//         expect(matrix4).to.be.deep.equals([10, 10, 0, 1, 2, 3]);
//     });
//     it("test getAbsoluteMatrix", () => {
//         const matrix1 = getAbsoluteMatrix([
//             1, 0, 0,
//             0, 1, 0,
//             0, 0, 1,
//         ], 3, [50, 50]);
//         const matrix2 = getAbsoluteMatrix([
//             2, 0, 40,
//             0, 3, 50,
//             0, 0, 1,
//         ], 3, [50, 50]);

//         expect(matrix1).to.be.deep.equals([
//             1, 0, 0,
//             0, 1, 0,
//             0, 0, 1,
//         ]);
//         expect(matrix2).to.be.deep.equals([
//             2, 0, -10,
//             0, 3, -50,
//             0, 0, 1,
//         ]);
//     });
//     // it.only("test getSVGOffset", () => {
//     //     document.documentElement.style.cssText = "position: relative;height: 100%; width: 100%;";
//     //     document.body.style.cssText = "position: relative;height: 100%; width: 100%;";
//     //     ReactDOM.render(<div className="c1" style={{ position: "relative", width: "500px", height: "500px" }}>
//     //         <div className="c2"
//     //             style={{ position: "relative", width: "200px", height: "200px", left: "10px", top: "10px" }} />
//     //     </div>, document.body);

//     //     const c2 = document.querySelector(".c2")! as HTMLElement;

//     //     console.log(c2.offsetWidth, c2.clientWidth);
//     // });
// });
