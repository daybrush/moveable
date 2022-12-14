import { deepFlat, isArray } from "@daybrush/utils";
import { GroupArrayChild, GroupSingleChild } from "./groups";
import { GroupChild, TargetGroupsObject, TargetGroupsType, TargetList } from "./types";


function createGroupChildren(
    targetGroups: TargetGroupsObject,
    parent: GroupArrayChild,
) {
    const {
        value,
        map,
    } = parent;
    targetGroups.forEach(child => {
        if ("groupId" in child) {
            const group = new GroupArrayChild(parent);

            group.id = child.groupId;
            group.depth = parent.depth + 1;
            value.push(group);

            createGroupChildren(child.children, group);
        } else if (isArray(child)) {
            const group = new GroupArrayChild(parent);

            group.depth = parent.depth + 1;
            value.push(group);

            createGroupChildren(child, group);
        } else {
            const element = "current" in child ? child.current : child;
            const single = new GroupSingleChild(parent, element!);

            single.depth = parent.depth + 1;
            value.push(single);
            map.set(element!, single);
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
    function flatten() {
        return deepFlat(targets(raw));
    }
    return {
        raw: () => raw,
        targets: () => targets(raw),
        flatten,

    };
}

export class GroupManager extends GroupArrayChild {
    public type = "root" as const;
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
            const pureChild = this.findNextPureChild(element, startSelected);

            if (pureChild) {
                nextTargets.push(pureChild.toTargetGroups());
            } else {
                nextTargets.push(element);
            }
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
}
