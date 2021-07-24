exports.run = async (message, args, override) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  try {
    const help_embed = new Discord.MessageEmbed()
      .setColor("PURPLE")
      .setTitle('QuizBot Team Management Commands')
      .setDescription('Team Captains have access to a limited number of commands in this bot.  They are described below.  Only those server members with the @Team Captain role are able to use these commands.')
      .addFields(
        {name: 'add', value: "Allows you to add people to your team."},
        {name: 'usage', value: "```++add @teamname @person```"},
        {name: 'notes', value: "You may add multiple people at once with this command, simply @ multiple people after the team name."},
        {name: '\u200B', value: '\u200B' },
        {name: 'remove', value: "Allows you to remove people from your team."},
        {name: 'usage', value: "```++remove @teamname @person```"},
        {name: 'notes', value: "You may remove multiple people at once with this command, simply @ multiple people after the team name."},
        {name: '\u200B', value: '\u200B' },
        {name: 'promote', value: "Allows you to promote a team member to be the new Team Captain."},
        {name: 'usage', value: "```++promote @person```"},
        {name: 'notes', value: "Only the current Team Captain can use this command - they will then lose their Team Captain status and the new Team Captain will be in place."}
      );
    await message.channel.send(help_embed);
    var teamCount = 0;
    var teams = [];
    const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;
    quizTeamChannels.forEach(channel => {
      if (channel.type == 'text') {
        teamCount++;
	teams.push(channel.name);
      }
    });
    if(teamCount > 0) {
      const teams_embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle('Registered Teams')
        .setDescription('A short list of registered teams on the server.')
      teams_embed.addField("Team Names", teams.join("\n"));
      await message.channel.send(teams_embed);
    }
  } catch (e) {
    throw e
  }
}
