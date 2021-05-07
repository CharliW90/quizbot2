exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var teamCount = base.teamCount;
  var admin_channel = base.admin_channel;
  var teamsObject = require('/app/objects/teams.js');
  try {
    // ------------------------ EDIT BELOW THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
    if (args[0] == "initiate") {
      let members = [message.author, 'test name 1', 'test name 2', 'test name 3'];
      await teamsObject.register(101, "TestTeamName", "tc", "vc", members, "PURPLE");
    } else if (args[0] == "dump") {
      let dump = teamsObject.teams;
      console.log(dump);
    } else message.reply("initiate or dump, please?");
    // ------------------------ EDIT ABOVE THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
  } catch (e) {
    throw e;
  }
}
