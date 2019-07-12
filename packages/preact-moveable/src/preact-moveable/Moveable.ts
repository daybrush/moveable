import Moveable from "react-moveable";
import Preact from "preact";
import { MoveableInterface } from "./types";

export default Moveable as any as new (...args: any[]) => MoveableInterface;
