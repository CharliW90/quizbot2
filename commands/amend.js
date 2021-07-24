exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var scoreboard = base.scoreboard;
  var dictionary = base.team_dictionary;
  var admin_channel = base.admin_channel;
  var team_result_embeds = base.answer_embeds;
  try {
    var round_number = args[0];
    var team = args[1];
    var operator = args[2];
    var amendment = Math.floor(args[3]);
    if(!team_result_embeds[round_number]){
      message.reply("I could not find a round number of " + round_number);
      return;
    }
    if(!team_result_embeds[round_number][team]){
      message.reply("I could not find a results for " + team + " in round number " + round_number);
      return;
    }
    if(operator === "+"){
      if(typeof amendment === 'number'){
        message.reply("Congrats!  This score addition will work, if you code it here.")
      } else {
        message.reply("I need to know the amount to add to the score - the amount must be a number.  " + amendment + " is not a number.");
        return;
      }
    } else if(operator === "-"){
      if(typeof amendment === 'number'){
        message.reply("Congrats!  This score subtraction will work, if you code it here.")
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
