Hello This is Markdown file

How are you?

# This text is Markdown text

#This is not Markdown text since it has a whitespace before "This"

## This text is h2

### This text is h3

Another text.

---

# This is another Markdown Text

---Another hr tag above---
---
```
	<h1>Highlighting syntax</h1>
```

End of file has been reach.

```
var MarkdownIt = require("markdown-it"),
md = new MarkdownIt();

const syntaxHighlight = (input) => {};

const textToPMd = (input) => {
	return md.render(input);
};

module.exports = {
	textToPMd
};
```
