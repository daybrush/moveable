import { isArray, deepFlat, find } from "@daybrush/utils";
import { GroupChild, TargetGroupsObject, TargetGroupsType } from "./types";

export class Child {
    public type: "group" | "root" | "single" = "single";
    public depth = 0;
    protected _scope: string[] = [];
    constructor(public parent?: ArrayChild) {
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }

    public get scope(): string[] {
        const parent = this.parent;

        if (!parent || parent.type === "root") {
            return [];
        }
        return [...parent.scope, parent.id];
    }
}

export class SingleChild extends Child {
    public type = "single" as const;
    public isGroupElement = false;
    constructor(parent: ArrayChild, public value: HTMLElement | SVGElement) {
        super(parent);
    }
}


export class ArrayChild extends Child {
    public type: "group" | "root" = "group";
    public value: GroupChild[] = [];
    public id = "";
    public groupElement?: HTMLElement | SVGElement | null = null;
    public map: Map<HTMLElement | SVGElement, SingleChild> = new Map();

    public compare(groups: TargetGroupsType, checker: -1 | 0 | 1 = 0) {
        const elements = deepFlat(groups);
        const map = this.map;
        const elementsLength = elements.length;
        const mapSize = map.size;
        const sizeDiff = mapSize - elementsLength;

        // 1 this > groups
        // 0 this = groups
        // -1 this < groups
        const count = elements.filter(element => map.has(element)).length;

        if ((checker > 0 && sizeDiff >= 0) || (checker === 0 && sizeDiff === 0)) {
            return elementsLength === count;
        } else if (checker < 0 && sizeDiff <= 0) {
            return mapSize === count;
        }
        return false;
    }
    public has(target: HTMLElement | SVGElement) {
        return this.map.has(target);
    }
    public contains(element: HTMLElement | SVGElement): boolean {
        if (this.has(element)) {
            return true;
        }
        return this.value.some(child => {
            if (child.type === "group") {
                return child.contains(element);
            } else {
                return false;
            }
        });
    }
    public findContainedChild(element: HTMLElement | SVGElement) {
        return find(this.value, child => {
            if (child.type === "single") {
                return child.value === element;
            } else {
                return child.contains(element);
            }
        });
    }
    /**
     * Exact group containing targets
     */
    public findExactChild(target: TargetGroupsType[0]): GroupChild | undefined {
        const map = this.map;

        if (!isArray(target)) {
            return map.get(target);
        }
        const flatted = deepFlat(target);
        const length = flatted.length;
        const single = map.get(flatted[0]);

        if (!single) {
            return;
        }

        let parent: ArrayChild | undefined = single.parent;

        while (parent) {
            if (parent.map.size >= length) {
                return parent;
            }
            parent = parent.parent;
        }
        return;
    }
    public findCommonParent(targets: TargetGroupsType): ArrayChild {
        let depth = Infinity;
        let childs = targets.map(target => this.findExactChild(target));

        childs.forEach(child => {
            if (!child) {
                return;
            }
            depth = Math.min(child.depth, depth);
        });

        while (depth) {
            --depth;
            childs = childs.map(child => {
                let parent: GroupChild | undefined = child;

                while (parent && parent.depth !== depth) {
                    parent = parent.parent;
                }

                return parent;
            });
            const firstChild = childs.find(child => child);

            if (!firstChild) {
                return this;
            }
            if (childs.every(child => !child || child === firstChild)) {
                break;
            }
        }
        const commonParent = childs.find(child => child) as ArrayChild;

        return commonParent || this;
    }
    public findNextChild(
        target: HTMLElement | SVGElement,
        range: TargetGroupsType = this.toTargetGroups(),
        isExact = true,
    ): ArrayChild | null {
        let nextChild: ArrayChild | null = null;

        const length = range.length;

        range.some(child => {
            if (!isExact && length === 1 && isArray(child)) {
                nextChild = this.findNextChild(target, child);
                return nextChild;
            }


            const nextGroupChild = this.findExactChild(child);

            if (!nextGroupChild) {
                return;
            }

            if ("map" in nextGroupChild) {
                if (nextGroupChild.map.has(target)) {
                    nextChild = nextGroupChild;
                    return true;
                }
            }
        });

        return nextChild;
    }
    public findNextExactChild(
        target: HTMLElement | SVGElement,
        selected: Array<HTMLElement | SVGElement>,
        range: TargetGroupsType = this.toTargetGroups(),
    ): ArrayChild | null {
        // [[1, 2]] => group([1, 2]) exact
        // [[[1, 2], 3]] => group([1, 2])
        const nextChild = this.findNextChild(target, range, true);

        if (!nextChild) {
            return null;
        }

        if (nextChild.compare(selected, -1)) {
            return nextChild;
        }
        return null;
    }
    /**
     * Finds a group that does not overlap within the range and includes the target.
     */
    public findPureChild(
        target: HTMLElement | SVGElement,
        range: Array<HTMLElement | SVGElement>,
    ): ArrayChild | null {
        let nextGroupChild: ArrayChild | null = null;

        const childSelected = range.filter(element => this.has(element));

        if (!childSelected.length) {
            return this;
        }

        this.value.some(nextChild => {
            if (nextChild.type !== "single" && nextChild.has(target)) {
                nextGroupChild = nextChild.findPureChild(target, childSelected);

                if (nextGroupChild) {
                    return true;
                }
            }
        });

        return nextGroupChild;
    }
    public findNextPureChild(
        target: HTMLElement | SVGElement,
        range: Array<HTMLElement | SVGElement>,
    ): ArrayChild | null {
        const nextChild = this.findNextChild(target);

        if (nextChild) {
            return nextChild.findPureChild(target, range);
        }
        return null;
    }
    public getSingleChild(): SingleChild | null {
        const groupElement = this.groupElement;

        if (groupElement) {
            const singleChild = this.parent?.value.find(t => t.value === groupElement);

            if (singleChild) {
                return singleChild as SingleChild;
            }
        }
        return null;
    }
    public toTargetGroups(): TargetGroupsType {
        return this.value.map(child => {
            if (child.type === "single") {
                return child.value;
            } else {
                return child.toTargetGroups();
            }
        });
    }
    public findArrayChild(targets: TargetGroupsType): ArrayChild | null {
        const {
            value,
        } = this;

        let result = false;

        if (this.type !== "root") {
            result = value.every(child => {
                if (child.type === "single")  {
                    return targets.some(target => child.value === target);
                } else {
                    return targets.some(target => {
                        return isArray(target) && child.findArrayChild(target);
                    });
                }
            });
            // result = targets.every(target => {
            //     if (isArray(target)) {
            //         return value.some(child => {
            //             return child.type === "group" && child.findArrayChild(target);
            //         });
            //     } else {
            //         return map.get(target);
            //     }
            // });
        }

        if (result && targets.length === value.length) {
            return this;
        } else {
            let childResult: ArrayChild | null = null;

            value.some(child => {
                if (child.type === "group") {
                    childResult = child.findArrayChild(targets);

                    return childResult;
                }
            });

            return childResult;
        }
    }
    public groupByPerfect(selected: Array<HTMLElement | SVGElement>) {
        return this.value.filter(child => {
            if (child.type !== "single") {
                return child.compare(selected, -1);
            }
            return selected.indexOf(child.value) > -1;
        }).map(child => {
            if (child.type !== "single") {
                const singleChild = child.getSingleChild();

                if (singleChild) {
                    return singleChild;
                }
            }
            return child;
        });
    }
    public add(targets: TargetGroupsObject) {
        const {
            value,
            map,
        } = this;

        targets.forEach(child => {
            if ("groupId" in child) {
                const group = new ArrayChild(this);

                group.id = child.groupId;
                value.push(group);
                group.add(child.children);
            } else if (isArray(child)) {
                const group = new ArrayChild(this);

                value.push(group);
                group.add(child);
            } else {
                const element = "current" in child ? child.current : child;
                const single = new SingleChild(this, element!);

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

        value.forEach(child => {
            if  (child.type !== "single") {
                return;
            }
            // single
            const singleElement = child.value;
            const groupChild = value.find(child2 => {
                if (child2.type === "single") {
                    return;
                }
                const firstElement = [...child2.map.keys()][0];

                if (!firstElement) {
                    return;
                }

                return singleElement.contains(firstElement);
            });

            (child as SingleChild).isGroupElement = !!groupChild;

            if (groupChild) {
                (groupChild as ArrayChild).groupElement = child.value;
            }
        });
        return parent;
    }
}
