const fs = require ("fs");
const open = require ("open");
const inquirer = require ("inquirer");
const axios = require ("axios");


const questions = [
    {
        type: "input",
        name: "name",
        message: "What is your Github username?"
      },
      {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ["red", "blue", "green", "yellow", "purple"]
      }
];

function writeToFile(fileName, data) {
 
}

async function init() {
    
        const answers = await inquirer.prompt(questions);
        console.log (answers)
        if (answers) {
            axios.get(`https://api.github.com/users/${answers.name}`)
                .then(results => {
                    console.log(results.data, 'results')
                })
        }
      
}
init();
