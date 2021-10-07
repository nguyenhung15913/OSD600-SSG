#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");

const parse = require("node-html-parser").parse;

//Gloabl variable needed to return inputFile in takefile function
let inputFileorDir;

const textToP = (input) => {
  return input
    .split(/\r?\n/)
    .map((elem) => `<p>${elem}</p>`)
    .join("\n");
};
const textToPMd = (input) => {
  return input
    .split(/[\r?\n\r?\n]/g)
    .map((line) => {
      return line
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
        .replace(/(^[a-z](.*)$)/gim, "<p>$1</p>")
        .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/\*\*(.*?!*)\*\*/gim, "<strong> $1 </strong>")
        .replace(/\*(.*?!*)\*/gim, "<i> $1 </i>")
        .replace(/---/gm, "<hr />");
    })
    .join("\n");
};

const getTitle = (input) => {
  return input.split(/\r?\n/).slice(0, 1);
};

const takeFile = () => {
  return inputFileorDir;
};

const addingStyleSheet = (parsedHtml) => {
  if (command.s) {
    let head = parsedHtml.querySelector("head");
    head.appendChild(parse(`<link href="${command.s}" rel="stylesheet" />`));
  }
};

const updatingLang = (parsedHtml) => {
  if (command.l) {
    if (command.l.length > 0 && command.l.length !== undefined) {
      parsedHtml.childNodes[1].rawAttrs = `lang="${command.l}"`;
      return console.log(`Language has been set`);
    }
    return console.log("Please add chosen language after flag. e.g: -f fr");
  }
};

const processInput = () => {
  fs.readFile(
    path.join(__dirname, "htmlTemplate.html"),
    "utf-8",
    (err, html) => {
      if (err) return console.log(err);

      const fileOrDir = takeFile();

      if (!fs.existsSync(fileOrDir)) {
        return console.log("No File or Directory Found");
      }

      const stats = fs.statSync(fileOrDir);

      const dir = path.join(process.cwd(), "dist");

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
      }

      if (stats.isFile()) {
        if (!fileOrDir.includes(".txt") && !fileOrDir.includes(".md")) {
          return console.log(
            "Only .txt files and .md files can be supported in this tool!"
          );
        }

        const isMDfile = fileOrDir.endsWith(".md");
        fs.readFile(`${fileOrDir}`, "utf-8", (error, data) => {
          if (error) return console.log(error);

          let parsedHtml = parse(html);

          addingStyleSheet(parsedHtml);
          updatingLang(parsedHtml);

          let title;
          let bodyPart;
          let body = parsedHtml.querySelector("body");

          if (isMDfile) {
            // if it is md file, the title will be the first h1
            bodyPart = textToPMd(data);
            body.appendChild(parse(bodyPart));
            title = body.querySelector("h1")?.text || "Document";
          } else {
            title = getTitle(data);
            bodyPart = textToP(data);
            body.appendChild(parse(bodyPart));
            body.querySelector("p").replaceWith(parse(`<h1>${title}</h1>`));
          }
          parsedHtml.querySelector("title").set_content(title);
          if (
            !fs.existsSync(
              path.join(process.cwd(), "dist", `${fileOrDir}.html`)
            )
          ) {
            fs.writeFile(
              `${process.cwd()}/dist/index.html`,
              parsedHtml.toString(),
              (e) => {
                if (e) return console.log(e);
                console.log("New file has been created!!");
              }
            );
          }
        });
      } else {
        const files = fs.readdirSync(fileOrDir);
        if (files.length <= 0) {
          return console.log("There is no file in the directory");
        }
        let count = 0;
        files.forEach((file) => {
          const isMDfile = file.endsWith(".md");
          fs.readFile(path.join(fileOrDir, file), "utf-8", (error, data) => {
            if (error) return console.log(error);
            let parsedHtml = parse(html);

            addingStyleSheet(parsedHtml);
            updatingLang(parsedHtml);

            let title;
            let bodyPart;
            let body = parsedHtml.querySelector("body");
            if (isMDfile) {
              // if it is md file, the title will be the first h1
              bodyPart = textToPMd(data);
              body.appendChild(parse(bodyPart));
              title = body.querySelector("h1")?.text || "Document";
            } else {
              title = getTitle(data);
              bodyPart = textToP(data);
              body.appendChild(parse(bodyPart));
              body.querySelector("p").replaceWith(parse(`<h1>${title}</h1>`));
            }

            parsedHtml.querySelector("title").set_content(title);
            const pathName = `${process.cwd()}/dist/${file}.html`;

            if (!fs.existsSync(pathName)) {
              count++;

              fs.writeFile(
                path.join(process.cwd(), "dist", `index${count}.html`),
                parsedHtml.toString(),
                (e) => {
                  if (e) return console.log(e);
                  console.log("New file has been created in dist directory!!");
                }
              );
            }
          });
        });
      }
    }
  );
};

let cli = require("yargs");
const { on } = require("events");

cli = cli
  .usage("All available options for OSDSSG: ")
  .version(
    true,
    "Display current version of osdssg",
    "Current version of osdssg is 1.0.0"
  )
  .option("help", {
    alias: "h",
    desc: "Displaying all options available",
  })
  .option("input", {
    type: "boolean",
    alias: "i",
    desc: "Input file's name or directory's name e.g: osdssg --input text.txt or osdssg -i ./dir1",
  })
  .option("version", {
    alias: "v",
    desc: "Show current version of osdssg",
  })
  .option("stylesheet", {
    alias: "s",
    desc: "Optionally specify a URL to a CSS stylesheet in the <head> of the HTML file",
  })
  .option("lang", {
    alias: "l",
    desc: "Add an option flag to indicates the language of the html element. e.g: --lang fr is lang='fr' means using French",
  })
  .option("config", {
    type: "boolean",
    alias: "c",
    desc: "Optionally specify a json file that is parsed and provides input, stylesheet or lang e.g: -c config.json",
  }).argv;

const command = yargs.argv;

if (command.c || command.config) {
  if (command._.length <= 0) {
    return console.log(
      "Please enter a config file name e.g: --config config.json"
    );
  }

  if (!yargs.argv._[0].endsWith(".json"))
    return console.log("Config file must be a json file");

  if (!fs.existsSync(yargs.argv._[0]))
    return console.log("Config file does not exist");

  const configFile = fs.readFileSync(yargs.argv._[0]);
  const config = JSON.parse(configFile);

  inputFileorDir = config.input;
  command.s = config.stylesheet;
  command.l = config.lang;

  processInput();
}

if (command.i || command.input) {
  if (command._.length <= 0) {
    return console.log(
      "Please enter file name or folder e.g: --input text.txt"
    );
  }

  inputFileorDir = yargs.argv._[0];

  processInput();
}
