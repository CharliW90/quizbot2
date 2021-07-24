exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var teamCount = base.teamCount;
  var admin_channel = base.admin_channel;
  var teamsObject = require('/app/objects/teams.js');
  try {
    // ------------------------ EDIT BELOW THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
    console.log(base.scoreboard);
    // ------------------------ EDIT ABOVE THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
  } catch (e) {
    throw e;
  }
}
