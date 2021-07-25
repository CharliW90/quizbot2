exports.run = async (message, args) => {
const puppeteer = require('puppeteer');
const url = process.env.googleScript;
  try {
    let parameter  = args[0];
    if (parameter === "answers"){
      console.log("Triggering Google Script at: " + url);
      (async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url);
        await browser.close();
      })();
    }
  } catch (e) {
    throw e;
  }
}
