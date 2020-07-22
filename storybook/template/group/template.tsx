import { BASIC_CSS_TEMPLATE } from "../basic/template";

export const GROUP_HTML_TEMPLATE = `
<div class="container">
    <div class="target target1">Target1</div>
    <div class="target target2">Target2</div>
    <div class="target target2">Target3</div>
</div>
`;
export const GROUP_REACT_MARKUP_TEMPLATE = `
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3">Target3</div>`;
export const GROUP_ANGULAR_MARKUP_TEMPLATE = `
<div class="target target1">Target1</div>
<div class="target target2">Target2</div>
<div class="target target3">Target3</div>`;
export const GROUP_SVELTE_MARKUP_TEMPLATE = `
<div class="target target1">Target1</div>
<div class="target target2">Target2</div>
<div class="target target3">Target3</div>`;

import GROUP_CSS from "!!raw-loader!./group.css";

export const GROUP_CSS_TEMPLATE =  BASIC_CSS_TEMPLATE + "\n" + GROUP_CSS;
