const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

module.exports = {
    async postRender(page, context) {
        if (!process.env.SKIP_TEST) {
            return;
        }
        // If you want to take screenshot of multiple browsers, use
        // page.context().browser().browserType().name() to get the browser name to prefix the file name
        await page.screenshot({ path: `${customSnapshotsDir}/${context.id}.png` });
    },
};
