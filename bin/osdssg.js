#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const { textToPMd, syntaxHighlight } = require("./markdown");
const { parse } = require("node-html-parser");

const addingDataToHTMLFile = (parsedHtml, data, isMDfile) => {
	let title;
	let bodyPart;
	let body = parsedHtml.querySelector("body");
	let head = parsedHtml.querySelector("head");
	if (isMDfile) {
		// if it is md file, the title will be the first h1
		bodyPart = textToPMd(data);
		body.appendChild(parse(bodyPart));
		syntaxHighlight(body, head);
		title = body.querySelector("h1")?.text || "Document";
	} else {
		title = getTitle(data);
		bodyPart = textToP(data);
		body.appendChild(parse(bodyPart));
		body.querySelector("p").replaceWith(parse(`<h1>${title}</h1>`));
	}
	parsedHtml.querySelector("title").set_content(title);
};

const textToP = (input) => {
	return input
		.split(/\r?\n/)
		.map((elem) => `<p>${elem}</p>`)
		.join("\n");
};

const getTitle = (input) => {
	return input.split(/\r?\n/).slice(0, 1);
};

const takeFile = () => {
	return yargs.argv._[0];
};

const addingStyleSheet = (parsedHtml, css) => {
	if (command.s || css) {
		const styleSheet = css ?? command.s;
		let head = parsedHtml.querySelector("head");
		if (styleSheet) {
			head.appendChild(parse(`<link href="${styleSheet}" rel="stylesheet" />`));
		}
	}
};

const updatingLang = (parsedHtml, lang) => {
	if (command.l || lang) {
		const language = lang ?? command.l;
		if (language && language.length > 0) {
			parsedHtml.childNodes[1].rawAttrs = `lang="${language}"`;
			return console.log(`Language has been set`);
		}
		return console.log("Please add chosen language after flag. e.g: -f fr");
	}
};

let cli = require("yargs")
	.usage("All available options for OSDSSG: ")
	.version(
		true,
		"Display current version of osdssg",
		"Current version of osdssg is 1.0.0"
	)
	.option("help", {
		alias: "h",
		desc: "Displaying all options available"
	})
	.option("input", {
		type: "boolean",
		alias: "i",
		desc: "Input file's name or directory's name e.g: osdssg --input text.txt or osdssg -i ./dir1"
	})
	.option("version", {
		alias: "v",
		desc: "Show current version of osdssg"
	})
	.option("stylesheet", {
		alias: "s",
		desc: "Optionally specify a URL to a CSS stylesheet in the <head> of the HTML file"
	})
	.option("lang", {
		alias: "l",
		desc: "Add an option flag to indicates the language of the html element. e.g: --lang fr is lang='fr' means using French"
	})
	.option("config", {
		alias: "c",
		desc: "Add an option flag to indicates the config for replacing using command line argument. e.g: --config ./ssg-config.json means using ./ssg-config.json's values for command line argument."
	}).argv;

const command = yargs.argv;

//moved if condition to here and added config identify opt
if (!command.c && command.config && !command.i && !command.input) {
	return console.log(
		`Please enter file name or folder e.g: --input text.txt or --config ssg-config.json`
	);
}

let fileOrDir;
let outputDir;
let lang;
let css;

if (command.c || command.config) {
	//check if the file is json
	if (!command.c.endsWith("json") || !command.config.endsWith("json")) {
		return console.log("Sorry your input file is not json type.");
	}
	const jsonData = require(`../${command.c}`);

	fileOrDir = jsonData.input;
	outputDir = (jsonData.output && jsonData.output.replace("./", "")) ?? "dist";
	lang = jsonData.lang;
	css = jsonData.styleSheet;
	//ignore all options
	if (!fileOrDir) {
		console.log("Please provide -c or -i options");
	}
} else {
	fileOrDir = takeFile();
}

fs.readFile(path.join(__dirname, "htmlTemplate.html"), "utf-8", (err, html) => {
	if (err) return console.log(err);

	if (!fs.existsSync(fileOrDir)) {
		return console.log("No File or Directory Found");
	}

	const stats = fs.statSync(fileOrDir);

	const dir = path.join(process.cwd(), outputDir);

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

			addingStyleSheet(parsedHtml, css);
			updatingLang(parsedHtml, lang);

			addingDataToHTMLFile(parsedHtml, data, isMDfile);
			if (
				!fs.existsSync(path.join(process.cwd(), outputDir, `${fileOrDir}.html`))
			) {
				fs.writeFile(
					`${process.cwd()}/${outputDir}/index.html`,
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

		let index = 0;
		files.forEach((file) => {
			const isMDfile = file.endsWith(".md");
			fs.readFile(path.join(fileOrDir, file), "utf-8", (error, data) => {
				if (error) return console.log(error);
				let parsedHtml = parse(html);
				addingStyleSheet(parsedHtml, css);
				updatingLang(parsedHtml, lang);
				addingDataToHTMLFile(parsedHtml, data, isMDfile);
				const pathName = `${process.cwd()}/${outputDir}/${file}.html`;

				if (!fs.existsSync(pathName)) {
					index++;
					fs.writeFile(
						path.join(process.cwd(), outputDir, `index${index}.html`),
						parsedHtml.toString(),
						(e) => {
							if (e) return console.log(e);
							console.log(
								`New file has been created in ${outputDir} directory!!`
							);
						}
					);
				}
			});
		});
	}
});
