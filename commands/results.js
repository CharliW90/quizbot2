exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var dictionary = base.team_dictionary;
  try{
    var round_num = parseFloat(args[0]);
    if (!round_num) {
      message.reply("I need to know the quiz round.");
      return;
    }
    if (Number.isNaN(round_num)) {
      message.reply(args[0] + " is not a number!");
      return;
    }
    var team_result_embeds = base.answer_embeds[round_num];
    if (!team_result_embeds) {
      message.reply("I didn't find results for " + round_num);
      return;
    }
    var failed_pushes = [];
    for (team in team_result_embeds) {
      let relevant_channel = message.guild.channels.cache.find(channel => channel.name === team);
      if (relevant_channel) {
	console.log("Channel found matching " + team + ". Sending results to " + relevant_channel.id)
        relevant_channel.send(team_result_embeds[team]);
      } else if (dictionary[team]) {
	let relevant_channel = message.guild.channels.cache.find(channel => channel.name === dictionary[team]);
	if (relevant_channel) {
	  console.log("Dictionary result found matching " + team + " which gives: " + dictionary[team] + ". Sending results to " + relevant_channel.id)
          relevant_channel.send(team_result_embeds[team]);
	} else {
	  console.log("Dictionary result found matching " + team + " which gives: " + dictionary[team] + " but no channel found matching this name either.")
          failed_pushes.push(team);
	}
      } else {
	console.log("No channel found matching " + team + " and no dictionary entry either.")
        failed_pushes.push(team);
      }
    }
    if (failed_pushes.length === 0) {
	message.reply("All results have been sent.");
    } else {
        const fail_embed = new Discord.MessageEmbed()
	    .setColor("PURPLE")
	    .setTitle('Results Posted - Failure Notice:')
	    .setDescription('I failed to find the correct channels for the below teams.')
	    .addFields(
		{name: 'Teams', value: failed_pushes.join('\n')},
		{name: 'To retry', value: "use the command ```++retry " + round_num + "``` followed by the name of the team shown above (e.g. " + failed_pushes[0] + "), followed by the #channel you wish to direct it to."},
	    );
	message.channel.send(fail_embed);
    }
  } catch (e) {
      throw e;
  }
}
