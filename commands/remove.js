exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    var earlierError = 0;
    try {
        const role_captain = message.guild.roles.cache.find(role => role.name === 'Team Captain');
        let teamNameFetch = message.mentions.roles.first();
        if (teamNameFetch === undefined) {
            message.channel.send('I need you to tell me the team name, please!  :confused:');
            return;
        }
        let captainCheck = await message.guild.members.fetch(message.author.id);
        let captainCheckRoles = await Array.from(captainCheck._roles);
        if ((!captainCheckRoles.includes(teamNameFetch.id)) && (!message.member.hasPermission("MANAGE_ROLES"))) {
            message.channel.send('You cannot mess with other teams!  :rage:');
            return;
        };
        let teamMembersRemove = [],
            teamName = [];
        let x = 0;
        for (let arg of args) {
            if (arg.startsWith("<@&")) {
                    teamName.push(arg);
                } else if (arg.startsWith("<@" || "!")) {
                    let userCheck = (await message.guild.members.fetch(arg.replace("<@", "").replace("!", "").replace('>', '')));
                    let teamNameID = teamNameFetch.id;
                    if (userCheck._roles.includes(teamNameID)){
                        if (userCheck._roles.includes(role_captain.id)){
                            message.channel.send("No, I cannot remove " + userCheck.user.username + " from " + teamNameFetch.name + " because they are the 'Team Captain'  :person_facepalming:");
                            earlierError = 1;
                        } else
                            teamMembersRemove.push(arg);
                    } else
                        message.channel.send("Uhhh, I don't  know how to tell you this, but " + userCheck.user.username + " is not in " + teamNameFetch.name + "  :person_facepalming:");
                        earlierError = 1;
                } else return;
        };
        let prefix1 = "<@";
        let prefix2 = "<@!";
        let suffix = ">";
        let authorname1 = prefix1.concat(message.author.id).concat(suffix);
        let authorname2 = prefix2.concat(message.author.id).concat(suffix);
        if (teamMembersRemove.length === 0) {
            if (earlierError === 1) {
                console.log("The only member requested to be removed was the Team Captain.  Ignoring command.");
                earlierError = 0;
            } else {
                message.channel.send('I need you to tell me the team member(s) to remove, please!  :face_with_monocle:');
            }
        } else if ((teamMembersRemove.includes(authorname1) || teamMembersRemove.includes(authorname2)) && (!message.member.hasPermission("MANAGE_ROLES"))) {
            message.channel.send('You cannot use this command to remove yourself from a team, someone else must do this as the "Team Captain".  Use the "promote" command first to create a new "Team Captain"');
        } else if ((teamNameFetch.members.size - teamMembersRemove.length) < 1) {
            message.channel.send('That would cause there to be no one left in that team!  :person_facepalming:');
        } else { 
            let team_members = [];
            for (let i = 0; i < teamMembersRemove.length; i++) {
                const memberRemove = teamMembersRemove[i];
                const member_user = await message.guild.members.fetch(memberRemove.replace("<@", "").replace("!", "").replace('>', ''));
                member_user.roles.remove(teamNameFetch).catch(console.error);;
                team_members.push(member_user.displayName);
                }
            if (team_members.length > 0){
                const success_embed = new Discord.MessageEmbed()
                .setColor(teamNameFetch.color)
                .setTitle('Team Members Changed')
                .addFields(
                    {name: 'Team Name', value: teamNameFetch.name,},
                    {name: 'Member(s) Removed', value: team_members.join('\n')},
                );
                message.channel.send(success_embed); 
            } else return;
        }
    } catch (e) {
        throw e;
    }
}
