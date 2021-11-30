/* global require module */
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const { parse } = require("node-html-parser");

const textToP = (input) => {
	if (input === null || input.length <= 0) {
		return console.log("There is no input");
	}

	return input
		.split(/\r?\n/)
		.map((elem) => `<p>${elem}</p>`)
		.join("\n");
};

const syntaxHighlight = (body, head) => {
	if (body.querySelector("pre") != null) {
		head.appendChild(
			parse('<link href="/styles/highlight.css" rel="stylesheet" />')
		);

		body.querySelectorAll("pre").forEach((child) => {
			child.classList.add("highlight");
		});
	}
};

const cliValid = (command) => {
	console.log(command);

	if (command === null) {
		console.log("Please enter the flags");
		return false;
	}
	if ((!command.c || command.config) && (!command.i || !command.input)) {
		console.log(
			"Please enter flags as well as file name or folder e.g: --input text.txt or --config ssg-config.json"
		);
		return false;
	}
	return true;
};

const textToPMd = (input) => {
	if (input === null || input.length <= 0) {
		return console.log("There is no input");
	}
	return md.render(input);
};

module.exports = {
	textToPMd,
	syntaxHighlight,
	cliValid,
	textToP
};
