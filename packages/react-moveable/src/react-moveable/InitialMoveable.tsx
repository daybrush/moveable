import * as React from "react";
import {
    Able, MoveableInterface, GroupableProps, MoveableDefaultProps,
    IndividualGroupableProps, MoveableManagerInterface, MoveableRefTargetsResultType, MoveableTargetGroupsType,
} from "./types";
import MoveableManager from "./MoveableManager";
import MoveableGroup from "./MoveableGroup";
import { ref, withMethods, prefixCSS } from "framework-utils";
import { getKeys, IObject, isArray, isString } from "@daybrush/utils";
import { MOVEABLE_METHODS, PREFIX, MOVEABLE_CSS } from "./consts";
import Default from "./ables/Default";
import Groupable from "./ables/Groupable";
import DragArea from "./ables/DragArea";
import styled from "react-css-styled";
import { getRefTargets } from "./utils";
import IndividualGroupable from "./ables/IndividualGroupable";
import MoveableIndividualGroup from "./MoveableIndividualGroup";
import ChildrenDiffer from "@egjs/children-differ";


function getElementTargets(
    refTargets: MoveableRefTargetsResultType,
    selectorMap: IObject<Array<HTMLElement | SVGElement>>,
): Array<SVGElement | HTMLElement> {
    const elementTargets: Array<SVGElement | HTMLElement> = [];

    refTargets.forEach(target => {
        if (!target) {
            return;
        }
        if (isString(target)) {
            if (selectorMap[target]) {
                elementTargets.push(...selectorMap[target]);
            }
            return;
        }
        if (isArray(target)) {
            elementTargets.push(...getElementTargets(target, selectorMap));
        } else {
            elementTargets.push(target);
        }
    });

    return elementTargets;
}
function getTargetGroups(
    refTargets: MoveableRefTargetsResultType,
    selectorMap: IObject<Array<HTMLElement | SVGElement>>,
) {
    const targetGroups: MoveableTargetGroupsType = [];

    refTargets.forEach(target => {
        if (!target) {
            return;
        }
        if (isString(target)) {
            if (selectorMap[target]) {
                targetGroups.push(...selectorMap[target]);
            }
            return;
        }
        if (isArray(target)) {
            targetGroups.push(getTargetGroups(target, selectorMap));
        } else {
            targetGroups.push(target);
        }
    });

    return targetGroups;
}
function compareRefTargets(
    prevRefTargets: MoveableRefTargetsResultType,
    nextRefTargets: MoveableRefTargetsResultType,
): boolean {
    return (prevRefTargets.length !== nextRefTargets.length) || prevRefTargets.some((target, i) => {
        const nextTarget = nextRefTargets[i];

        if (!target && !nextTarget) {
            return false;
        } else if (target != nextTarget) {
            if (isArray(target) && isArray(nextTarget)) {
                return compareRefTargets(target, nextTarget);
            }
            return true;
        }
        return false;
    });
}

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
    public refTargets: MoveableRefTargetsResultType = [];
    public selectorMap: IObject<Array<HTMLElement | SVGElement>> = {};
    private _differ: ChildrenDiffer<HTMLElement | SVGElement> = new ChildrenDiffer();
    private _elementTargets: Array<HTMLElement | SVGElement> = [];
    private _onChangetarget: (() => void) | null = null;
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
        const refTargets = this._updateRefs(true);
        const elementTargets = getElementTargets(refTargets, this.selectorMap);

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

        this._elementTargets = elementTargets;
        if (isGroup) {
            if (props.individualGroupable) {
                return <MoveableIndividualGroup key="individual-group" ref={ref(this, "moveable")}
                    {...nextProps}
                    target={null}
                    targets={elementTargets}
                />;
            }
            const targetGroups = getTargetGroups(refTargets, this.selectorMap);


            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...nextProps}
                target={null}
                targets={elementTargets}
                targetGroups={targetGroups}
            />;
        } else {
            return <MoveableManager<any> key="single" ref={ref(this, "moveable")}
                {...nextProps}
                target={elementTargets[0]} />;
        }
    }
    public componentDidMount() {
        this._updateRefs();
    }
    public componentDidUpdate() {
        const { added, removed } = this._differ.update(this._elementTargets);
        const isTargetChanged = added.length || removed.length;

        if (isTargetChanged && this._onChangetarget) {
            this._onChangetarget();
        }

        this._updateRefs();
    }
    public componentWillUnmount() {
        this.selectorMap = {};
        this.refTargets = [];
    }
    /**
     * If the element list corresponding to the selector among the targets is changed, it is updated.
     * @method Moveable#updateSelectors
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body, {
     *    target: ".target",
     * });
     *
     * moveable.updateSelectors();
     */
    public updateSelectors() {
        this.selectorMap = {};
        this.refTargets = [];
        this.forceUpdate();
    }
    /**
     * User changes target and waits for target to change.
     * @method Moveable#waitToChangeTarget
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * document.querySelector(".target").addEventListener("mousedown", e => {
     *   moveable.waitToChangeTarget().then(() => {
     *      moveable.dragStart(e.currentTarget);
     *   });
     *   moveable.target = e.currentTarget;
     * });
     */
    public waitToChangeTarget(): Promise<void> {
        // let resolvePromise: (e: OnChangeTarget) => void;

        // this._onChangetarget = () => {
        //     this._onChangetarget = null;
        //     resolvePromise({
        //         moveable: this.getManager(),
        //         targets: this._elementTargets,
        //     });
        // };

        // return new Promise<OnChangeTarget>(resolve => {
        //     resolvePromise = resolve;
        // });
        let resolvePromise: () => void;

        this._onChangetarget = () => {
            this._onChangetarget = null;
            resolvePromise();
        };

        return new Promise(resolve => {
            resolvePromise = resolve;
        });
    }
    public getManager(): MoveableManagerInterface<any, any> {
        return this.moveable;
    }
    private _updateRefs(isRender?: boolean) {
        const prevRefTargets = this.refTargets;
        const nextRefTargets = getRefTargets((this.props.target || this.props.targets) as any);
        const isBrowser = typeof document !== "undefined";

        let isUpdate = compareRefTargets(prevRefTargets, nextRefTargets);
        const selectorMap = this.selectorMap;
        const nextSelectorMap: IObject<Array<HTMLElement | SVGElement>> = {};

        this.refTargets.forEach(function updateSelectorMap(target) {
            if (isString(target)) {
                const selectorTarget = selectorMap[target];

                if (selectorTarget) {
                    nextSelectorMap[target] = selectorMap[target];
                } else if (isBrowser) {
                    isUpdate = true;
                    nextSelectorMap[target] = [].slice.call(document.querySelectorAll(target));
                }
            } else if (isArray(target)) {
                target.forEach(updateSelectorMap);
            }
        });

        this.refTargets = nextRefTargets;
        this.selectorMap = nextSelectorMap;

        if (!isRender && isUpdate) {
            this.forceUpdate();
        }
        return nextRefTargets;
    }
}
export interface InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & IndividualGroupableProps & T>,
    MoveableInterface {
    setState(state: any, callback?: () => any): any;
    forceUpdate(callback?: () => any): any;
}
