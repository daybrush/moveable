import * as React from "react";
import {
    Able, MoveableInterface, GroupableProps, MoveableDefaultProps,
    IndividualGroupableProps, MoveableManagerInterface, MoveableRefTargetsResultType,
    MoveableTargetGroupsType, BeforeRenderableProps, RenderableProps, MoveableManagerState,
} from "./types";
import MoveableManager from "./MoveableManager";
import MoveableGroup from "./MoveableGroup";
import { ref, withMethods, prefixCSS } from "framework-utils";
import { find, getKeys, IObject, isArray, isString } from "@daybrush/utils";
import { MOVEABLE_METHODS, PREFIX, MOVEABLE_CSS } from "./consts";
import Default from "./ables/Default";
import Groupable from "./ables/Groupable";
import DragArea from "./ables/DragArea";
import { styled } from "react-css-styled";
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

type DefaultAbles = GroupableProps & IndividualGroupableProps & BeforeRenderableProps & RenderableProps;

export class InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & DefaultAbles & T> {
    public static defaultAbles: readonly Able<any>[] = [];
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
    private _tmpRefTargets: MoveableRefTargetsResultType = [];
    private _tmpSelectorMap: IObject<Array<HTMLElement | SVGElement>> = {};
    private _onChangeTargets: (() => void) | null = null;
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
        const [
            refTargets,
            nextSelectorMap,
        ] = this._updateRefs(true);
        const elementTargets = getElementTargets(refTargets, nextSelectorMap);

        let isGroup = elementTargets.length > 1;
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

        let firstRenderState: MoveableManagerState | null = null;
        const prevMoveable = this.moveable;


        const persistData = props.persistData;

        if (persistData?.children) {
            isGroup = true;
        }
        // Even one child is treated as a group if individualGroupable is enabled. #867
        if (props.individualGroupable) {
            return <MoveableIndividualGroup key="individual-group" ref={ref(this, "moveable")}
                {...nextProps}
                target={null}
                targets={elementTargets}
            />;
        }
        if (isGroup) {
            const targetGroups = getTargetGroups(refTargets, nextSelectorMap);

            // manager
            if (prevMoveable && !prevMoveable.props.groupable && !(prevMoveable.props as any).individualGroupable) {
                const target = prevMoveable.props.target!;

                if (target && elementTargets.indexOf(target) > -1) {
                    firstRenderState = { ...prevMoveable.state };
                }
            }

            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...nextProps}
                {...props.groupableProps ?? {}}
                target={null}
                targets={elementTargets}
                targetGroups={targetGroups}
                firstRenderState={firstRenderState}
            />;
        } else {
            const target = elementTargets[0];
            // manager
            if (prevMoveable && (prevMoveable.props.groupable || (prevMoveable.props as any).individualGroupable)) {
                const moveables = (prevMoveable as MoveableGroup | MoveableIndividualGroup).moveables || [];
                const prevTargetMoveable = find(moveables, mv => mv.props.target === target);

                if (prevTargetMoveable) {
                    firstRenderState = { ...prevTargetMoveable.state };
                }
            }

            return <MoveableManager<any> key="single" ref={ref(this, "moveable")}
                {...nextProps}
                target={target}
                firstRenderState={firstRenderState} />;
        }
    }
    public componentDidMount() {
        this._checkChangeTargets();
    }
    public componentDidUpdate() {
        this._checkChangeTargets();
    }
    public componentWillUnmount() {
        this.selectorMap = {};
        this.refTargets = [];
    }
    /**
     * Get targets set in moveable through target or targets of props.
     * @method Moveable#getTargets
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body, {
     *    target: [targetRef, ".target", document.querySelectorAll(".target")],
     * });
     *
     * console.log(moveable.getTargets());
     */
    public getTargets() {
        return this.moveable?.getTargets() ?? [];
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
        this._updateRefs();
    }
    /**
     * User changes target and waits for target to change.
     * @method Moveable#waitToChangeTarget
     * @story combination-with-other-components--components-selecto
     * @example
     * document.querySelector(".target").addEventListener("mousedown", e => {
     *   moveable.waitToChangeTarget().then(() => {
     *      moveable.dragStart(e.currentTarget);
     *   });
     *   moveable.target = e.currentTarget;
     * });
     */
    public waitToChangeTarget(): Promise<void> {
        // let resolvePromise: (e: OnChangeTarget) => void;

        // this._onChangeTargets = () => {
        //     this._onChangeTargets = null;
        //     resolvePromise({
        //         moveable: this.getManager(),
        //         targets: this._elementTargets,
        //     });
        // };

        // return new Promise<OnChangeTarget>(resolve => {
        //     resolvePromise = resolve;
        // });
        let resolvePromise: () => void;

        this._onChangeTargets = () => {
            this._onChangeTargets = null;
            resolvePromise();
        };

        return new Promise(resolve => {
            resolvePromise = resolve;
        });
    }
    public waitToChangeTargets(): Promise<void> {
        return this.waitToChangeTarget();
    }
    public getManager(): MoveableManagerInterface<any, any> {
        return this.moveable;
    }
    public getMoveables(): MoveableManagerInterface[] {
        return this.moveable.getMoveables();
    }
    public getDragElement(): HTMLElement | SVGElement | null | undefined {
        return this.moveable.getDragElement();
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

        this._tmpRefTargets = nextRefTargets;
        this._tmpSelectorMap = nextSelectorMap;

        return [
            nextRefTargets,
            nextSelectorMap,
            !isRender && isUpdate,
        ] as const;
    }
    private _checkChangeTargets() {
        this.refTargets = this._tmpRefTargets;
        this.selectorMap = this._tmpSelectorMap;

        const { added, removed } = this._differ.update(this._elementTargets);
        const isTargetChanged = added.length || removed.length;

        if (isTargetChanged) {
            this.props.onChangeTargets?.({
                moveable: this.moveable,
                targets: this._elementTargets,
            });
            this._onChangeTargets?.();
        }
        const [
            refTargets,
            selectorMap,
            isUpdate,
        ] = this._updateRefs();

        this.refTargets = refTargets;
        this.selectorMap = selectorMap;

        if (isUpdate) {
            this.forceUpdate();
        }
    }
}
export interface InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & DefaultAbles & T>,
    MoveableInterface {
    setState(state: any, callback?: () => any): any;
    forceUpdate(callback?: () => any): any;
}
