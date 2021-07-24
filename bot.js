const Discord = require("discord.js");
exports.Discord = Discord;
const Enmap = require("enmap");
exports.Enmap = Enmap;
const fs = require("fs");
exports.fs = fs;
const csv = require("jquery-csv");
exports.csv = csv;

const client = new Discord.Client();

const prefix = process.env.bot_command_prefix;
const admin_channel_name = process.env.admin_channel_name;
const bot_startup_message = process.env.bot_startup_message;
const bot_activity_name = process.env.bot_activity_name;
const bot_activity_type = process.env.bot_activity_type;
const bot_activity_url = process.env.bot_activity_url;
const quiz_day = process.env.quiz_day;
const colours = ["AQUA", "BLUE", "YELLOW", "GREEN", "PURPLE", "GOLD", "RED", "GREY", "DARK_AQUA", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GREEN", "DARK_GOLD", "DARK_ORANGE"];
exports.colours = colours;
var quiz_day_num;
function dayChecker(quiz_day) {
    switch (quiz_day.toUpperCase()) {
        case "SUNDAY":
	    quiz_day_num = 0;
	    break;
        case "MONDAY":
            quiz_day_num = 1;
            break;
        case "TUESDAY":
            quiz_day_num = 2;
            break;
        case "WEDNESDAY":
            quiz_day_num = 3;
            break;
        case "THURSDAY":
            quiz_day_num = 4;
            break;
        case "FRIDAY":
            quiz_day_num = 5;
            break;
        case "SATURDAY":
            quiz_day_num = 6;
            break;
        default:
            quiz_day_num = 9;
            console.log("Error in quiz day information - please check Heroku variable.  Day field currently set to: " + quiz_day);
    }
}

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});
exports.commands = client.commands;

var quizTeamsParentID;
exports.quizTeamsParentID = quizTeamsParentID;
async function setQuizTeamCategoryChannel() {
  if (client.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams")) {
    quizTeamsParentID = client.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").id;
    exports.quizTeamsParentID = quizTeamsParentID;
  } else {
    console.log("Did not find a 'Quiz Teams' channel.  Using the ++register command for the first time will rectify this");
  }
}
exports.setQuizTeamCategoryChannel = setQuizTeamCategoryChannel;

var teamCount;
exports.teamCount = teamCount;
async function teamCountParse(value) {
  teamCount = value;
  exports.teamCount = teamCount;
}
exports.teamCountParse = teamCountParse;

var quiz_questions = {};
exports.quiz_questions = quiz_questions;
async function quizQuestionsParse(key, pair) {
  quiz_questions[key] = pair;
  exports.quiz_questions = quiz_questions;
}
exports.quizQuestionsParse = quizQuestionsParse;

var answer_embeds = {};
exports.answer_embeds = answer_embeds;
async function answerEmbedsParse(num, key, pair) {
  if (answer_embeds[num]) {
    answer_embeds[num][key] =  pair;
  } else {
    answer_embeds[num] = {};
    answer_embeds[num][key] =  pair;
  }
  exports.answer_embeds = answer_embeds;
}
exports.answerEmbedsParse = answerEmbedsParse;

var scoreboard = {};
exports.scoreboard = scoreboard;
async function scoreboardParse(team_name, round_num, result) {
  if (scoreboard[team_name]) {
    scoreboard[team_name][round_num] = result;
  } else {
    scoreboard[team_name] = {};
    scoreboard[team_name][round_num] = result;
  }
  exports.scoreboard = scoreboard;
}
exports.scoreboardParse = scoreboardParse;

async function scoreboardSet(team_name) {
  if (scoreboard[team_name]) {
    admin_channel.send("I tried to set up an empty scoreboard entry for " + team_name + ", but an entry already exists!");
  } else {
    scoreboard[team_name] = {};
    scoreboard[team_name][1] = "Awaiting data...";
  }
  exports.scoreboard = scoreboard;
}
exports.scoreboardSet = scoreboardSet;

async function scoreboardDelete(type, a, b) {
  if (type == "merge") {
    if (scoreboard[a][b]) {
      delete scoreboard[a][b];
      admin_channel.send("I have deleted the scoreboard entry for " + a + " for Round Number " + b + ".");
      let prev_round = b - 1;
      if (prev_round > 0) {
        if (scoreboard[a][prev_round]) {
          admin_channel.send("Please note that there is a scoreboard entry for " + a + " for Round Number " + prev_round + ".  You may want to fix this.");
        }
      }
    } else {
      admin_channel.send("I could not find a scoreboard entry for " + a + " for Round Number " + b + " to delete.");
    }
    exports.scoreboard = scoreboard;
  } else if (type == "team") {
    if (scoreboard[a]) {
      delete scoreboard[a];
      admin_channel.send("I have deleted the scoreboard entry for " + a + ".");
    } else {
      admin_channel.send("I could not find a scoreboard entry for " + a + ".");
    }
  } else if (type == "num") {
    let round_deletions = [];
    let round_no_dels = [];
    for(team in scoreboard) {
      if (scoreboard[team][a]) {
        delete scoreboard[team][a];
        round_deletions.push(team);
      } else {
        round_no_dels.push(team);
      }
      if (Object.keys(scoreboard[team]).length === 0) {
        delete scoreboard[team];
      }
    }
    admin_channel.send("I have deleted round " + a + " for: " +  round_deletions.join(", "));
    admin_channel.send("I did not find a round " + a + " for: " +  round_no_dels.join(", "));
    if (answer_embeds[a]) {
      delete answer_embeds[a];
      admin_channel.send("I have also deleted the answer embeds for round " + a + ".");
    }
    exports.scoreboard = scoreboard;
    exports.answer_embeds = answer_embeds;
  }
}
exports.scoreboardDelete = scoreboardDelete;

var team_dictionary = {};
exports.team_dictionary = team_dictionary;
async function team_dictionaryParse(key, pair) {
  team_dictionary[key] = pair;
  exports.team_dictionary = team_dictionary;
}
exports.team_dictionaryParse = team_dictionaryParse;

var dateFetch = new Date();
var cooldownTime = dateFetch.getTime();
exports.cooldownTime = cooldownTime;
async function cooldownTimeSet() {
  dateFetch = new Date();
  cooldownTime = dateFetch.getTime();
  exports.cooldownTime = cooldownTime;
  console.log("New cooldownTime Set");
}
exports.cooldownTimeSet = cooldownTimeSet;

var admin_channel;
exports.admin_channel = admin_channel;

client.on("ready", () => {
    admin_channel = client.channels.cache.find(channel => channel.name === admin_channel_name);
    exports.admin_channel = admin_channel;
    client.user.setActivity({name: bot_activity_name, type: bot_activity_type, url: bot_activity_url})
        .then(presence => console.log(`Activity set to ${presence.activities[0]}`))
        .catch(console.error);
    dayChecker(quiz_day);
    teamCountParse(0);
    console.log("I am ready!");
    console.log("Prefix set to: " + prefix);
    console.log("Team Count is: " + teamCount);
    const today = new Date();
    if(today.getDay() == quiz_day_num || quiz_day_num == 9) {
	admin_channel.send("Bot Restarted. " + bot_startup_message + " Bot will now not restart for another 24hrs");
    }
    setQuizTeamCategoryChannel();
});

client.on("message", async (message, args) => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command);
  	if (!cmd) return;
	
	if (message.channel.type === 'dm') {
	    if (command === 'help') {
	        console.log(message.author.username + " has used the HELP command in their DM with the QuizBot.");
		cmd.run(message, args, 1);
		return;
	    } else {
		console.log(message.author.username + " has used the " + command + " command in their DM with the QuizBot.  I cannot handle this right now.  Ignoring...");
		return;
	    }
	}
	    
	let team_captain_id = message.guild.roles.cache.find(role => role.name === "Team Captain").id;
	
	if (message.member.hasPermission("MANAGE_ROLES")) {
	    console.log("ADMIN Command " + command + " requested by " + message.author.username);
	    cmd.run(message, args, 1);
	} else if (command === 'help') {
	    console.log("HELP command requested by " + message.author.username + " in the " + message.channel.name + " channel");
	    cmd.run(message, args, 0);
        } else if (message.member.roles.cache.has(team_captain_id)) {
            if (command === 'add' || command === 'remove' || command === 'promote') {
                console.log("CAPTAIN Command " + command + ": " + message.cleanContent + " requested by " + message.author.username);
		cmd.run(message, args);
	    } else if (command === 'register') {
		message.reply("thank you for trying - however, we are currently only allowing our admins to handle team registration.  One of them will handle this for you now.");
                admin_channel.send("Please handle Team Registration: " + args.join(' ') + "\n" + "Request made by " + message.author.username)
            } else {
                console.log("Command " + command + ": " + message.cleanContent + " requested by " + message.author.username);
                message.reply("This command isn't for you... :angry:");
                admin_channel.send("Attempted " + command + " Command: " + " made by " + message.author.username);
            } 
        } else return;
    } catch (e) {
        message.reply('Oops... something went wrong: ' + e.message);
    }
});

client.login(process.env.BOT_TOKEN);
