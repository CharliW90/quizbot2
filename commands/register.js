exports.run = async (message, args) => {
    var base = require('/app/bot.js');
    var Discord = await base.Discord;
    var teamCount = await base.teamCount;
    var teamsObject = require('/app/objects/teams.js');
    try {
        if (message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams") == undefined) {
            await message.guild.channels.create('Quiz Teams', {type: 'category',});
            message.reply('I cannot find the Quiz Teams category.  I have created it now.');
            await base.setQuizTeamCategoryChannel();
        }
        const team_category_channel = base.quizTeamsParentID;
        let argsWithoutMentions = [],
            mentions = [];
        let x = 0;

        for (let arg of args) {
            if (x == 0) {
                if (arg.startsWith("<@" || "!")) {
                    mentions.push(arg);
                    x++
                } else argsWithoutMentions.push(arg);
            } else if (arg.startsWith("<@" || "!")) mentions.push(arg);
            else return;
        }

        let newTeamName = argsWithoutMentions.join(' ');
        let teamColour = await base.colours[teamCount];
        let textChannelTeamName = newTeamName;

        if (newTeamName.length === 0) {
            message.reply('I need a team name in order to register a team, ya dangus!');
        } else if (mentions.length > 4) {
            message.reply('You tried to register *' + newTeamName + '*. I cannot register a team with more than 4 members, sorry!');
        } else if (mentions.length === 0) {
            message.reply('You tried to register *' + newTeamName + '*. I cannot register a team with no members, sorry!');
        } else {
            if (textChannelTeamName.includes("+") || textChannelTeamName.includes("-") || textChannelTeamName.includes("'")) {
              while (textChannelTeamName.includes("+")) {
                textChannelTeamName = textChannelTeamName.replace("+", "＋");
              }
              while (textChannelTeamName.includes("-")) {
                textChannelTeamName = textChannelTeamName.replace("-", "–");
              }
              while (textChannelTeamName.includes("'")) {
                textChannelTeamName = textChannelTeamName.replace("'", "´");
              } 
            }
            if (base.teamCount > base.colours.length) {
                console.log("More teams than colours! Resetting counter...")
                teamCount = 0;
                await base.teamCountParse(teamCount);
                console.log("Base Team Count: " + base.teamCount);
            }
            let teamPos = message.guild.roles.cache.find(role => role.name === 'Team Captain') - 1;
            const createdRole = await message.guild.roles.create({
                data: {
                    name: newTeamName,
                    color: teamColour,
                    hoist: true,
                    position: teamPos,
                    mentionable: true,
                }
            });
            let success_message = ['Created team: ' + createdRole.name];
            teamCount++;
            var tc;
            var vc;
            var all_team_members = [];
            await base.teamCountParse(teamCount);
            const role_everyone = message.guild.roles.cache.find(role => role.name === '@everyone');
            const role_captain = message.guild.roles.cache.find(role => role.name === 'Team Captain');
            const vip = message.guild.roles.cache.find(role => role.name === 'Special Guest');
            await message.guild.channels.create(textChannelTeamName, {
                type: 'text', parent: team_category_channel, position: teamCount, permissionOverwrites: [
                    {
                        id: role_everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: createdRole,
                        allow: ['VIEW_CHANNEL']
                    },
                    {
                        id: vip,
                        allow: ['VIEW_CHANNEL']
                    }
                ]
            })
                .then(function(response) {
                    tc = response.id
            });
            success_message.push('Text channel created for: ' + createdRole.name);
            await message.guild.channels.create(createdRole.name, {
                type: 'voice', parent: team_category_channel, position: teamCount, permissionOverwrites: [
                    {
                        id: role_everyone,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: createdRole,
                        allow: ['VIEW_CHANNEL']
                    },
                    {
                        id: vip,
                        allow: ['VIEW_CHANNEL']
                    }
                ]
            })
                .then(function(response) {
                    vc = response.id
            });
            success_message.push('Voice channel created for: ' + createdRole.name);

            let teamCaptain = mentions[0];
            const member_Captain = await message.guild.members.fetch(teamCaptain.replace("<@", "").replace("!", "").replace('>', ''));
            member_Captain.roles.add(role_captain).catch(console.error);
            success_message.push('Team Captain set: ' + member_Captain.displayName);
            let team_members = [];
            for (let i = 0; i < mentions.length; i++) {
                const mention = mentions[i];
                const member_user = await message.guild.members.fetch(mention.replace("<@", "").replace("!", "").replace('>', ''));
                member_user.roles.add(createdRole).catch(console.error);
                success_message.push('Team Member Added: ' + member_user.displayName);
                if (i > 0) {
                    team_members.push(member_user.displayName)
                };
                all_team_members.push(member_user);
            }

            if (team_members.length == 0) {
                const success_embed = new Discord.MessageEmbed()
                    .setColor(teamColour)
                    .setTitle('Quiz Team Registered')
                    .addFields(
                        {name: 'Team Name', value: createdRole.name,},
                        {name: 'Team Captain/Member', value: member_Captain.displayName},
                    );
                await message.channel.send(success_embed);
            } else {
                const success_embed = new Discord.MessageEmbed()
                    .setColor(teamColour)
                    .setTitle('Quiz Team Registered')
                    .addFields(
                        {name: 'Team Name', value: createdRole.name,},
                        {name: 'Team Captain', value: member_Captain.displayName},
                        {name: 'Team Members', value: team_members.join('\n')},
                    );
                await message.channel.send(success_embed);
            }
            if (newTeamName != textChannelTeamName) {
              console.log("Adding Dictionary entry for " + newTeamName + " to link to " + textChannelTeamName + ".");
              await base.team_dictionaryParse(newTeamName, textChannelTeamName);
              await base.scoreboardSet(newTeamName);
            }
            await teamsObject.register(teamCount, createdRole.name, tc, vc, all_team_members, teamColour);
            member_Captain.send("Hi there, and welcome to the Virtual Quiz!  :grin:  As the Team Captain, you are able to use my 'add', 'remove', and 'promote' commands and you also have access to the 'ask-the-quizmasters' text channel to speak to JoRo and Arcadius.  If you need any help with my commands just use ++help in your text channel.  Good luck, have fun!  :heart:");
        }
    } catch (e) {
        throw e;
    }
}
