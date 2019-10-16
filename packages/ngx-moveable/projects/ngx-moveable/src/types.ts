import { MoveableInterface } from 'moveable';

export type NgxMoveableKeys = Exclude<keyof MoveableInterface, "dragStart">;
export type NgxMoveableInterface = {
  [key in NgxMoveableKeys]: MoveableInterface[key];
};
