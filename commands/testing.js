exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    var quizmasters1 = message.guild.roles.cache.find(role => role.name === 'Quizmaster').members.map(m=>m.user.tag).join(',');
    var quizmasters2 = message.guild.roles.cache.find(role => role.name === 'Quizmaster').members;
    try {
        message.reply(`A: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${...quizmasters1}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
        message.reply(`B: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${...quizmasters2}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
        message.reply(`C: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${quizmasters1.join(',')}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
        message.reply(`D: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${...quizmasters1.join(',')}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
    } catch (e) {
        throw e;
    }
}
