import { deepFlat, isArray } from "@daybrush/utils";
import { GroupArrayChild, GroupSingleChild } from "./groups";
import { TargetGroupsType } from "./types";

function createGroupChildren(
    targetGroups: TargetGroupsType,
    parent: GroupArrayChild,
) {
    const {
        value,
        map,
    } = parent;
    targetGroups.forEach(child => {
        if (isArray(child)) {
            const group = new GroupArrayChild(parent);

            group.depth = parent.depth + 1;
            value.push(group);

            createGroupChildren(child, group);
        } else {
            const single = new GroupSingleChild(parent, child);

            single.depth = parent.depth + 1;
            value.push(single);
            map.set(child, single);
        }
    });

    value.forEach(child => {
        if (child.type === "single") {
            map.set(child.value, child);
        } else {
            child.map.forEach((nextChild, element) => {
                map.set(element, nextChild);
            });
        }
    });
    return parent;
}

export class GroupManager extends GroupArrayChild {
    public type: "root" = "root";
    constructor(
        targetGroups: TargetGroupsType,
        targets?: Array<HTMLElement | SVGElement>,
    ) {
        super();
        this.set(targetGroups, targets);
    }
    public set(
        targetGroups: TargetGroupsType,
        targets: Array<HTMLElement | SVGElement> = [],
    ) {
        this.map = new Map();
        this.value = [];

        const map = this.map;
        const value = this.value;

        createGroupChildren(targetGroups, this);

        targets.forEach(target => {
            if (map.has(target)) {
                return;
            }
            const single = new GroupSingleChild(this, target);

            single.depth = 1;
            value.push(single);
            map.set(target, single);
        });
    }
    public selectNextChild(targets: TargetGroupsType, target: HTMLElement | SVGElement) {
        let nextTargets = [...targets];
        const root = this;
        const nextChild = root.findNextChild(target, nextTargets);
        const targetChild = root.map.get(target);

        if (nextChild) {
            nextTargets = [nextChild.toTargetGroups()];
        } else if (targetChild) {
            nextTargets = [target];
        } else {
            nextTargets = [];
        }

        return nextTargets;
    }
    public selectSingleTargets(
        targets: TargetGroupsType,
        added: Array<HTMLElement | SVGElement>,
        removed: Array<HTMLElement | SVGElement>,
    ) {
        const nextTargets = [...targets];

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

        return nextTargets;
    }
    public selectCompletedTargets(
        targets: TargetGroupsType,
        added: Array<HTMLElement | SVGElement>,
        removed: Array<HTMLElement | SVGElement>,
        continueSelect?: boolean,
    ) {
        const nextTargets = [...targets];
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
                ? this.findNextChild(element, nextTargets)
                // Find the nearest exact child for element, all removed and nextTargets.
                : this.findNextExactChild(element, removed, nextTargets);

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
            const pureChild = this.findNextPureChild(element, startSelected);

            if (pureChild) {
                nextTargets.push(pureChild.toTargetGroups());
            } else {
                nextTargets.push(element);
            }
        });

        return nextTargets;
    }
    public selectSameDepthTargets(
        targets: TargetGroupsType,
        added: Array<HTMLElement | SVGElement>,
        removed: Array<HTMLElement | SVGElement>,
    ) {
        const nextTargets = [...targets];
        const commonParent = this.findCommonParent(nextTargets);

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

        return nextTargets;
    }
}
