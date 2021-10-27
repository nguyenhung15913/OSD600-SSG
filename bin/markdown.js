var MarkdownIt = require("markdown-it"),
	md = new MarkdownIt();

const syntaxHighlight = (input) => {};

const textToPMd = (input) => {
	return md.render(input);
};

module.exports = {
	textToPMd
};
