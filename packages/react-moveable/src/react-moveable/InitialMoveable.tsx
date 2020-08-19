import * as React from "react";
import { Able, MoveableInterface, GroupableProps, MoveableDefaultProps } from "./types";
import MoveableManager from "./MoveableManager";
import MoveableGroup from "./MoveableGroup";
import { ref, withMethods, prefixCSS } from "framework-utils";
import { isArray, getKeys, IObject } from "@daybrush/utils";
import { MOVEABLE_METHODS, PREFIX, MOVEABLE_CSS } from "./consts";
import Default from "./ables/Default";
import Groupable from "./ables/Groupable";
import DragArea from "./ables/DragArea";
import styled from "react-css-styled";

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

    public render() {
        const moveableContructor = (this.constructor as typeof InitialMoveable);

        if (!moveableContructor.defaultStyled) {
            moveableContructor.makeStyled();
        }
        const target = this.props.target || this.props.targets;
        const isArr = isArray(target);
        const isGroup = isArr && (target as any[]).length > 1;
        const totalAbles = moveableContructor.getTotalAbles();
        const userAbles = this.props.ables! || [];
        const ables = [
            ...totalAbles,
            ...userAbles,
        ];

        console.log(moveableContructor.defaultStyled);
        if (isGroup) {
            const nextProps = {
                ...this.props,
                target: null,
                targets: target as any[],
                ables,
            } as any;
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                cssStyled={moveableContructor.defaultStyled}
                {...nextProps} />;
        } else {
            const moveableTarget = isArr ? (target as any[])[0] : target;

            return <MoveableManager<any> key="single" ref={ref(this, "moveable")}
                cssStyled={moveableContructor.defaultStyled}
                {...{ ...this.props, target: moveableTarget, ables }} />;
        }
    }
}
export interface InitialMoveable<T = {}>
    extends React.PureComponent<MoveableDefaultProps & GroupableProps & T>, MoveableInterface {
    setState(state: any, callback?: () => any): any;
}
