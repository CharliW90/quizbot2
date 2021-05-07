exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    try {
        var question_number = args.shift();
        var question_content = args.join(' ');
        await base.quizQuestionsParse(question_number, question_content);
        const set_embed = new Discord.MessageEmbed()
	      .setColor("PURPLE")
	      .setTitle('Quiz Question Stored:')
	      .addField('Question ' + question_number, question_content);
	    message.channel.send(set_embed);
    } catch (e) {
        throw e;
    }
}
