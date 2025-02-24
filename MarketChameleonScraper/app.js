import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

const SYMBOLS = ['MSTY', 'CONY', 'NVDY'];

chromium.use(stealth());

const getFutureDividends = async (page) => {
    const selector = '#future_divs';

    await page.waitForSelector(selector);

    let table = await page.locator(selector);
    await table.scrollIntoViewIfNeeded();

    const futureDividends = [];

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
        const tds = await rows.nth(i).locator('td');

        const tdCount = await tds.count();
        if (tdCount < 7)
            continue;

        const exDate = await tds.nth(0).innerText();
        const recordDate = await tds.nth(1).innerText();
        const payDate = await tds.nth(2).innerText();
        const status = await tds.nth(3).innerText();
        const amount = await tds.nth(5).innerText();
        const note = await tds.nth(6).innerText();

        if (status.toLowerCase() !== "announced")
            break;

        futureDividends.push({
            exDate,
            recordDate,
            payDate,
            status,
            amount,
            note
        });
    }
    return futureDividends;
}

const randomClickOnSelector = async (page, selector) => {
    let element = await page.locator(selector).first();

    const boundingBox = await element.boundingBox();

    const startX = boundingBox.x + boundingBox.width * 0.25;
    const endX = boundingBox.x + boundingBox.width * 0.75;
    const startY = boundingBox.y + boundingBox.height * 0.25;
    const endY = boundingBox.y + boundingBox.height * 0.75;

    const randomX = startX + Math.random() * (endX - startX);
    const randomY = startY + Math.random() * (endY - startY);

    await page.mouse.click(randomX, randomY);

    return element;
}

const initSymbol = async (page, symbol) => {
    // Search for Symbol
    const selector = '#site_search_lookup';

    await page.waitForSelector(selector);

    await randomClickOnSelector(page, selector);

    // Clear the input
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    await page.keyboard.type(symbol, { delay: 100 });
    await page.keyboard.press('Enter');

    await page.waitForLoadState('networkidle');

    // Load Dividends page
    const dividendsSelector = `a[href*="${symbol}/Dividends"]`;
    await page.waitForSelector(dividendsSelector);

    await randomClickOnSelector(page, dividendsSelector);

    await page.waitForLoadState('networkidle');
}

// Launch a new instance of a Chromium browser
const browser = await chromium.launch({
    // Set headless to false so you can see how Playwright is
    // interacting with the browser
    headless: true,
});

// Create a new Playwright context
const context = await browser.newContext();
const page = await context.newPage();

await page.goto("https://marketchameleon.com/", { referer: 'https://www.google.com/' });

for (const symbol of SYMBOLS) {
    console.log(`Getting symbol: ${symbol}`);
    await initSymbol(page, symbol)

    const futureDividends = await getFutureDividends(page);
    console.log(JSON.stringify(futureDividends));
}

//await page.screenshot({ path: 'stealth.png', fullPage: true })

// Close the browser
await browser.close();