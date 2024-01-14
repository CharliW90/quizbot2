exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    try {
        const teamPos = message.guild.roles.cache.find(role => role.name === 'Team Captain') - 1;
        message.guild.roles.cache.forEach(role => {
          if(role <= teamPos){
            message.reply(`Testing - this command would have deleted ${role}`)
          }
        })
    } catch (e) {
        throw e;
    }
}
