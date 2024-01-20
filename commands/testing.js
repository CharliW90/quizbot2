exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    var members = await message.guild.members.fetch();
    var quizmasters = await message.guild.roles.cache.find(role => role.name === 'Quizmaster').members;
    try {
        //  put test code below this line ---------------
        
        var quizmasterMembers = [];
        await quizmasters.forEach((member) => {
            quizmasterMembers.push(member);
        });
        console.log(quizmasterMembers)
        await message.channel.send(`TEST: Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to ${quizmasterMembers.join(',')}.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:`);
        
        
        //  put test code above this line ---------------
        await message.delete();
    } catch (e) {
        throw e;
    }
}
