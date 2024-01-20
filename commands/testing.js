exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    var members = await message.guild.members.fetch();
    var quizmasters = await message.guild.roles.cache.find(role => role.name === 'Quizmaster');
    var quizmasterMembers = quizmasters.members
    try {
        await quizmasterMembers.forEach((member) => {
            console.log("member found");
            console.log(member.id);
            console.log(member._roles);
            console.log(member.keys());
            console.log(member.keys);
            console.log(member.name);
            console.log(member);
        })
        //message.reply(`D: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${quizmasters2.join(',')}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
    } catch (e) {
        throw e;
    }
}
