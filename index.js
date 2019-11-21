const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function ({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    axios
      .get(queryUrl)
      .then(response => {
        console.log(response.data);
        const repoNames = response.data.map(function (repo) {
          return repo.name;
        });

        const repoNameStr = repoNames.join('\n');
        console.log(repoNameStr)

      })
  });

