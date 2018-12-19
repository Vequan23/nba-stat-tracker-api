const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const Xray = require('x-ray');
const teamData = require('./teams.json');

const xray = new Xray();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/find-team', (req, res) => {
    const { abbreviation } = req.body;

    const filteredTeam = teamData.find(team => {
        return team.abbr === abbreviation;
    });

    const teamAbbr = filteredTeam.abbr;
    const teamFullName = filteredTeam.fullTeamName;

    xray(`https://www.cbssports.com/nba/teams/${teamAbbr}/${teamFullName}/`, {
        team: '.PageTitle-header',
        record: '.PageTitle-description',
        teamLogo: '.TeamLogo-image@src'
    })(function(err, results) {
        let test = JSON.stringify(results);
        let transformedRecord = results.record.trim();
        let transformedTeam = results.team.trim();
        const recordOnly = transformedRecord.split(' ');


        newResults = {
            team: transformedTeam,
            record: recordOnly[0],
            teamLogo: results.teamLogo
        };

        res.json(newResults);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
