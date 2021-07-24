exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var teamCount = base.teamCount;
  var admin_channel = base.admin_channel;
  var teamsObject = require('/app/objects/teams.js');
  const request = require('request');
  try {
    // ------------------------ EDIT BELOW THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
    request.get("https://script.google.com/macros/s/AKfycby2Wqb6CaV-EUiWVSTUZ6S0ZDH8yiFs6mL9KnM_gC1jWX6mv3LQYKuqCxKP-rdbUIessA/exec", async (error, response, body) => {
      console.log("Triggering Forms...");
      console.log(error)
        if (!error && response.statusCode == 200) {
          console.log("Triggered Forms!");
        }
      });   
    // ------------------------ EDIT ABOVE THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
  } catch (e) {
    throw e;
  }
}
