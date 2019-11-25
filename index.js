const fs = require("fs");
const open = require("open");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML")
const path = require('path');
const puppeteer = require('puppeteer');
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);



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

const compile = async function(filename, data) {
  const filePath = path.join(process.cwd(),"resume.pdf");
  const html = await fs.readFile(filePath, 'utf-8');
};

async function init() {

  const answers = await inquirer.prompt(questions);
  console.log(answers)
  if (answers) {

    axios.get(`https://api.github.com/users/${answers.name}`)
      .then(res => {

        //console.log(results.data, 'results')
        axios.get(`https://api.github.com/users/${answers.name}/repos`)
          .then(results => {
            // console.log(results.data, 'repos')

            const stars = results.data.reduce((previous, current) => {
              previous += current.stargazers_count
              return previous
            }, 0)

            console.log(stars)
            console.log(answers.color)

            return generateHTML({
              color: answers.color,
              stars,
              ...res.data
            })
          })

            (async () => {
              try {

                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                const content = compile("generateHTML");
               
                await page.setContent("content");
                await page.emulateMedia("screen");

                // Generates a PDF from the page content
                await page.pdf({ path: 'resume.pdf'});

                console.log('done');
                await browser.close();
                process.exit();

              } catch (e) {
                console.log('our error', e);
              }

            })();

           

          })
      

  }
}
init();

