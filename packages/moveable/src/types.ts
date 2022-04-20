import {
    MoveableEvents,
} from "react-moveable/types";

export interface WithEventStop {
    stop: () => any;
}
export type MoveableEventsParameters = {
    [key in keyof MoveableEvents]: MoveableEvents[key] & WithEventStop;
};
export * from "react-moveable/types";
