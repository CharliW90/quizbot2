exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = base.Discord;
    try {
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
        let teamMembersAdd = [],
            teamName = [];
        let x = 0;
        for (let arg of args) {
            if (arg.startsWith("<@&")) {
                    teamName.push(arg);
                } else if (arg.startsWith("<@" || "!")) {
                    let userCheck = (await message.guild.members.fetch(arg.replace("<@", "").replace("!", "").replace('>', '')));
                    let teamNameID = teamNameFetch.id;
                    if (userCheck._roles.includes(teamNameID)){
                        message.channel.send("Uhhh, I don't  know how to tell you this, but " + userCheck.user.username + " is already in " + teamNameFetch.name + "  :person_facepalming:");
                        var earlierError = 1;
                    } else if (userCheck.hasPermission("MANAGE_ROLES")) {
                        message.channel.send("No.  You cannot add " + userCheck.user.username + " to the team.  They're an admin. :angry:");
                        var earlierError = 1;
                    } else {
                        teamMembersAdd.push(arg);
                    }
                } else return;
        };
        if (teamMembersAdd.length === 0) {
            if (earlierError === 1) {
                console.log("The only member requested to be added was already in the team.  Ignoring command.");
                var earlierError = 0;
            } else {
                message.channel.send('I need you to tell me the team member(s) to add, please!  :face_with_monocle:');
            }
        } else if ((teamNameFetch.members.size + teamMembersAdd.length) > 4) {
            message.channel.send('That would cause there to be too many people in that team!  :person_facepalming:');
        } else { 
            let team_members = [];
            for (let i = 0; i < teamMembersAdd.length; i++) {
                const memberAdd = teamMembersAdd[i];
                const member_user = await message.guild.members.fetch(memberAdd.replace("<@", "").replace("!", "").replace('>', ''));
                member_user.roles.add(teamNameFetch).catch(console.error);;
                team_members.push(member_user.displayName);
                }
            if (team_members.length > 0){
                const success_embed = new Discord.MessageEmbed()
                .setColor(teamNameFetch.color)
                .setTitle('Team Members Changed')
                .addFields(
                    {name: 'Team Name', value: teamNameFetch.name,},
                    {name: 'Member(s) Added', value: team_members.join('\n')},
                );
                message.channel.send(success_embed); 
            } else return;
        }
    } catch (e) {
        throw e;
    }
} 
