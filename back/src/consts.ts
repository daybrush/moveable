export const codes = {
    draggable: {
        vanilla: `
import Moveable from "moveable";

/* const translate = [0, 0]; */
const draggable = new Moveable(document.body, {
    target: document.querySelector(".draggable"),
    draggable: true,
    throttleDrag: 0,
}).on("drag", ({ target, left, top, beforeDelta }) => {
    target.style.left = left + "px";
    target.style.top = top + "px";

    /* translate[0] += beforeDelta[0]; */
    /* translate[1] += beforeDelta[1]; */
    /* target.style.transform
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
        onDrag={({ target, left, top, beforeDelta }) => {
            target.style.left = left + "px";
            target.style.top = top + "px";

            /* const translate = this.translate */
            /* translate[0] += beforeDelta[0]; */
            /* translate[1] += beforeDelta[1]; */
            /* target.style.transform
                = "translateX(" + translate[0] + "px) "
                + "translateY(" + translate[1] + "px)"; */
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [draggable]="true"
    [throttleDrag]="0"
    (drag)="onDrag($event)
    />
${"`"},
})
export class AppComponent {
    translate = [0, 0];
    onDrag({ target, left, top, beforeDelta }) {
        target.style.left = left + "px";
        target.style.top = top + "px";

        /* const translate = this.translate */
        /* translate[0] += beforeDelta[0]; */
        /* translate[1] += beforeDelta[1]; */
        /* target.style.transform
            = "translateX(" + translate[0] + "px) "
            + "translateY(" + translate[1] + "px)"; */
    }
}
`,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let translate = [0, 0];
    let target;
</script>
<div class="target draggable" bind:this={target}>Draggable</div>
<Moveable
    target={target}
    draggable={true}
    throttleDrag={0}
    on:drag={({ detail }) => {
        target.style.left = detail.left + "px";
        target.style.top = detail.top + "px";
    }}
/>`,
    },
    resizable: {
        vanilla: `
import Moveable from "moveable";

const resizable = new Moveable(document.body, {
    target: document.querySelector(".resizable"),
    resizable: true,
    throttleResize: 0,
    keepRatio: true,
}).on("resize", ({ target, width, height, dist }) => {
    console.log(width, height, dist);
    target.style.width = width + "px";
    target.style.height = height + "px";
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
        onResize={({ target, width, height, dist }) => {
            console.log(width, height, dist);
            target.style.width = width + "px";
            target.style.height = height + "px";
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [resizable]="true"
    [throttleResize]="0"
    [keepRatio]="true"
    (resize)="onResize($event)
    />
${"`"},
})
export class AppComponent {
    onResize({ target, width, height, dist }) {
        console.log(width, height, dist);
        target.style.width = width + "px";
        target.style.height = height + "px";
    }
}
        `,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let translate = [0, 0];
    let target;
</script>
<div class="target resizable" bind:this={target}>Resizable</div>
<Moveable
    target={target}
    resizable={true}
    throttleResize={0}
    keepRatio={true}
    on:resize={({ detail }) => {
        const { target, width, height, dist } = detail;
        target.style.width = width + "px";
        target.style.height = height + "px";
    }}
/>`,
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
}).on("scale", ({ target, delta }) => {
    scale[0] *= delta[0];
    scale[1] *= delta[1];
    target.style.transform = "scale(" + scale[0] +  "," + scale[1] + ")";
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
        onScale={({ target, delta }) => {
            const scale = this.scale;
            scale[0] *= delta[0];
            scale[1] *= delta[1];
            target.style.transform
                = "scale(" + scale[0] +  "," + scale[1] + ")";
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [scalable]="true"
    [throttleScale]="0"
    [keepRatio]="true"
    (scale)="onScale($event)
    />
${"`"},
})
export class AppComponent {
    scale = [1, 1];
    onScale({ target, delta }) {
        const scale = this.scale;
        scale[0] *= delta[0];
        scale[1] *= delta[1];
        target.style.transform
            = "scale(" + scale[0] +  "," + scale[1] + ")";
    }
}
        `,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let scale = [1, 1];
    let target;
</script>
<div class="target scalable" bind:this={target}>Scalable</div>
<Moveable
    target={target}
    scalable={true}
    throttleScale={0}
    keepRatio={true}
    on:scale={({ detail: { target, delta }}) => {
        scale[0] *= delta[0];
        scale[1] *= delta[1];
        target.style.transform
            = "scale(" + scale[0] +  "," + scale[1] + ")";
    }}
/>`,
    },
    rotatable: {
        vanilla: `
import Moveable from "moveable";

let rotate = 0;

const rotatable = new Moveable(document.body, {
    target: document.querySelector(".rotatable"),
    rotatable: true,
    throttleRotate: 0,
}).on("rotate", ({ target, beforeDelta, delta }) => {
    rotate += delta;
    target.style.transform
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
        onRotate={({ target, beforeDelta, delta }) => {
            this.rotate += delta;
            target.style.transform
                = "rotate(" + this.rotate +  "deg)";
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [rotatable]="true"
    [throttleRotate]="0"
    [keepRatio]="true"
    (rotate)="onRotate($event)
    />
${"`"},
})
export class AppComponent {
    rotate = 0;
    onRotate({ target, delta }) {
        this.rotate += delta;
        target.style.transform
            = "rotate(" + this.rotate +  "deg)";
    }
}
        `,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let rotate = 0;
    let target;
</script>
<div class="target rotatable" bind:this={target}>Rotatable</div>
<Moveable
    target={target}
    rotatable={true}
    throttleRotate={0}
    on:rotate={({ detail }) => {
        const { target, beforeDelta, delta } = detail;
        rotate += delta;
        target.style.transform
            = "rotate(" + rotate +  "deg)";
    }}
/>`,
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
}).on("warp", ({ target, multiply, delta }) => {
    matrix = multiply(matrix, delta);
    target.style.transform
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
        onWarp={({ target, multiply, delta }) => {
            this.matrix = multiply(this.matrix, delta);
            target.style.transform
                = "matrix3d(" + matrix.join(",") +  ")";
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [warpable]="true"
    (warp)="onWarp($event)
    />
${"`"},
})
export class AppComponent {
    matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    onWarp({ target, dist }) {
        this.matrix = multiply(this.matrix, delta);
        target.style.transform
            = "matrix3d(" + matrix.join(",") +  ")";
    }
}
        `,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    let target;
</script>
<div class="target scalable" bind:this={target}>Scalable</div>
<Moveable
    target={target}
    warpable={true}
    on:warp={({ detail }) => {
        const { target, multiply, delta } = detail;
        matrix = multiply(matrix, delta);
        target.style.transform
            = "matrix3d(" + matrix.join(",") +  ")";
    }}
/>`,
    },
    pinchable: {
        vanilla: `
import Moveable from "moveable";
const scale = [1, 1];
let rotate = 0;

const pinchable = new Moveable(document.body, {
    target: document.querySelector(".pinchable"),
    pinchable: ["rotatable", "scalable"],
}).on("rotate", ({ target, beforeDelta }) => {
    rotate += beforeDelta;
    target.style.transform = "scale(" + scale.join(", ") + ") rotate(" + rotate + "deg)";
}).on("scale", ({ target, delta }) => {
    scale[0] *= delta[0];
    scale[1] *= delta[1];
    target.style.transform = "scale(" + scale.join(", ") + ") rotate(" + rotate + "deg)";
});`,
        react: `
import Moveable from "react-moveable";
this.scale = [1, 1];
this.rotate = 0;

return (
    <Moveable
        target={document.querySelector(".pinchable")}
        pinchable={["rotatable", "scalable"]},
        onRotate={({ target, beforeDelta }) => {
            this.rotate += beforeDelta;
            target.style.transform
                = "scale(" + this.scale.join(", ") + ") "
                + "rotate(" + this.rotate + "deg)";
        }}
        onScale={({ target, beforeDelta }) => {
            this.scale[0] *= delta[0];
            this.scale[1] *= delta[1];
            target.style.transform
                = "scale(" + this.scale.join(", ") + ") "
                + "rotate(" + this.rotate + "deg)";
        }}
    />
);`,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
    <div #target class="target">target</div>
    <ngx-moveable
        [target]="target"
        [pinchable]="['rotatable', 'scalable']"
        [rotate]="onRotate($event)"
        [scale]="onScale($event)"
/>
${"`"},
})
export class AppComponent {
    scale = [1, 1];
    rotate = 0;
    onRotate({ target, beforeDelta }) {
        this.rotate += beforeDelta;
        target.style.transform
            = "scale(" + this.scale.join(", ") + ") "
            + "rotate(" + this.rotate + "deg)";
    }
    onScale({ target, beforeDelta }) {
        this.scale[0] *= delta[0];
        this.scale[1] *= delta[1];
        target.style.transform
            = "scale(" + this.scale.join(", ") + ") "
            + "rotate(" + this.rotate + "deg)";
    }
}
`,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    let target;
</script>
<div class="target pinchable" bind:this={target}>Pinchable</div>
<Moveable
    target={target}
    pinchable={["rotatable", "scalable"]},
    on:rotate={({ detail: { target, beforeDelta }}) => {
        this.rotate += beforeDelta;
        target.style.transform
            = "scale(" + this.scale.join(", ") + ") "
            + "rotate(" + this.rotate + "deg)";
    }}
    on:scale={({ detail: { target, beforeDelta }}) => {
        this.scale[0] *= delta[0];
        this.scale[1] *= delta[1];
        target.style.transform
            = "scale(" + this.scale.join(", ") + ") "
            + "rotate(" + this.rotate + "deg)";
    }}
/>`,
    },
    snappable: {
        vanilla: `
import Moveable from "moveable";

const snappable = new Moveable(document.body, {
    target: document.querySelector(".snappable"),
    snappable: true,
    verticalGuidelines: [0, 150, 200],
    horizontalGuidelines: [0, 150, 200],
}).on("drag", ({ target, left, top }) => {
    target.style.left = left + "px";
    target.style.top = top + "px";
});
        `,
        react: `
import Moveable from "react-moveable";

return (
    <Moveable
        target={document.querySelector(".origin")}
        origin={true}
        snappable={true}
        verticalGuidelines={[0, 150, 200]}
        horizontalGuidelines={[0, 150, 200]}
        onDrag={({ target, left, top }) => {
            target.style.left = left + "px";
            target.style.top = top + "px";
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [snappable]="true"
    [verticalGuidelines]="[0, 150, 200]"
    [horizontalGuidelines]="[0, 150, 200]"
    />
${"`"},
})
export class AppComponent {
    onDrag({ target, left, top }) {
        target.style.left = left + "px";
        target.style.top = top + "px";
    }
}
`,
        svelte: `
<script>
    import Moveable from "svelte-moveable";

    let target;
</script>
<div class="target pinchable" bind:this={target}>Pinchable</div>
<Moveable
    target={target}
    origin={true}
    snappable={true}
    verticalGuidelines={[0, 150, 200]}
    horizontalGuidelines={[0, 150, 200]}
    on:drag={({ detail: { target, left, top }}) => {
        target.style.left = left + "px";
        target.style.top = top + "px";
    }}
/>`,
    },
    groupable: {
        vanilla: `
import Moveable from "moveable";
const poses = [
    [0, 0],
    [0, 0],
    [0, 0],
];
const target = [].slice.call(
    document.querySelectorAll(".target"),
);
const groupable = new Moveable(document.body, {
    target,
    draggable: true,
}).on("dragGroup", ({ events }) => {
    events.forEach(({ target, beforeDelta }, i) => {
        poses[i][0] += beforeDelta[0];
        poses[i][1] += beforeDelta[1];

        target.style.transform
            = "translate("
            + poses[i][0] + "px, "
            + poses[i][1] + "px)";
    });
});
        `,
        react: `
import Moveable from "react-moveable";

this.poses = [
    [0, 0],
    [0, 0],
    [0, 0],
];

const target = [].slice.call(
    document.querySelectorAll(".target"),
);
return (
    <Moveable
        target={target}
        draggable={true}
        onDragGroup={({ events }) => {
            events.forEach(({ target, beforeDelta }, i) => {
                this.poses[i][0] += beforeDelta[0];
                this.poses[i][1] += beforeDelta[1];

                target.style.transform
                    = "translate("
                    + this.poses[i][0] + "px, "
                    + this.poses[i][1] + "px)";
            });
        }}
    />
);
        `,
        angular: `
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: ${"`"}
<div #target1 class="target">target1</div>
<div #target2 class="target">target2</div>
<div #target3 class="target">target3</div>
<ngx-moveable
    [target]="[target1, target2, target3]"
    [draggable]="true"
    (dragGroup)="onDragGroup($event)
    />
${"`"},
})
export class AppComponent {
    poses = [
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    onDragGroup({ events }) {
        events.forEach(({ target, beforeDelta }, i) => {
            this.poses[i][0] += beforeDelta[0];
            this.poses[i][1] += beforeDelta[1];

            target.style.transform
                = "translate("
                + this.poses[i][0] + "px, "
                + this.poses[i][1] + "px)";
        });
    }
}
        `,
        svelte: `
<script>
    import Moveable from "svelte-moveable";
    import { onMount } from "svelte";
    let targets = [];
    let translates = [];

    onMount(() => {
        targets = [].slice.call(document.querySelectorAll(".target"));
        translates = targets.map(() => {
            return [0, 0];
        });
    });
</script>
<div class="target">Target1</div>
<div class="target">Target2</div>
<div class="target">Target3</div>
<Moveable
    target={targets}
    draggable={true}
    on:dragGroup={({ detail: { events }}) => {
        events.forEach(({ target, beforeDelta }, i) => {
            translates[i][0] += beforeDelta[0];
            translates[i][1] += beforeDelta[1];

            target.style.transform
                = "translate("
                + translates[i][0] + "px, "
                + translates[i][1] + "px)";
        });
    }}
/>`,
    },
};
