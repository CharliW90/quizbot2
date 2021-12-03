exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    try {
        await message.guild.members.fetch()
          .catch(console.error);
        if (message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams") == undefined) {
            message.reply('Cannot find the Quiz Teams Category');
        } else {
            const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;
            quizTeamChannels.forEach(channel => {
                if (channel.type == 'text') {
                  //we only want to get the role from the first channel we encounter, because by the time we get to the second it has already been deleted
                  if (message.guild.roles.cache.find(role => role.id === channel.permissionOverwrites.array()[1].id)) {
                    console.log(channel.permissionOverwrites);
                    console.log(channel.permissionOverwrites.array());
                  }
                }
            });
        } else {
            message.reply('there is nothing to reset!');
        }
    } catch (e) {
        throw e;
    }
}
