import { ref, refs } from "framework-utils";
import * as React from "react";
import MoveableManager from "./MoveableManager";
import { GroupableProps, IndividualGroupableProps, RectInfo } from "./types";
import { prefix } from "./utils";
import { setStoreCache } from "./store/Store";

/**
 * @namespace Moveable.IndividualGroup
 * @description Create targets individually, not as a group.Create targets individually, not as a group.
 */
class MoveableIndividualGroup extends MoveableManager<GroupableProps & IndividualGroupableProps> {
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
                const individualProps = props.individualGroupableProps?.(target, i) ?? {};
                return <MoveableManager
                    key={"moveable" + i}
                    ref={refs(this, "moveables", i)}
                    {...props}
                    {...individualProps}
                    target={target}
                    wrapperMoveable={this}
                    isWrapperMounted={this.isMoveableMounted}
                    persistData={persistDatChildren[i]}

                />;
            })}
        </ControlBoxElement>;
    }
    public componentDidMount() {}
    public componentDidUpdate() {}
    public getTargets() {
        return this.props.targets!;
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        setStoreCache(true);
        this.moveables.forEach(moveable => {
            moveable.updateRect(type, isTarget, isSetState);
        });
        setStoreCache();
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
