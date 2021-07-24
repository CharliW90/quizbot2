exports.run = async (message, args) => {
  var base = require('/app/bot.js');
  var Discord = base.Discord;
  var teamCount = base.teamCount;
  var admin_channel = base.admin_channel;
  var teamsObject = require('/app/objects/teams.js');
  try {
    // ------------------------ EDIT BELOW THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
    const http = require("http")
    http
      .request(
        {
          hostname: "https://script.google.com",
          path: "/macros/s/AKfycby2Wqb6CaV-EUiWVSTUZ6S0ZDH8yiFs6mL9KnM_gC1jWX6mv3LQYKuqCxKP-rdbUIessA/exec"
        },
        res => {
        let data = ""

        res.on("data", d => {
          data += d
        })
        res.on("end", () => {
          console.log(data)
        })
      }
    )
  .end()
    // ------------------------ EDIT ABOVE THIS LINE AS MUCH AS YOU LIKE -----------------------------------------
  } catch (e) {
    throw e;
  }
}
