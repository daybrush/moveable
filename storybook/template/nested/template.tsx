import * as React from "react";
import NESTED_CSS from "!!raw-loader!./nested.css";
import { BASIC_CSS_TEMPLATE } from "../basic/template";
export const NESTED_HTML_TEMPLATE = `
<div class="container">
    <div class="nested">
        No Transform
        <div class="nested scale">
            scale(1.2, 1.2)
            <div class="nested rotate">
                rotate(30deg)
                <div class="target">Target</div>
            </div>
        </div>
    </div>
</div>
`;
export const NESTED_REACT_MARKUP_TEMPLATE = `
        <div className="nested">
            No Transform
            <div className="nested scale">
                scale(1.2, 1.2)
                <div className="nested rotate">
                    rotate(30deg)
                    <div className="target">Target</div>
                </div>
            </div>
        </div>`;
export const NESTED_ANGULAR_MARKUP_TEMPLATE = `
<div class="nested">
    No Transform
    <div class="nested scale">
        scale(1.2, 1.2)
        <div class="nested rotate">
            rotate(30deg)
            <div class="target" #target>Target</div>
        </div>
    </div>
</div>`;
export const NESTED_SVELTE_MARKUP_TEMPLATE = `
<div class="nested">
    No Transform
    <div class="nested scale">
        scale(1.2, 1.2)
        <div class="nested rotate">
            rotate(30deg)
            <div class="target" bind:this={target}>Target</div>
        </div>
    </div>
</div>`;

export const NESTED_JSX = <div className="container">
    <div className="nested">
        No Transform
    <div className="nested scale">
            scale(1.2, 1.2)
        <div className="nested rotate">
                rotate(30deg)
            <div className="target">Target</div>
            </div>
        </div>
    </div>
</div>;

export const NESTED_CSS_TEMPLATE = NESTED_CSS + BASIC_CSS_TEMPLATE;
