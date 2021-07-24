exports.run = async (message, args, override) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var quizTeamsParentID = base.quizTeamsParentID;
  let dateFetch = new Date();
  let requestTime = dateFetch.getTime();
  let cooldownTime = base.cooldownTime;
  let timeDiff = ((requestTime - cooldownTime)/60000).toFixed(2);
  if (timeDiff > 5 || message.channel.parentID === quizTeamsParentID || override === 1 || message.channel.type === 'dm') {
    try {
      if(override === 1){
        const admin_help_embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle('QuizBot Admin Commands')
        .setDescription('Admins have access to a all commands in this bot.  They are described below.')
        .addFields(
          {name: 'register', value: "Registers a 'team-name' and @team-member(s)"},
          {name: 'usage', value: "```++register 'team name as written' @person (will be captain) @other-member(s)```"},
          {name: 'teams', value: "Provides the 'help' details for managing team members, as well as a list of all registered teams."},
          {name: 'usage', value: "```++teams```"},
          {name: 'reset', value: "Used at the end of a quiz (or some days later).  Deletes all registered Quiz Team Text and Voice channels, deletes the Team Roles, and removes the 'Team Captain' role from anyone who has it."},
          {name: 'usage', value: "```++reset```"},
          {name: 'reconfigure', value: "Used to try to recover certain information after the bot crashes or restarts mid-quiz.  Cannot undo the ++reset command, and does not recover any answers/results/scoreboard information."},
          {name: 'usage', value: "```++reconfigure```"},
          {name: '\u200B', value: '\u200B' },
          {name: 'answers', value: "The first step in getting QuizBot to handle the scores: copy the .csv answers from a google form and paste into this command for a specific round"},
          {name: 'usage', value: "```++answers [round-number] <ctrl+v>```"},
          {name: 'results', value: "The second step in getting QuizBot to handle the scores: use this command to push all of the previously loaded 'answers' out to the team text channels"},
          {name: 'usage', value: "```++results [round-number]```"},
          {name: 'retry', value: "An intermediary step in getting QuizBot to handle the scores: use this command to send a team's answers to the correct text channel (when QuizBot fails to identify it automatically)"},
          {name: 'usage', value: "```++retry [round-number] incorrect-team-name #text-channel```"},
          {name: 'scoreboard', value: "The final step in getting QuizBot to handle the scores: this command handles the scoreboard, but has a number of sub-commands you must use.  For help with the sub-commands, simply use the command ++scoreboard without any sub-commands"},
          {name: 'usage', value: "```++scoreboard [sub-command]```"},
          {name: '\u200B', value: '\u200B' },
          {name: 'announce', value: "Sends a message to all quiz team text channels"},
          {name: 'usage', value: "```++announce 'message you wish to send'```"},
          {name: 'set', value: "Stores a message, under a number, that you can send to all quiz team text channels at a later time (was designed to store questions that could then be triggered later to go out to all teams)"},
          {name: 'usage', value: "```++set [number] 'message you wish to send'```"},
          {name: 'question', value: "Sends a message, that was saved via the ++set command, to all quiz team text channels"},
          {name: 'usage', value: "```++question [number]```"}
        );
        await message.channel.send(admin_help_embed);
      } else {
        const help_embed = new Discord.MessageEmbed()
          .setColor("PURPLE")
          .setTitle('QuizBot Team Captain Commands')
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
      }
    } catch (e) {
      throw e
    }
  } else {
    console.log("it has only been " + timeDiff + " minutes since the help command was last used")
    return;
  } 
}
