exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    try {
        await message.guild.members.fetch()
          .catch(console.error);
        let reset_text_channels = [];
        let reset_voice_channels = [];
        let reset_roles = [];
        if (message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams") == undefined) {
            message.reply('Cannot find the Quiz Teams Category');
        } else {
            const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;

            quizTeamChannels.forEach(channel => {
                if (channel.type == 'text') {
                  //we only want to get the role from the first channel we encounter, because by the time we get to the second it has already been deleted
                  if (message.guild.roles.cache.find(role => role.id === channel.permissionOverwrites.array()[1].id)) {
                    reset_text_channels.push(channel.name);
                    const role = message.guild.roles.cache.find(role => role.id === channel.permissionOverwrites.array()[2].id)
                    reset_roles.push(role.name)
                    role.delete().catch(console.error);
                    channel.delete().catch(console.error);
                  } else {
                    admin_channel.send("I can't find a role for " + channel.name + " - you may need to manually delete it");
                    //despite failing to delete the role, we should still delete the channel - leaves less to manually tidy up
                    channel.delete().catch(console.error);
                  }
                } else {
                    reset_voice_channels.push(channel.name);
                    channel.delete().catch(console.error);
                }
            });
            const teamCaptainRole = await message.guild.roles.cache.find(role => role.name === "Team Captain");
            const teamCaptains = await message.guild.members.cache.filter(member => member.roles.cache.find(role => role == teamCaptainRole)).map(member => member.user);
            let n = 1;
            let o = teamCaptains.length;
            console.log("There are " + o + " users with the Team Captain Role.");
            for (let user of teamCaptains) {
              let captain = await message.guild.members.fetch(user);
              captain.roles.remove(teamCaptainRole).catch(console.error);
              console.log("Removed captain role from: " + user.username);
              console.log("They were " + n + " of " + o);
              n++;
            };
        };

        teamCount = 0;
        await base.teamCountParse(teamCount);
        if (reset_text_channels.length > 0) {
            const reset_embed = new Discord.MessageEmbed()
                .setColor('#ea0dc1')
                .setTitle('Virtual Quizzes Discord Server Reset')
                .setDescription('Teams and Channels Deleted')
                .addField('Deleted Text Channels for:', reset_text_channels.join('\n'))
                .addField('Deleted Voice Channels for:', reset_voice_channels.join('\n'))
                .addField('Deleted Roles for:', reset_roles.join('\n'))
                .addField('TeamCount', teamCount)
            message.channel.send(reset_embed);
        } else {
            message.reply('there is nothing to reset!');
        }
    } catch (e) {
        throw e;
    }
}
