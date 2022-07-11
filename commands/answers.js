exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var teamsObject = require('/app/objects/teams.js');
  var Discord = base.Discord;
  var fs = base.fs;
  var csv = base.csv;
  const request = require('request');
  var input;
  var result;
  try {
    var question_result = [];
    var question_raw_score = [];
    var question_score = [];
    var round_num = parseFloat(args[0]);
    if (!round_num) {
      message.reply("I need to know the quiz round.");
      return;
    }
    if (Number.isNaN(round_num)) {
      message.reply(args[0] + " is not a number!");
      return;
    }
    var team_results_names = [];
    const cleanup_results = async (result) => {
      
    }
    const populate_results = async (result) => {
      const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;
      for (var team in result) {
        for (var key in result[team]) {
          if (key.includes("Team Name") && key.includes("Score")) {
            delete result[team][key];
          } else if (key.includes("Feedback") || key.includes("Timestamp")) {
            delete result[team][key];
          }
        }
      }
      for (var team in result) {
        let i = 1;
        for (var key in result[team]) {
          if (key == "Team Name") {
            var team_name = result[team][key];
          } else if (key == "Total score") {
            var total_score = result[team][key];
          } else if (!key.includes("Score")) {
            question_result[i] = result[team][key];
          } else {
            var raw_score = result[team][key];
	    question_raw_score[i] = raw_score;
            var score_check = parseFloat(raw_score);
            if (score_check > 0) {
              question_score[i] = ":white_check_mark:";
            } else {
              question_score[i] = ":x:";
            }
            i++;
          }
        }
        const scores_embed = new Discord.MessageEmbed()
          .setColor('PURPLE')
          .setTitle(result[team]["Team Name"])
          .setAuthor('Virtual Quizzes - Round Number ' + round_num, 'https://cdn.discordapp.com/attachments/774297922728230953/776470114194292786/unknown.png', 'https://www.virtual-quiz.co.uk/')
          .setImage('https://cdn.discordapp.com/attachments/699700135252197478/699744924631040051/Virtual_Quizzes_Logo.png')
	var total_score_num = parseFloat(result[team]["Total score"].split('/')[0]);
	var total_score_poss = parseFloat(result[team]["Total score"].split('/')[1]);
    	var score_quart = total_score_poss / 4;
    	if (total_score_num >= score_quart*4) {
          scores_embed.setThumbnail('https://cdn.discordapp.com/attachments/777174470955630592/777179809683210271/gold1.png');
    	} else if (total_score_num >= score_quart*3) {
          scores_embed.setThumbnail('https://cdn.discordapp.com/attachments/777174470955630592/777179825080238090/gold.png');
    	} else if (total_score_num >= score_quart*2) {
          scores_embed.setThumbnail('https://cdn.discordapp.com/attachments/777174470955630592/777179840268599326/silver.png');
    	} else if (total_score_num >= score_quart) {
          scores_embed.setThumbnail('https://cdn.discordapp.com/attachments/777174470955630592/777179853149437962/bronze.png');
    	} else {
          scores_embed.setThumbnail('https://cdn.discordapp.com/attachments/777174470955630592/777179862942875658/poop.png');
    	}
    	scores_embed.addField("Total Score", (total_score_num).toLocaleString('en-gb', {minimumIntegerDigits: 2, useGrouping:false}) + " / " + total_score_poss);
        let j = 1;
        while (i > 1) {
	  let q_score_num = parseFloat(question_raw_score[j].split('/')[0]);
	  let q_score_poss = parseFloat(question_raw_score[j].split('/')[1]);
          scores_embed.addField("Question " + (j).toLocaleString('en-gb', {minimumIntegerDigits: 2, useGrouping:false}), question_result[j] + " " + question_score[j] + " \n " + q_score_num + " / " + q_score_poss);
          j++;
          i--;                    
        }
	let team_name_channel = result[team]["Team Name"].split(' ').join('-');
	let team_name_channel_format = team_name_channel.toLowerCase();
	await base.answerEmbedsParse(round_num, team_name_channel_format, scores_embed);
	team_results_names.push(result[team]["Team Name"]);
	var score_result = total_score_num + "/" + total_score_poss;
	await base.scoreboardParse(team_name_channel_format, round_num, score_result);
	await teamsObject.answers(result[team]["Team Name"], round_num, score_result, scores_embed);
      }
      const success_embed = new Discord.MessageEmbed()
	.setColor("PURPLE")
	.setTitle('Answers Uploaded')
	.addFields(
	    {name: 'Quiz Round', value: round_num,},
	    {name: 'Quiz Teams', value: team_results_names.join('\n')},
	);
      message.channel.send(success_embed);
    }
    if (message.attachments.size > 0) {
      var attachment = await (message.attachments).array();
      var attachment_url = await attachment[0].url;
      console.log("The results were provided as an attachment: " + attachment_url);
      request.get(attachment_url, async (error, response, body) => {
        console.log("Fetching...");
        if (!error && response.statusCode == 200) {
          var result = csv.toObjects(body);
          await populate_results(result);
        }
      });
    } else {
      var clean_message = message.cleanContent;
      var input = await clean_message.substring(clean_message.indexOf('"'));
      if (input == "") {
        console.log("No input substring was found in the message - returning error message...");
        message.reply("You haven't provided a table of scores (no attachment, and no data provided after the round number in the command).  Did you mean to use the command ++results " + round_num + " instead??");
        return;
      }
      var result = await csv.toObjects(input);
      if (result == "") {
        console.log("No result was returned from csv.toObjects - returning error message...");
        message.reply("You haven't provided a table of scores (no attachment, and the data provided failed conversion to a js Object).  Did you mean to use the command ++results " + round_num + " instead??");
        return;
      }
      await populate_results(result);
    }
  } catch (e) {
    throw e;
  }
}
