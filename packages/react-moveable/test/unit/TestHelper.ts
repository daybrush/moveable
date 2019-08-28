export async function wait(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
