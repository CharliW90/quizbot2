exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var scoreboard = base.scoreboard;
  var admin_channel = base.admin_channel;
  try {
    message.reply("Connected...");
  } catch (e) {
    throw e;
  }
}
