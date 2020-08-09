
export default {
    name: "Renderable",
    props: {
    } as const,
    events: {
        onRenderStart: "RenderStart",
        onRender: "Render",
        onRenderEnd: "RenderEnd",
        onRenderGroupStart: "RenderGroupStart",
        onRenderGroup: "RenderGroup",
        onRenderGroupEnd: "RenderGroupEnd",
    } as const,
} as const;
