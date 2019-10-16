import Moveable from "react-moveable";
import Preact from "preact";
import { PreactMoveableInterface } from "./types";

export default Moveable as any as new (...args: any[]) => PreactMoveableInterface;
