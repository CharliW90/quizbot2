exports.run = async (message, args, override) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var quizTeamsParentID = base.quizTeamsParentID;
  let dateFetch = new Date();
  let requestTime = dateFetch.getTime();
  let cooldownTime = base.cooldownTime;
  let timeDiff = ((requestTime - cooldownTime)/60000).toFixed(2);
  if (timeDiff > 5 || message.channel.parentID === quizTeamsParentID || override === 1) {
    try {
      const help_embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle('QuizBot Commands')
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
      if (!message.channel.parentID === quizTeamsParentID && !override === 1) {
        console.log("Command was used in a public channel - cooldownTime resetting");
        await base.cooldownTimeSet();
      }
    } catch (e) {
      throw e
    }
  } else {
    console.log("it has only been " + timeDiff + " minutes since the help command was last used")
    return;
  } 
}
