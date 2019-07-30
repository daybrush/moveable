export const codes = {
    draggable: {
        vanilla: `
import Moveable from "moveable";

/* const translate = [0, 0]; */
const draggable = new Moveable(document.body, {
    target: document.querySelector(".draggable"),
    draggable: true,
    throttleDrag: 0,
}).on("drag", ({ left, top, beforeDelta }) => {
    e.target.style.left = left + "px";
    e.target.style.top = top + "px";

    /* translate[0] += beforeDelta[0]; */
    /* translate[1] += beforeDelta[1]; */
    /* e.target.style.transform
        = "translateX(" + translate[0] + "px) "
        + "translateY(" + translate[1] + "px)"; */
});
        `,
        react: `
import Moveable from "react-moveable";
this.translate = [0, 0];
return (
    <Moveable
        target={document.querySelector(".draggable")}
        draggable={true}
        throttleDrag={0}
        onDrag={({ left, top, beforeDelta }) => {
            e.target.style.left = left + "px";
            e.target.style.top = top + "px";

            /* const translate = this.translate */
            /* translate[0] += beforeDelta[0]; */
            /* translate[1] += beforeDelta[1]; */
            /* e.target.style.transform
                = "translateX(" + translate[0] + "px) "
                + "translateY(" + translate[1] + "px)"; */
        }}
    />
);
        `,
    },
    resizable: {
        vanilla: `
import Moveable from "moveable";

const resizable = new Moveable(document.body, {
    target: document.querySelector(".resizable"),
    resizable: true,
    throttleResize: 0,
    keepRatio: true,
}).on("resize", e => {
    console.log(e.width, e.height, e.dist);
    e.target.style.width = e.width + "px";
    e.target.style.height = e.height + "px";
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".resizable")}
        resizable={true}
        throttleResize={0}
        keepRatio={true}
        onResize={e => {
            console.log(e.width, e.height, e.dist);
            e.target.style.width = e.width + "px";
            e.target.style.height = e.height + "px";
        }}
    />
);
        `,
    },
    scalable: {
        vanilla: `
import Moveable from "moveable";

const scale = [1, 1];
const scalable = new Moveable(document.body, {
    target: document.querySelector(".scalable"),
    scalable: true,
    throttleScale: 0,
    keepRatio: true,
}).on("scale", ({ dist }) => {
    scale[0] *= dist[0];
    scale[1] *= dist[1];
    e.target.style.transform = "scale(" + scale[0] +  "," + scale[1] + ")";
});
        `,
        react: `
import Moveable from "react-moveable";

this.scale = [1, 1];
return (
    <Moveable
        target={document.querySelector(".scalable")}
        scalable={true}
        throttleScale={0}
        keepRatio={true}
        onScale={({ dist }) => {
            const scale = this.scale;
            scale[0] *= dist[0];
            scale[1] *= dist[1];
            e.target.style.transform
                = "scale(" + scale[0] +  "," + scale[1] + ")";
        }}
    />
);
        `,
    },
    rotatable: {
        vanilla: `
import Moveable from "moveable";

let rotate = 0;

const rotatable = new Moveable(document.body, {
    target: document.querySelector(".rotatable"),
    rotatable: true,
    throttleRotate: 0,
}).on("rotate", ({ delta }) => {
    rotate += delta;
    e.target.style.transform
        = "rotate(" + rotate +  "deg)";
});
        `,
        react: `
import Moveable from "react-moveable";

this.rotate = 0;

return (
    <Moveable
        target={document.querySelector(".rotatable")}
        rotatable={true}
        throttleRotate={0}
        onRotate={({ beforeDelta, delta }) => {
            this.rotate += delta;
            e.target.style.transform
                = "rotate(" + this.rotate +  "deg)";
        }}
    />
);
        `,
    },
    warpable: {
        vanilla: `
import Moveable from "moveable";

let matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];

const warpable = new Moveable(document.body, {
    target: document.querySelector(".warpable"),
    warpable: true,
    throttleRotate: 0,
}).on("warp", ({ multiply, delta }) => {
    matrix = multiply(matrix, delta);
    e.target.style.transform
        = "matrix3d(" + matrix.join(",") +  ")";
});
        `,
        react: `
import Moveable from "react-moveable";

this.matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];

return (
    <Moveable
        target={document.querySelector(".warpable")}
        warpable={true}
        onWarp={({ multiply, delta }) => {
            this.matrix = multiply(this.matrix, delta);
            e.target.style.transform
                = "matrix3d(" + matrix.join(",") +  ")";
        }}
    />
);
        `,
    },
    origin: {
        vanilla: `
import Moveable from "moveable";

const rotatable = new Moveable(document.body, {
    target: document.querySelector(".origin"),
    rotatable: true,
    origin: true,
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".origin")}
        rotatable={true}
        origin={true}
    />
);
        `,
    },
};
