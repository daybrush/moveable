import * as React from "react";
import { Able, MoveableInterface, GroupableProps, MoveableDefaultProps } from "./types";
import MoveableManager from "./MoveableManager";
import MoveableGroup from "./MoveableGroup";
import { ref, withMethods, prefixCSS } from "framework-utils";
import { getKeys, IObject, isString } from "@daybrush/utils";
import { MOVEABLE_METHODS, PREFIX, MOVEABLE_CSS } from "./consts";
import Default from "./ables/Default";
import Groupable from "./ables/Groupable";
import DragArea from "./ables/DragArea";
import styled from "react-css-styled";
import { getRefTargets, getElementTargets } from "./utils";

export class InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & T> {
    public static defaultAbles: Able[] = [];
    public static defaultStyled: any = null;
    public static makeStyled() {
        const cssMap: IObject<boolean> = {};

        const ables = this.getTotalAbles();
        ables.forEach(({ css }: Able) => {
            if (!css) {
                return;
            }
            css.forEach(text => {
                cssMap[text] = true;
            });
        });
        const style = getKeys(cssMap).join("\n");

        this.defaultStyled = styled("div", prefixCSS(PREFIX, MOVEABLE_CSS + style));
    }
    public static getTotalAbles(): Able[] {

        return [Default, Groupable, DragArea, ...this.defaultAbles];
    }
    @withMethods(MOVEABLE_METHODS)
    public moveable!: MoveableManager | MoveableGroup;
    public refTargets: Array<HTMLElement | SVGElement | string | undefined | null> = [];
    public selectorMap: IObject<Array<HTMLElement | SVGElement>> = {};
    public render() {
        const moveableContructor = (this.constructor as typeof InitialMoveable);

        if (!moveableContructor.defaultStyled) {
            moveableContructor.makeStyled();
        }
        const refTargets = getRefTargets((this.props.target || this.props.targets) as any);
        const elementTargets = getElementTargets(refTargets, this.selectorMap);

        this.refTargets = refTargets;

        const isGroup = elementTargets.length > 1;
        const totalAbles = moveableContructor.getTotalAbles();
        const userAbles = this.props.ables! || [];
        const ables = [
            ...totalAbles,
            ...userAbles,
        ];

        if (isGroup) {
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                cssStyled={moveableContructor.defaultStyled}
                {...this.props}
                target={null}
                targets={elementTargets}
                ables={ables} />;
        } else {
            return <MoveableManager<any> key="single" ref={ref(this, "moveable")}
                cssStyled={moveableContructor.defaultStyled}
                {...this.props}
                target={elementTargets[0]}
                ables={ables} />;
        }
    }
    public componentDidMount() {
        this.updateRefs();
    }
    public componentDidUpdate() {
        this.updateRefs();
    }
    public updateRefs(isReset?: boolean) {
        const refTargets = getRefTargets((this.props.target || this.props.targets) as any);
        let isUpdate = this.refTargets.some((target, i) => {
            const nextTarget = refTargets[i];

            if (!target && !nextTarget) {
                return false;
            } else if (target !== nextTarget) {
                return true;
            }
            return false;
        });
        const selectorMap = isReset ? {} : this.selectorMap;
        const nextSelectorMap: IObject<Array<HTMLElement | SVGElement>> = {};
        this.refTargets.forEach(target => {
            if (isString(target)) {
                if (!selectorMap[target]) {
                    isUpdate = true;
                    nextSelectorMap[target] = [].slice.call(document.querySelectorAll(target));
                } else {
                    nextSelectorMap[target] = selectorMap[target];
                }
            }
        });

        this.selectorMap = nextSelectorMap;

        if (isUpdate) {
            this.forceUpdate();
        }
    }
}
export interface InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & T>, MoveableInterface {
    setState(state: any, callback?: () => any): any;
}
