exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    try {
        if (!message.mentions.users.first()) {
            message.reply("I need to know who it is you want to promote, ya dangus! :face_palm:");
            return;
        }
        const role_captain = message.guild.roles.cache.find(role => role.name === 'Team Captain');
        const promotedCaptainID = await message.mentions.users.first().id;
        var promotedCaptainFetch = await message.guild.members.fetch(promotedCaptainID)
        if (promotedCaptainFetch.hasPermission("MANAGE_ROLES")) {
            message.reply("No.  You cannot have an admin on your team.  :angry:");
            return;
        }
        var promotedCaptainRoles = await Array.from(promotedCaptainFetch._roles);
        var demotedCaptainFetch;
        var demotedCaptainRoles;
        var demotedCaptainID;
        var teamRole;
        var relevant_team;
        var team_roles_match = 0;
        if (message.member.hasPermission("MANAGE_ROLES")) {
            relevant_team = await message.guild.roles.cache.find(role => role.id === promotedCaptainRoles[0]);
            let teamMembers = relevant_team.members;
            await teamMembers.forEach((member) => {
                let teamMembersRoles = member._roles;
                if (teamMembersRoles.includes(role_captain.id)) {
                    demotedCaptainID = member.id;
                };
            });
            if (demotedCaptainID === void(0)) {
                message.channel.send("I'm sorry - I failed to find the Team Captain for the relevant team...  :confused:");
                return;
            } else {
                demotedCaptainFetch = await message.guild.members.fetch(demotedCaptainID);
                demotedCaptainRoles = await Array.from(demotedCaptainFetch._roles);
            }
        } else {
            demotedCaptainID = message.author.id;
            demotedCaptainFetch = await message.guild.members.fetch(demotedCaptainID);
            demotedCaptainRoles = await Array.from(demotedCaptainFetch._roles);
            relevant_team = await message.guild.roles.cache.find(role => role.id === demotedCaptainRoles[0]);
        }

        await demotedCaptainRoles.forEach((role) => {
            if (promotedCaptainRoles.includes(role)) {
                team_roles_match = 1;
            }
        });
        if (team_roles_match = 1) {
            await demotedCaptainFetch.roles.remove(role_captain).catch(console.error);
            await promotedCaptainFetch.roles.add(role_captain).catch(console.error);
            const success_embed = new Discord.MessageEmbed()
                .setColor(relevant_team.color)
                .setTitle('Team Captain Changed')
                .addFields(
                    {name: 'Team Name', value: relevant_team.name,},
                    {name: 'Captain Removed', value: demotedCaptainFetch.displayName},
                    {name: 'Captain Added', value: promotedCaptainFetch.displayName},
                );
            message.channel.send(success_embed);
        } else {
            message.channel.send("I'm sorry - the teams don't appear to match between the Demoted Captain and the Promoted Captain...  :confused:");
            return;
        }
    } catch (e) {
        throw e;
    }
}
