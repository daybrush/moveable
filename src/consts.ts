export const codes = {
    draggable: {
        vanilla: `
import Moveable from "moveable";

const draggable = new Moveable(document.body, {
    target: document.querySelector(".draggable"),
    draggable: true,
}).on("drag", e => {
    console.log(e.dist);
    e.target.style.transform = e.transform;
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".draggable")}
        draggable={true}
        onDrag={e => {
            console.log(e.dist);
            e.target.style.transform = e.transform;
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

const scalable = new Moveable(document.body, {
    target: document.querySelector(".scalable"),
    scalable: true,
}).on("scale", e => {
    console.log(e.scale);
    e.target.style.transform = e.transform;
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".scalable")}
        scalable={true}
        onScale={e => {
            console.log(e.scale);
            e.target.style.transform = e.transform;
        }}
    />
);
        `,
    },
    rotatable: {
        vanilla: `
import Moveable from "moveable";

const rotatable = new Moveable(document.body, {
    target: document.querySelector(".rotatable"),
    rotatable: true,
}).on("rotate", e => {
    console.log(e.dist);
    e.target.style.transform = e.transform;
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".rotatable")}
        rotatable={true}
        onRotate={e => {
            console.log(e.dist);
            e.target.style.transform = e.transform;
        }}
    />
);
        `,
    },
};
