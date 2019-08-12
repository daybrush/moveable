import MoveableManager from "./MoveableManager";
import { GroupableProps } from "./types";
import { MOVEABLE_GROUP_ABLES } from "./consts";


export default class MoveableGroup extends MoveableManager<GroupableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        ables: MOVEABLE_GROUP_ABLES,
    }
    public moveables: MoveableManager[] = [];
}
