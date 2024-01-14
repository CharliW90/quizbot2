exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var teamCount = base.teamCount;
    var admin_channel = base.admin_channel;
    console.log(`Hard Reset requested by ${message.author.name}`);
    try {
        const allRoles = message.guild.roles.fetch();
        const teamPos = message.guild.roles.cache.find(role => role.name === 'Team Captain').rawPosition;
        message.guild.roles.cache.forEach((role) => {
          if(role.rawPosition < teamPos && role.rawPosition > 0){
            console.log(role.name)
            message.reply(`Testing - this command would have deleted ${role}`)
          }
        })
    } catch (e) {
        throw e;
    }
}
