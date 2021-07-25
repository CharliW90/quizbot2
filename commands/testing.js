exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var teamCount = base.teamCount;
  var admin_channel = base.admin_channel;
  var teamsObject = require('/app/objects/teams.js');
  const puppeteer = require('puppeteer');
  try {
    // ------------------------ EDIT BELOW THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
    (async () => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto('https://script.google.com/macros/s/AKfycbxxcN_PR5oviPm6zcDmQxTb2uoXVh4q9xe7r-gywzhsRF7fXkl9q42IVVZ7wga_b6ZJ8A/exec');
      await browser.close();
    })();
    // ------------------------ EDIT ABOVE THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
  } catch (e) {
    throw e;
  }
}
