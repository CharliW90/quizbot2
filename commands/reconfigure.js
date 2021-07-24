exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = 0;
    try {
        const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;
        quizTeamChannels.forEach(channel => {
            if (channel.type == 'text') {
                teamCount++;
		base.scoreboardSet(channel.name);
            }
	});
	if (teamCount > 0) {
	    base.teamCountParse(teamCount);
	    const reconfigure_embed = new Discord.MessageEmbed()
	        .setColor('#ea0dc1')
	        .setTitle('Teams Recounted')
	        .addField('Team Count', teamCount)
	    message.channel.send(reconfigure_embed);
        } else {
           message.reply("I didn't count any teams already existing...");
        }
    } catch (e) {
        throw e;
    }
}
