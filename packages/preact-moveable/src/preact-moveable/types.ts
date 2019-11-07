import { MoveableProps, MoveableState, MoveableInterface } from "react-moveable/declaration/types";
import { Component } from "preact";

export type PreactMoveableInterface = {
    [key in Exclude<keyof MoveableInterface, "setState">]: MoveableInterface[key]
} & Component<MoveableProps, MoveableState>;
