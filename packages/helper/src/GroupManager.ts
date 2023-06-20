/* eslint-disable no-cond-assign */
import { deepFlat, isArray } from "@daybrush/utils";
import { GroupArrayChild, GroupSingleChild } from "./groups";
import { GroupChild, TargetGroupsObject, TargetGroupsType, TargetList } from "./types";


export function toTargetList(raw: GroupChild[]): TargetList {
    function targets(childs: GroupChild[] = []) {
        const arr: TargetGroupsType = [];

        childs.forEach((child) => {
            if (child.type === "single") {
                arr.push(child.value);
            } else {
                arr.push(targets(child.value));
            }
        });

        return arr;
    }

    return {
        raw: () => raw,
        targets() {
            return targets(this.raw());
        },
        flatten() {
            return deepFlat(this.targets());
        },
    };
}

export class GroupManager extends GroupArrayChild {
    public type = "root" as const;
    private _targets:  Array<HTMLElement | SVGElement> = [];

    constructor(
        targetGroups: TargetGroupsType,
        targets?: Array<HTMLElement | SVGElement>,
    ) {
        super();
        this.set(targetGroups, targets);
    }
    public set(
        targetGroups: TargetGroupsObject,
        targets: Array<HTMLElement | SVGElement> = [],
    ) {
        this.map = new Map();
        this.value = [];

        const map = this.map;
        const value = this.value;

        this.add(targetGroups);
        targets.forEach(target => {
            if (map.has(target)) {
                return;
            }
            const single = new GroupSingleChild(this, target);

            single.depth = 1;
            value.push(single);
            map.set(target, single);
        });
        this._targets = targets;
    }
    public selectSubChilds(targets: TargetGroupsType, target: HTMLElement | SVGElement) {
        const root = this;
        const nextChild = root.findNextChild(target, targets, false);
        const targetChild = root.map.get(target);

        let nextChilds: GroupChild[] = [];

        if (nextChild) {
            nextChilds = [nextChild];
        } else if (targetChild) {
            nextChilds = [targetChild];
        } else {
            nextChilds = [];
        }

        return toTargetList(nextChilds);
    }
    public selectSingleChilds(
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

        return toTargetList(this.toChilds(nextTargets));
    }
    public selectCompletedChilds(
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
            const parentGroup = this._findParentGroup(element, startSelected);

            const nextChild = parentGroup.findContainedChild(element);

            if (nextChild?.type === "group") {
                nextTargets.push(nextChild.toTargetGroups());
                return;
            }
            nextTargets.push(element);
        });
        return toTargetList(this.toChilds(nextTargets));
    }
    public selectSameDepthChilds(
        targets: TargetGroupsType,
        added: Array<HTMLElement | SVGElement>,
        removed: Array<HTMLElement | SVGElement>,
        continueSelect?: boolean,
    ) {
        const nextTargets = [...targets];
        const commonParent = this.findCommonParent(nextTargets);

        removed.forEach(element => {
            // Single Target
            const index = nextTargets.indexOf(element);

            if (index > -1) {
                // single target or group
                nextTargets.splice(index, 1);
                return;
            }
            const removedChild = continueSelect
                // Find the nearest exact child for element, all removed and nextTargets.
                ? commonParent.findNextExactChild(element, removed, nextTargets)
                // Finds the nearest child for element and nextTargets.
                : commonParent.findNextChild(element, nextTargets, true);

            if (removedChild) {
                const groupIndex = nextTargets.findIndex(target => {
                    return isArray(target) && removedChild.compare(target);
                });

                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
            }
        });
        const addedChildren = commonParent.groupByPerfect(added);

        addedChildren.forEach(child => {
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
        return toTargetList(this.toChilds(nextTargets));
    }
    public toChilds(targets: TargetGroupsType): GroupChild[] {
        const childs: GroupChild[] = [];

        targets.forEach(target => {
            if (isArray(target)) {
                const arrayChild = this.findArrayChild(target);

                if (arrayChild) {
                    childs.push(arrayChild);
                }
            } else {
                const single = this.map.get(target);

                if (single) {
                    childs.push(single);
                } else {
                    childs.push(new GroupSingleChild(this, target));
                }
            }
        });

        return childs;
    }
    public toSingleChild(element: HTMLElement | SVGElement, isAuto: true): GroupSingleChild;
    public toSingleChild(element: HTMLElement | SVGElement, isAuto?: boolean): GroupSingleChild | undefined;
    public toSingleChild(element: HTMLElement | SVGElement, isAuto?: boolean): GroupSingleChild | undefined {
        const value = this.map.get(element);

        if (isAuto) {
            return value || new GroupSingleChild(this, element);
        }
        return value;
    }
    public findArrayChildById(id: string): GroupArrayChild | null {
        let value: GroupArrayChild | null = null;

        this.value.some(function find(child: GroupChild) {
            if (child.type !== "single") {
                if (child.id === id) {
                    value = child;
                    return true;
                } else {
                    return child.value.some(find);
                }
            }
        });

        return value;
    }
    public group(targets: TargetGroupsType, flatten?: boolean): TargetGroupsType | null {
        const commonParent = this.findCommonParent(targets);
        const groupChilds = targets.map(target => {
            if (isArray(target)) {
                return this.findArrayChild(target);
            }
            return this.toSingleChild(target);
        });
        const isGroupable = groupChilds.every(child => child?.parent === commonParent);

        if (!isGroupable) {
            return null;
        }
        const group = new GroupArrayChild(commonParent);
        const nextChilds = commonParent.value.filter(target => groupChilds.indexOf(target) === -1);

        nextChilds.unshift(group);

        group.add(flatten ? deepFlat(targets) : targets);
        commonParent.value = nextChilds;

        this.set(this.toTargetGroups(), this._targets);

        return group.toTargetGroups();
    }
    public ungroup(targets: TargetGroupsType) {
        if (targets.length === 1 && isArray(targets[0])) {
            targets = targets[0];
        }
        const commonParent = this.findCommonParent(targets);
        const groupChilds = targets.map(target => {
            if (isArray(target)) {
                return this.findArrayChild(target);
            }
            return this.toSingleChild(target);
        });
        const isGroupable = commonParent.value.every(child => groupChilds.indexOf(child) > -1);

        if (!isGroupable || commonParent === this) {
            // has no group
            return null;
        }

        const parent = commonParent.parent;

        if (!parent) {
            return null;
        }
        const nextChilds = parent.value.filter(target => target !== commonParent);

        nextChilds.push(...commonParent.value);
        parent.value = nextChilds;

        this.set(this.toTargetGroups(), this._targets);
        return commonParent.toTargetGroups();
    }
    protected _findParentGroup(
        element: HTMLElement | SVGElement,
        range: Array<HTMLElement | SVGElement>,
    ) {
        if (!range.length) {
            return this;
        }
        const single = this.map.get(element);

        if (!single) {
            return this;
        }
        let parent: GroupArrayChild | undefined = single.parent;

        while (parent) {
            if (range.some(element => parent!.contains(element))) {
                return parent;
            }
            parent = parent.parent;
        }
        return this;
    }
}
