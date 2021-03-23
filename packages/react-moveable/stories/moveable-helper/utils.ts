import { Frame } from "scenejs";

export function getOrderIndex(frame: Frame, functionName: string) {
    const orders = frame.getOrders(["transform"]) || [];
    return orders.indexOf(functionName);
}
