exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var dictionary = base.team_dictionary;
  try{
    var round_num = args[0];
    if (base.answer_embeds[round_num]) {
      var team_result_embeds = base.answer_embeds[round_num];
    } else {
      message.reply("It doesn't look like answers have been saved for round " + round_num);
      return;
    }
    if (message.mentions.channels.first()) {
      var relevant_channel = message.mentions.channels.first();
    } else {
      message.reply("You need to mention a channel for me to send the results to.");
      return;
    }
    var team_to_fetch = args[1];
    if (team_result_embeds[team_to_fetch]) {
      relevant_channel.send(team_result_embeds[team_to_fetch]);
      message.reply("I have sent the results for " + team_to_fetch + " to <#" + relevant_channel.id + ">");
      await base.team_dictionaryParse(team_to_fetch, relevant_channel.name);
    } else {
      message.reply("Sorry, I can't find a previously stored result for " + team_to_fetch);
    }
  } catch (e) {
    throw e;
  }
}
