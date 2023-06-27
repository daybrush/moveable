import Moveable from "./Moveable.svelte";
import { METHODS } from "moveable";

export default /*#__PURE__*/ (() => {
    const prototype = Moveable.prototype;

    if (!prototype) {
        return Moveable;
    }
    METHODS.forEach(name => {
        prototype[name] = function (...args) {
            const self = this.getInstance();
            const result = self[name](...args);

            if (result === self) {
                return this;
            } else {
                return result;
            }
        };
    });
    return Moveable;
})();

export * from "moveable";
