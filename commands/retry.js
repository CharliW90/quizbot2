exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var dictionary = base.team_dictionary;
  var scoreboard = base.scoreboard;
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
      // the below is stolen from the scoreboard command, for the parameter 'merge' so that when we 'retry' results, we also tidy up the scoreboard (is the hope!)
      var round_counter = 1;
      var remove_team = team_to_fetch;
      var correct_team = relevant_channel.name
      const successful_merge_embed = new Discord.MessageEmbed()
        .setColor('PURPLE')
        .setTitle('Merger Completed')
      while (round_counter <= 6) {
        if (scoreboard[remove_team][round_counter]) {
          if (!scoreboard[correct_team][round_counter]) {
            var result = scoreboard[remove_team][round_counter];
            await base.scoreboardParse(correct_team, round_counter, result);
            successful_merge_embed.addField("Round " + round_counter + " Data", "MERGED. " + correct_team + ": " + scoreboard[correct_team][round_counter]);
            await base.scoreboardDelete("merge", remove_team, round_counter);
          } else {
            if(scoreboard[correct_team][round_counter] == "Awaiting data..."){
              var result = scoreboard[remove_team][round_counter];
               await base.scoreboardParse(correct_team, round_counter, result);
              successful_merge_embed.addField("Round " + round_counter + " Data", "MERGED. " + correct_team + ": " + scoreboard[correct_team][round_counter]);
              await base.scoreboardDelete("merge", remove_team, round_counter);
            } else {
              successful_merge_embed.addField("Round " + round_counter + " Data", "ERROR.  Data exists for both teams.")
              successful_merge_embed.addField(correct_team, scoreboard[correct_team][round_counter]);
              successful_merge_embed.addField(remove_team, scoreboard[remove_team][round_counter]);
            }
          }
        } else {
          successful_merge_embed.addField("Round " + round_counter + " Data", "SKIPPED.  No Round " + round_counter + " data for " + remove_team + ".")
        }
        if (round_counter < 6) {
          round_counter++;
        } else {
          await base.scoreboardDelete("team", remove_team);
          message.channel.send(successful_merge_embed);
          return;
        }
      }
    } else {
      message.reply("Sorry, I can't find a previously stored result for " + team_to_fetch);
    }
  } catch (e) {
    throw e;
  }
}
