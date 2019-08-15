import MoveableManager from "./MoveableManager";
import { GroupableProps } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
import { getAbleDragger } from "./getAbleDragger";
import Groupable from "./ables/Groupable";
import Origin from "./ables/Origin";
import { MOVEABLE_ABLES } from "./consts";
import { getTargetInfo } from "./utils";
import { sum } from "./matrix";
import { Frame } from "scenejs";

function getMaxPos(moveables: MoveableManager[], index: number) {
    return Math.max(...moveables.map(({ state: { left, top, pos1, pos2, pos3, pos4 } }) => {
        return (index ? top : left) + Math.max(pos1[index], pos2[index], pos3[index], pos4[index]);
    }));
}
function getGroupRect(moveables: MoveableManager[]) {
    if (!moveables.length) {
        return [0, 0, 0, 0];
    }
    const groupLeft = Math.min(...moveables.map(({ state: { left } }) => left));
    const groupTop = Math.min(...moveables.map(({ state: { top } }) => top));
    const groupWidth = getMaxPos(moveables, 0) - groupLeft;
    const groupHeight = getMaxPos(moveables, 1) - groupTop;

    return [groupLeft, groupTop, groupWidth, groupHeight];
}

class MoveableGroup extends MoveableManager<GroupableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        groupable: true,
        ables: MOVEABLE_ABLES,
        targets: [],
    };
    public differ: ChildrenDiffer<HTMLElement | SVGElement> = new ChildrenDiffer();
    public moveables: MoveableManager[] = [];
    public frame!: Frame;
    private groupTargetElement!: HTMLElement;

    public componentDidMount() {
        super.componentDidMount();
        this.updateRect();
    }
    public componentDidUpdate() {
        this.update(true);
    }
    public clearFrame() {
        const { width, height } = this.state;
        this.frame = new Frame({
            width: `${width}px`,
            height: `${height}0px`,
            transform: {
                translateX: "0px",
                translateY: "0px",
                scaleX: 1,
                scaleY: 1,
                rotate: "0deg",
            },
        });
    }
    public update(isSetState?: boolean) {
        if (!isSetState) {
            return;
        }
        const state = this.state;
        if (!state.target) {
            state.target = this.groupTargetElement;

            this.targetDragger = getAbleDragger(this, state.target!, "targetAbles", "Group");
            this.controlDragger = getAbleDragger(this, this.controlBox.getElement(), "controlAbles", "GroupControl");
        }
        this.updateAbles();

        this.moveables.forEach(moveable => moveable.update(false));

        const { added, changed } = this.differ.update(this.props.targets!);

        if (added.length || changed.length) {
            this.updateRect();
        }
        return true;
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        this.moveables.forEach(moveable => {
            moveable.updateRect(type, isTarget, false);
        });

        const state = this.state;
        const target = state.target || this.props.target;

        let left = state.left;
        let top = state.top;
        let width = 0;
        let height = 0;

        const isUpdate = !isTarget || type !== "" && this.props.updateGroup;

        if (isUpdate) {
            [left, top, width, height] = getGroupRect(this.moveables);

            state.width = width;
            state.height = height;
            state.left = left;
            state.height = height;

            this.clearFrame();
        }
        target!.style.cssText = this.frame.toCSS();

        this.updateState(
            getTargetInfo(target, this.controlBox.getElement(), isTarget ? state : undefined), false,
        );

        const { pos1, pos2, pos3, pos4 } = state;
        const pos = [state.left, state.top];

        this.setState({
            left,
            top,
            pos1: sum(pos1, pos),
            pos2: sum(pos2, pos),
            pos3: sum(pos3, pos),
            pos4: sum(pos4, pos),
        });
    }
    public triggerEvent(name: string, e: any): any {
        if (name.indexOf("Group") > -1) {
            return super.triggerEvent(name as any, e);
        }
    }
    protected renderAbles() {
        const ables = [...this.props.ables!, Groupable, Origin];

        return ables.map(({ render }) => render && render(this));
    }
}

export default MoveableGroup;
