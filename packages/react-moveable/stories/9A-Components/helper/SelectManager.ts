import { deepFlat, isArray } from "@daybrush/utils";
import { MoveableTargetGroupsType } from "src/react-moveable";
import { GroupArrayChild } from "./group";

export class SelectManager {
    private _targets!: MoveableTargetGroupsType;
    constructor(
        private _root: GroupArrayChild,
        targets: MoveableTargetGroupsType,
        private _added: Array<HTMLElement | SVGElement> = [],
        private _removed: Array<HTMLElement | SVGElement>  = [],
    ) {
        this._targets = [...targets];
    }
    public selectNextChild(target: HTMLElement | SVGElement) {
        const root = this._root;
        const nextChild = root.findNextChild(target, this._targets);
        const targetChild = root.map.get(target);

        if (nextChild) {
            this._targets = [nextChild.toTargetGroups()];
        } else if (targetChild) {
            this._targets = [target];
        } else {
            this._targets = [];
        }
    }
    public selectSingleTargets() {
        const removed = this._removed;
        const added = this._added;
        const nextTargets = this._targets;

        // group can't be added, removed.
        removed.forEach(element => {
            const index = nextTargets.indexOf(element);

            if (index > -1) {
                nextTargets.splice(index, 1);
            }
        });

        // Targets can be added one by one
        added.forEach(element => {
            nextTargets.push(element);
        });
    }
    public selectCompletedTargets(continueSelect?: boolean) {
        const root = this._root;
        const removed = this._removed;
        const added = this._added;
        const nextTargets = this._targets;
        const startSelected = deepFlat(nextTargets);
        // group can be added, removed.
        removed.forEach(element => {
            // Single Target
            const index = nextTargets.indexOf(element);

            if (index > -1) {
                // single target or group
                nextTargets.splice(index, 1);
                return;
            }

            // Group Target
            const removedChild = continueSelect
                // Finds the nearest child for element and nextTargets.
                ? root.findNextChild(element, nextTargets)
                // Find the nearest exact child for element, all removed and nextTargets.
                : root.findNextExactChild(element, removed, nextTargets);

            if (removedChild) {
                const groupIndex = nextTargets.findIndex(target => {
                    return isArray(target) && removedChild.compare(target);
                });

                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
            }
        });

        added.forEach(element => {
            const pureChild = root.findNextPureChild(element, startSelected);

            if (pureChild) {
                nextTargets.push(pureChild.toTargetGroups());
            } else {
                nextTargets.push(element);
            }
        });
    }
    public selectSameDepthTargets() {
        const root = this._root;
        const removed = this._removed;
        const added = this._added;
        const nextTargets = this._targets;
        const commonParent = root.findCommonParent(nextTargets);

        // if (!sameDepthGroups || sameDepthGroups === multipleGroups) {
        removed.forEach(element => {
            // Single Target
            const index = nextTargets.indexOf(element);

            if (index > -1) {
                // single target or group
                nextTargets.splice(index, 1);
                return;
            }
            const removedChild = commonParent.findNextExactChild(element, removed, nextTargets);

            if (removedChild) {
                const groupIndex = nextTargets.findIndex(target => {
                    return isArray(target) && removedChild.compare(target);
                });

                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
            }
        });
        const children = commonParent.groupByPerfect(added);

        children.forEach(child => {
            if (child.type === "single") {
                nextTargets.push(child.value);
            } else {
                const groupIndex = nextTargets.findIndex(target => {
                    return isArray(target) && child.compare(target, 1);
                });

                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
                nextTargets.push(child.toTargetGroups());
            }
        });
    }
    public getTargets() {
        return this._targets;
    }
    public flat() {
        return deepFlat(this._targets);
    }
}
