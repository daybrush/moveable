import { createElements } from "./utils";
import { GroupManager } from "../../src/";

describe("test GroupManager", () => {
    describe("test groups [[0, 1], 2], 3", () => {
        const elements = createElements(4);
        const manager = new GroupManager([
            [[elements[0], elements[1]], elements[2]],
        ], elements);

        it("selectCompletedChilds [0, 1]", () => {
            const list = manager.selectCompletedChilds([], [elements[1]], []);

            expect(list.flatten()).toStrictEqual([elements[0], elements[1], elements[2]]);
        });
        it("selectCompletedChilds 2 => [0, 1]", () => {
            // element[2]가 선택된 상태에서 elements[0]을 선택
            const list = manager.selectCompletedChilds([elements[2]], [elements[0]], [elements[2]]);

            expect(list.flatten()).toStrictEqual([elements[0], elements[1]]);
        });
    });

});
