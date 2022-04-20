export const BASIC_HTML_TEMPLATE = `
<div class="container">
    <div class="target">Target</div>
</div>
`;
export const BASIC_REACT_MARKUP_TEMPLATE = `
        <div className="target">Target</div>`;
export const BASIC_ANGULAR_MARKUP_TEMPLATE = `
<div class="target" #target>Target</div>`;
export const BASIC_SVELTE_MARKUP_TEMPLATE = `
<div class="target" bind:this={target}>Target</div>`;

export {
    default as BASIC_CSS_TEMPLATE,
} from "!!raw-loader!./basic.css";
