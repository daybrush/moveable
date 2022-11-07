import { ref, refs } from "framework-utils";
import * as React from "react";
import MoveableManager from "./MoveableManager";
import { GroupableProps, RectInfo } from "./types";
import { prefix } from "./utils";

/**
 * @namespace Moveable.IndividualGroup
 * @description Create targets individually, not as a group.Create targets individually, not as a group.
 */
class MoveableIndividualGroup extends MoveableManager<GroupableProps> {
    public moveables: MoveableManager[] = [];
    public render() {
        const props = this.props;
        const {
            cspNonce,
            cssStyled: ControlBoxElement,
            persistData,
        } = props;

        let targets: Array<HTMLElement | SVGElement | null | undefined> = props.targets || [];
        const length = targets.length;
        const canPersist = this.isUnmounted || !length;
        let persistDatChildren = persistData?.children ?? [];
        if (canPersist && !length && persistDatChildren.length) {
            targets = persistDatChildren.map(() => null);
        } else if (!canPersist) {
            persistDatChildren = [];
        }

        return <ControlBoxElement
            cspNonce={cspNonce}
            ref={ref(this, "controlBox")}
            className={prefix("control-box")}>
            {targets!.map((target, i) => {
                return <MoveableManager
                    key={"moveable" + i}
                    ref={refs(this, "moveables", i)}
                    {...this.props}
                    target={target}
                    wrapperMoveable={this}
                    persistData={persistDatChildren[i]}
                />;
            })}
        </ControlBoxElement>;
    }
    public componentDidUpdate() {}
    public getTargets() {
        return this.props.targets!;
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        this.moveables.forEach(moveable => {
            moveable.updateRect(type, isTarget, isSetState);
        });
    }
    public getRect(): RectInfo {
        return {
            ...super.getRect(),
            children: this.moveables.map(child => child.getRect()),
        };
    }
    public request() {
        return {
            request() {
                return this;
            },
            requestEnd() {
                return this;
            },
        };
    }
    public dragStart() {
        return this;
    }
    public hitTest() {
        return 0;
    }
    public isInside() {
        return false;
    }
    public isDragging() {
        return false;
    }
    public updateRenderPoses() { }
    public checkUpdate() { }
    public triggerEvent() { }
    protected updateAbles() { }
    protected _updateEvents() { }
    protected _updateObserver() {}
}

/**
 * Create targets individually, not as a group.
 * @name Moveable.IndividualGroup#individualGroupable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   individualGroupable: true,
 * });
 */
export default MoveableIndividualGroup;
