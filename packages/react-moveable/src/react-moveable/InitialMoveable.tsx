import * as React from "react";
import {
    Able, MoveableInterface, GroupableProps, MoveableDefaultProps,
    IndividualGroupableProps, MoveableManagerInterface,
} from "./types";
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
import IndividualGroupable from "./ables/IndividualGroupable";
import MoveableIndividualGroup from "./MoveableIndividualGroup";


export class InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & IndividualGroupableProps & T> {
    public static defaultAbles: Able[] = [];
    public static customStyledMap: Record<string, any> = {};
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

        return [Default, Groupable, IndividualGroupable, DragArea, ...this.defaultAbles];
    }
    @withMethods(MOVEABLE_METHODS)
    public moveable!: MoveableManager | MoveableGroup | MoveableIndividualGroup;
    public refTargets: Array<HTMLElement | SVGElement | string | undefined | null> = [];
    public selectorMap: IObject<Array<HTMLElement | SVGElement>> = {};
    public render() {
        const moveableContructor = (this.constructor as typeof InitialMoveable);

        if (!moveableContructor.defaultStyled) {
            moveableContructor.makeStyled();
        }
        const {
            ables: userAbles,
            props: userProps,
            ...props
        } = this.props;
        const refTargets = getRefTargets((props.target || props.targets) as any);
        const elementTargets = getElementTargets(refTargets, this.selectorMap);

        this.refTargets = refTargets;

        const isGroup = elementTargets.length > 1;
        const totalAbles = moveableContructor.getTotalAbles();
        const ables = [
            ...totalAbles,
            ...(userAbles as any || []),
        ];
        const nextProps = {
            ...props,
            ...(userProps || {}),
            ables,
            cssStyled: moveableContructor.defaultStyled,
            customStyledMap: moveableContructor.customStyledMap,
        };

        if (isGroup) {
            if (props.individualGroupable) {
                return <MoveableIndividualGroup key="individual-group" ref={ref(this, "moveable")}
                    {...nextProps}
                    target={null}
                    targets={elementTargets} />;
            }
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...nextProps}
                target={null}
                targets={elementTargets}  />;
        } else {
            return <MoveableManager<any> key="single" ref={ref(this, "moveable")}
                {...nextProps}
                target={elementTargets[0]} />;
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
    public getManager(): MoveableManagerInterface<any, any> {
        return this.moveable;
    }
}
export interface InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & IndividualGroupableProps & T>,
    MoveableInterface {
    setState(state: any, callback?: () => any): any;
    forceUpdate(state?: any, callback?: () => any): any;
}
