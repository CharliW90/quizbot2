
// we will need an 'initiate' command
var teams = [];
exports.teams = teams;

// first we define what a 'Team' object looks like  (this is essentially a template)
function Team(n, name, tc, vc, members, colour) {
    this.registrationNumber = n;
    this.name = name;
    this.textChannel = tc;
    this.voiceChannel = vc;
    this.members = members;
    this.colour = colour;
    this.rounds = [];
    this.roundsUpdate = function(round) {
        this.rounds.push(round);
    }
    this.totalScore = 0;
    this.scoreUpdate = function() {
        let sum = 0;
        for (round of this.rounds) {
            sum += round.roundScore;
        }
        this.totalScore = sum;
    };
    this.scoreAmend = function(score) {
        let oldScore = this.totalScore;
        this.totalScore = oldScore + score;
    }
}
// next we define what a 'Round' object looks like  (another template)
function Round(num, score, embed) {
    this.roundNumber = num;
    this.roundScore = score;
    this.resultsEmbed = embed;
}

//then we create a function for creating a new team and .pushing it into the teams object
async function register(n, name, tc, vc, members, colour) {
    try {
        let newTeam = await new Team(n, name, tc, vc, members, colour);
        teams.push(newTeam);
    } catch (e) {
        throw e;
    }
}
exports.register = register;

//then we create a function for creating a new round of scores and .pushing it into the relevant team object
async function answers(teamName, num, score, embed) {
    try {
        let newRound = await new Round(num, score, embed);
        let foundTeam = false;
        for (team in teams) {
            if(team.name == teamName) {
                foundTeam = true;
                team.roundsUpdate(newRound);
            }
        }
        if (!foundTeam) {
            let unregisteredTeam = await new Team(teams.length + 1, teamName, "none", "none", "none", "GRAY");
            await unregisteredTeam.roundsUpdate(newRound);
            teams.push(unregisteredTeam);
        }
    } catch (e) {
        throw e;
    }
}
exports.answers = answers;

//command = answers
//then update the 'total score' for the team in the teams object
