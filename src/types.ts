import {
    MoveableProps,
    MoveableEvents,
} from "react-moveable/declaration/types";

export interface WithEventStop {
    stop: () => any;
}
export type MoveableEventsParameters = {
    [key in keyof MoveableEvents]: MoveableEvents[key] & WithEventStop;
};
