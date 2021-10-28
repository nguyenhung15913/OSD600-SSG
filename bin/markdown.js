var MarkdownIt = require("markdown-it"),
	md = new MarkdownIt();
let { parse } = require("node-html-parser");

const syntaxHighlight = (body, head) => {
	if (body.querySelector("pre") !== null) {
		head.appendChild(
			parse(`<link href="/styles/highlight.css" rel="stylesheet" />`)
		);

		body.querySelectorAll("pre").forEach((child) => {
			child.classList.add("highlight");
		});
	}
};

const textToPMd = (input) => {
	return md.render(input);
};

module.exports = {
	textToPMd,
	syntaxHighlight
};
