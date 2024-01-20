exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    console.log(`Hard Reset requested by ${message.author}`);
    try {
        const allRoles = message.guild.roles.fetch();
        const teamPos = message.guild.roles.cache.find(role => role.name === 'Team Captain').rawPosition;
        const deletedRoles = []
        let deletionCount = 0
        message.guild.roles.cache.forEach((role) => {
          if(role.rawPosition < teamPos && role.rawPosition > 0){
            deletedRoles.push(role.name);
            deletionCount++;
            role.delete().catch(console.error);
          }
        })
        if(deletedRoles[0]){
            const reset_embed = new Discord.MessageEmbed()
                .setColor('#ea0dc1')
                .setTitle('Virtual Quizzes Discord Server Hard Reset')
                .setDescription(`${deletionCount} Roles Deleted`)
                .addField('Deleted Roles:', deletedRoles.join('\n'))
            message.channel.send(reset_embed);
        } else {
            message.reply("there are no roles beneath 'Team Captain' in the heirarchy of roles - nothing to delete...");
        }
    } catch (e) {
        throw e;
    }
}
