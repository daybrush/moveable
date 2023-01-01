export function createElements(count: number) {
    const elements: HTMLElement[] = [];

    for (let i = 0; i < count; ++i) {
        const div = document.createElement("div");
        div.innerHTML = `${i}`;

        (div as any).eid = i;
        elements.push(div);
    }

    return elements;
}
