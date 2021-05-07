exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var quiz_questions = base.quiz_questions;
    try {
        let relevant_question = args.join(' ');
        if (quiz_questions[relevant_question]) {
	    let announcement_title = relevant_question;
	    let announcement_content = quiz_questions[relevant_question];
	    const cmd = base.commands.get("announce");
	    cmd.run(message, args, announcement_title, announcement_content);
	} else {
	    message.reply("Sorry, I couldn't find a question saved as " + relevant_question);
	}
    } catch (e) {
        throw e;
    }
}
