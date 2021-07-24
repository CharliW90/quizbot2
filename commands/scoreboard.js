exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var scoreboard = base.scoreboard;
  var dictionary = base.team_dictionary;
  var admin_channel = base.admin_channel;
  var team_result_embeds = base.answer_embeds;
  // first we check if a valid parameter has been given alongside the command.  If not, we display the help message to tell the user what parameters to use.
  if (args[0] != "check" && args[0] != "delete" && args[0] != "merge" && args[0] != "results" && args[0] != "debug" && args[0] != "investigate") {
    console.log("No parameter provided - replying with help message");
    const scoreboard_help_embed = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setTitle('Scoreboard command usage:')
      .addFields(
        {name: 'check', value: "Allows you to check which round numbers have been stored for each team."},
        {name: 'usage', value: "```++scoreboard check```"},
        {name: 'delete', value: "Allows you to delete an entire team from the scoreboard, or an entire round's results."},
        {name: 'usage', value: "```++scoreboard delete team-name``` or ```++scoreboard delete n``` where n is the number of a round."},
        {name: 'note', value: "The team-name or Round Number must match one of those listed in a ++scoreboard check"},
        {name: 'merge', value: "Allows you to merge the results for two teams into one."},
        {name: 'usage', value: "```++scoreboard merge team-name-to-keep team-name-to-discard```"},
        {name: 'results', value: "Triggers the calculation of total scores, and presents #admin-chat with an ordered scoreboard."},
        {name: 'usage', value: "```++scoreboard results```"},
        {name: 'investigate', value: "Triggers the calculation of individual team scores, round-by-round, and presents them in #admin-chat."},
        {name: 'usage', value: "```++scoreboard investigate```"},
      );
    message.channel.send(scoreboard_help_embed);
  } else {
    // if a valid parameter has been given, we pull this out of the array of args so that we can trigger the correct response, but also so that the parameter is ignored by the subsequent code.
    let parameter = args.shift();
    console.log("The " + parameter + " parameter was requested");
    if (parameter == "check") {
      // Below is the code we run for the SCOREBOARD CHECK command -------------------------------------------------------------------
      try {
        const scoreboardCheck_embed = new Discord.MessageEmbed()
          .setColor('PURPLE')
          .setTitle('Scoreboard')
        for (team in scoreboard) {
          scoreboardCheck_embed.addField(team, Object.keys(scoreboard[team]).join(', '))
        }
        message.channel.send(scoreboardCheck_embed);
      } catch (e) {
        throw e;
      }      
    } else if (parameter == "delete") {
      // Below is the code we run for the SCOREBOARD DELETE command -------------------------------------------------------------------
      let poss_team_name = args[0];
      let poss_round_num = args.join(" ")
      try {
        if (!args[0]) {
          message.reply("You need to tell me what to delete - either a team name, or the number of a round...");
          return;
        } else if (base.scoreboard[poss_team_name]) {
          await base.scoreboardDelete("team", poss_team_name);
        } else if (team_result_embeds[poss_round_num]) {
          await base.scoreboardDelete("num", poss_round_num);
        } else {
          message.reply("I could not find anything to delete for " + args.join(" "));
          return;
        }
      } catch (e) {
        throw e;
      }
    } else if (parameter == "merge") {
      // Below is the code we run for the SCOREBOARD MERGE command -------------------------------------------------------------------
      if (!args[0]) {
        message.reply("You need to tell me which teams to merge!");
        return;
      }
      var correct_team = args[0];
      if (message.mentions.channels.first()) {
        var remove_team = message.mentions.channels.first().name;
      } else {
        var remove_team = args[1];
      }
      if (args[2]) {
        message.reply("Please **only** provide the name of the team to keep followed by the name of the team to lose in the merger.");
        return;
      }
      if (!scoreboard[correct_team]) {
        message.reply("I cannot find results for " + correct_team + " currently in the scoreboard.  Please check spelling.");
        return;
       }
      if (!scoreboard[remove_team]) {
        message.reply("I cannot find results for " + remove_team + " currently in the scoreboard.  Please check spelling.");
        return;
      }
      try {
        if (!dictionary[remove_team]) {
          await base.team_dictionaryParse(remove_team, correct_team);
        }
        var round_counter = 1;
        const successful_merge_embed = new Discord.MessageEmbed()
          .setColor('PURPLE')
          .setTitle('Merger Completed')
        while (round_counter <= 6) {
          if (scoreboard[remove_team][round_counter]) {
            if (scoreboard[correct_team][round_counter]) {
              successful_merge_embed.addField("Round " + round_counter + " Data", "ERROR.  Data exists for both teams.")
              successful_merge_embed.addField(correct_team, scoreboard[correct_team][round_counter]);
              successful_merge_embed.addField(remove_team, scoreboard[remove_team][round_counter]);
            } else {
              var result = scoreboard[remove_team][round_counter];
              await base.scoreboardParse(correct_team, round_counter, result);
              successful_merge_embed.addField("Round " + round_counter + " Data", "MERGED. " + correct_team + ": " + scoreboard[correct_team][round_counter]);
              await base.scoreboardDelete("merge", remove_team, round_counter);
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
      } catch (e) {
        throw e;
      }
    } else if (parameter == "results" || parameter == "investigate") {
      // Below is the code we run for the SCOREBOARD RESULTS or INVESTIGATE commands -------------------------------------------------------------------
      var leaderboard = {};
      var team_scores = {};
      try {
      // Part One: Build the scores, and totals, per team
        for (team in scoreboard) {
          if (scoreboard[team]["1"]) {
            var round_one = scoreboard[team]["1"];
            var round_one_num = parseFloat(round_one.split('/')[0]);
          } else {
            var round_one = "No Score";
            var round_one_num = 0;
          }
          if (scoreboard[team]["2"]) {
            var round_two = scoreboard[team]["2"];
            var round_two_num = parseFloat(round_two.split('/')[0]);
          } else {
            var round_two = "No Score";
            var round_two_num = 0;
          }
          if (scoreboard[team]["3"]) {
            var round_three = scoreboard[team]["3"];
            var round_three_num = parseFloat(round_three.split('/')[0]);
          } else {
            var round_three = "No Score";
            var round_three_num = 0;
          }
          if (scoreboard[team]["4"]) {
            var round_four = scoreboard[team]["4"];
            var round_four_num = parseFloat(round_four.split('/')[0]);
          } else {
            var round_four = "No Score";
            var round_four_num = 0;
          }
          if (scoreboard[team]["5"]) {
            var round_five = scoreboard[team]["5"];
            var round_five_num = parseFloat(round_five.split('/')[0]);
          } else {
            var round_five = "No Score";
            var round_five_num = 0;
          }
          if (scoreboard[team]["6"]) {
            var round_six = scoreboard[team]["6"];
            var round_six_num = parseFloat(round_six.split('/')[0]);
          } else {
            var round_six = "No Score";
            var round_six_num = 0;
          }
          var total_score = (round_one_num + round_two_num + round_three_num + round_four_num + round_five_num + round_six_num);
          while(leaderboard[total_score]) {
            total_score = total_score + 0.01;
          }
          leaderboard[total_score] = team;
          var stringify = "Round One: " + round_one + "\n" + "Round Two: " + round_two + "\n" + "Round Three: " + round_three + "\n" + "Round Four: " + round_four + "\n" + "Round Five: " + round_five + "\n" + "Round Six: " + round_six;
          team_scores[team] = stringify;
        }

      // Part Two: Order the teams by total score, and then pull their team_scores in order
        var table_of_scores = [];
        var table_of_names = [];
        var positions = []
        var total_scores_across_teams = Object.keys(leaderboard);
        var ordered_scores = total_scores_across_teams.sort(function(a, b){return b - a});
        var number_of_total_scores = ordered_scores.length;
        var position = 0;
        var poscounter = 0;
        var teamcounter = 0;
        var prevScore = 0;
        var number_of_positions = ordered_scores.length;
        while (number_of_positions > 0) {
          let score_request = ordered_scores[poscounter];
          if(score_request == prevScore){
            positions.push(position);
          } else {
            position++;
            positions.push(position);
          }
          prevScore = score_request;
          poscounter++;
          number_of_positions--;
        }
        const scoreboard_embed = new Discord.MessageEmbed()
          .setColor('PURPLE')
          .setTitle('Detailed Team Scores')
        while (number_of_total_scores > 0) {
          let score_request = ordered_scores[teamcounter];
          let team_pull = leaderboard[score_request];
          let actual_score = Math.floor(score_request);
          table_of_scores.push(actual_score);
          table_of_names.push(team_pull);
          scoreboard_embed.addField(team_pull, actual_score);
          scoreboard_embed.addField("Results by round:", team_scores[team_pull]);
          teamcounter++;
          number_of_total_scores--;
        }
        if(parameter == "investigate"){
          admin_channel.send(scoreboard_embed);
          return;
        }

      // Part Three: Create a shorter embed table of just team names and results
        const short_scores = new Discord.MessageEmbed()
          .setColor('DARK_PURPLE')
          .setTitle('Scoreboard')
        short_scores.addField("Team Name", table_of_names.join("\n"), true);
        short_scores.addField("Team Score", table_of_scores.join("\n"), true);
        short_scores.addField("Position", positions.join("\n"), true);
        admin_channel.send(short_scores);
      } catch (e) {
        throw e;
      }
    } else if (parameter == "debug") {
      // Below is the code we run for the SCOREBOARD DEBUG command -------------------------------------------------------------------
      console.log(scoreboard);
      console.log(dictionary);
    } else {
      // if somehow the original "if not one of these four parameters" check passed, but then when we got to it the parameter did not match one of the four (this should never happen) we pop a little message into admin chat to confuse the hell out of everyone...
      try {
        message.reply("Sorry - I encountered an error - the initial check for a command parameter succeeded, but when processed could not be found.  Use ```++scoreboard``` for a list of possible paramaters to use.");
      } catch (e) {
        throw e;
      }
    }
  }
}
