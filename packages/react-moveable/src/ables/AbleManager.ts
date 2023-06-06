import { Able, DefaultProps } from "../types";

export function makeAble<
    Name extends string,
    AbleObject extends Partial<Able<any, any>>,
    Props extends DefaultProps<Name, AbleObject>,
>(name: Name, able: AbleObject) {
    return {
        events: [] as AbleObject["events"] extends readonly any[] ? AbleObject["events"] : readonly [],
        props: [] as AbleObject["props"] extends readonly any[] ? AbleObject["props"] : readonly [],
        name,
        ...able,
    } as const;
}
