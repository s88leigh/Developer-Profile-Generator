const fs = require ("fs");
const open = require ("open");
const inquirer = require ("inquirer");
const axios = require ("axios");
const generateHTML = require ("./generateHTML")
const convertFactory = require('electron-html-to');
const path = require ('path');


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
                .then(res => {
               
                    // console.log(results.data, 'results')
                    axios.get(`https://api.github.com/users/${answers.name}/repos`)
                        .then(results => {
                            // console.log(results.data, 'repos')
                        
                        const stars = results.data.reduce((previous, current) => {
                            previous += current.stargazers_count
                            return previous
                          }, 0)

                          console.log(stars)

                          return generateHTML({ 
                            color: answers.color,
                            stars,
                            ...res.data
                          })
                }).then(html => {
                  const conversion = convertFactory({
                    converterPath: convertFactory.converters.PDF
                 
                  });
                  conversion({ html}, function(err, result) {
                    if (err) {
                      return console.error(err);
                    }
                   
                    console.log(result.numberOfPages);
                    console.log(result.logs);
                    result.stream.pipe(fs.createWriteStream(path.join(__dirname, "./resume.pdf")));
                    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                })
                open(path.join(process.cwd(),"resume.pdf"))
                
            })
        })
    
      }
    }
init();
