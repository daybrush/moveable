import * as React from "react";
import { MoveableProps, Able, MoveableInterface } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./ables/consts";
import MoveableGroup from "./MoveableGroup";
import { ref, withMethods } from "framework-utils";
import { isArray } from "@daybrush/utils";
import Groupable from "./ables/Groupable";
import { METHODS } from "./consts";

export default class Moveable<T = {}> extends React.PureComponent<MoveableProps & T> {
    @withMethods(METHODS)
    public moveable!: MoveableManager<MoveableProps> | MoveableGroup;

    public render() {
        const props = this.props;
        const ables: Able[] = props.ables as Able[] || [];
        const target = this.props.target || this.props.targets;
        const isArr = isArray(target);
        const isGroup = isArr && (target as any[]).length > 1;

        if (isGroup) {
            const nextProps = {
                ...this.props,
                target: null,
                targets: target as any[],
                ables: [...MOVEABLE_ABLES, Groupable, ...ables],
            };
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...nextProps} />;
        } else {
            const moveableTarget = isArr ? (target as any[])[0] : target;

            return <MoveableManager<MoveableProps> key="single" ref={ref(this, "moveable")}
                {...{ ...this.props, target: moveableTarget, ables: [...MOVEABLE_ABLES, ...ables] }} />;
        }
    }
}
export default interface Moveable<T = {}> extends React.PureComponent<MoveableProps & T>, MoveableInterface {
    setState(state: any, callback?: () => any): any;
}
