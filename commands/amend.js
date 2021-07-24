exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var scoreboard = base.scoreboard;
  var dictionary = base.team_dictionary;
  var admin_channel = base.admin_channel;
  try {
    var round_number = args[0];
    var team = args[1];
    var operator = args[2];
    var amendment = Math.floor(args[3]);
    if(!scoreboard[team]){
      message.reply("I could not find an entry for " + team);
      return;
    }
    if(!scoreboard[team][round_number]){
      message.reply("I could not find results for round number " + round_number + " for the team " + team);
      return;
    }
    if(operator === "+"){
      if(typeof amendment === 'number'){
        //var relevent_round = scoreboard[team][round_number];
        //var score = parseFloat(relevant_round.split('/')[0]);
        //var scorePoss = parseFloat(relevant_round.split('/')[1]);
        //var new_score = score + amendment;
        //var new_score_push = new_score + "/" + scorePoss;
        //await base.scoreboardParse(team, round_number, new_score_push);
        let teamChannel = message.guild.channels.cache.find(channel => channel.name === team);
        message.reply("Congrats!  This score addition will work, if you code it here.");
        console.log(scoreboard[team][round_number]);
        if(teamChannel){
          //teamChannel.send(message.author + " has just added " + amendment + " points to your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " new_score_push)
        }
      } else {
        message.reply("I need to know the amount to add to the score - the amount must be a number.  " + amendment + " is not a number.");
        return;
      }
    } else if(operator === "-"){
      if(typeof amendment === 'number'){
        //var relevent_round = scoreboard[team][round_number];
        //var score = parseFloat(relevant_round.split('/')[0]);
        //var scorePoss = parseFloat(relevant_round.split('/')[1]);
        //var new_score = score - amendment;
        //var new_score_push = new_score + "/" + scorePoss;
        //await base.scoreboardParse(team, round_number, new_score_push);
        //let teamChannel = message.guild.channels.cache.find(channel => channel.name === team);
        //teamChannel.send(message.author + " has just deducted " + amendment + " points from your score for Round " + round_number + ".  Your score for Round " + round_number + " is now " new_score_push);
      } else {
        message.reply("I need to know the amount to subtract from the score - the amount must be a number.  " + amendment + " is not a number.");
        return;
      }
    } else {
      message.reply("I do not know what to do with the operator " + operator + " !  Please use + or - ");
      return;
    }
  } catch (e) {
    throw e;
  }
}
