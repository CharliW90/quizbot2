exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var dictionary = base.team_dictionary;
  var admin_channel = base.admin_channel;
  console.log("The last time this command was used, it did not work - it is therefore riddled with console logs - gl;hf");
  try {
    var round_number = args[0];
    var team = args[1];
    console.log("Team is " + team);
    var operator = args[2];
    console.log("Operator is " + operator);
    var amendment = Math.floor(args[3]);
    console.log("Amendment is " + amendment);
    if(!base.scoreboard[team]){
      message.reply("I could not find an entry for " + team);
      return;
    }
    if(!base.scoreboard[team][round_number]){
      message.reply("I could not find results for round number " + round_number + " for the team " + team);
      return;
    }
    if(operator === "+"){
      console.log("Operator has triggered the addition version of this command");
      if(typeof amendment === 'number'){
        var relevant_round = base.scoreboard[team][round_number];
        console.log("The round fetched looks like:");
        console.log(relevant_round);
        console.log ("the subsequent code appears to assume this is a score only...")
        var score = parseFloat(relevant_round.split('/')[0]);
        console.log("The score for this round is " + score);
        var scorePoss = parseFloat(relevant_round.split('/')[1]);
        console.log("The max poss score is apparently " + scorePoss);
        var new_score = score + amendment;
        console.log("The new score will be " + new_score);
        var new_score_push = new_score + "/" + scorePoss;
        console.log("and this is formatted as " + new_score_push);
        await base.scoreboardParse(team, round_number, new_score_push);
        let teamChannel = message.guild.channels.cache.find(channel => channel.name === team);
        if(teamChannel){
          teamChannel.send(message.author.username + " has just added " + amendment + " points to your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " + new_score_push)
        } else if (dictionary[team]) {
          let teamChannel = message.guild.channels.cache.find(channel => channel.name === dictionary[team]);
          if(teamChannel){
            teamChannel.send(message.author.username + " has just added " + amendment + " points to your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " + new_score_push)
          } else {
            message.reply("I could not inform " + team + " about the amendment to their score, since I could not find a text channel for them.  I also tried " + dictionary[team])
          }
        } else {
          message.reply("I could not inform " + team + " about the amendment to their score, since I could not find a text channel for them.")
        }
      } else {
        message.reply("I need to know the amount to add to the score - the amount must be a number.  " + amendment + " is not a number.")
        return;
      }
    } else if(operator === "-"){
      if(typeof amendment === 'number'){
        var relevant_round = base.scoreboard[team][round_number];
        var score = parseFloat(relevant_round.split('/')[0]);
        var scorePoss = parseFloat(relevant_round.split('/')[1]);
        var new_score = score - amendment;
        var new_score_push = new_score + "/" + scorePoss;
        await base.scoreboardParse(team, round_number, new_score_push);
        let teamChannel = message.guild.channels.cache.find(channel => channel.name === team);
        console.log(teamChannel);
        if(teamChannel){
          teamChannel.send(message.author.username + " has just deducted " + amendment + " points from your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " + new_score_push)
        } else if (dictionary[team]) {
          let teamChannel = message.guild.channels.cache.find(channel => channel.name === dictionary[team])
          if(teamChannel){
            teamChannel.send(message.author.username + " has just deducted " + amendment + " points from your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " + new_score_push)
          } else {
            message.reply("I could not inform " + team + " about the amendment to their score, since I could not find a text channel for them.  I also tried " + dictionary[team])
          }
        } else {
          message.reply("I could not inform " + team + " about the amendment to their score, since I could not find a text channel for them.")
        }
      } else {
        message.reply("I need to know the amount to deduct from the score - the amount must be a number.  " + amendment + " is not a number.")
        return;
      }
    } else {
      message.reply("I do not know what to do with the operator " + operator + " !  Please use + or -")
    }
  } catch (e) {
    throw e;
  }
}
