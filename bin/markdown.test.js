/* global require test expect describe */
const { textToPMd, cliValid, syntaxHighlight } = require("./markdown");
const { parse } = require("node-html-parser");

describe("test user's valid CLI", () => {
  test("No commands were passed", () => {
    let nullInput = cliValid(null);

    expect(nullInput).toBeFalsy();
  });

  test("If user did not pass --input or --config flags", () => {
    let styleSheetAdd = {
      stylesheet: true,
    };

    let command = cliValid(styleSheetAdd);

    expect(command).toBeFalsy();
  });

  test("If user passed --input or --config flags", () => {
    let inputCLI = {
      i: true,
      input: true,
      config: true,
      c: true,
    };
    console.log(inputCLI);

    let commandInput = cliValid(inputCLI);

    expect(commandInput).toBeTruthy();
  });
});

describe("Markdown parser to HTML tests", () => {
  test("markdown Test with null or empty file input", () => {
    let nullInput = textToPMd(null);
    let emptyStringInput = textToPMd("");

    expect(nullInput).toBeUndefined();
    expect(emptyStringInput).toBeUndefined();
  });

  test("markdown Test one line input", () => {
    let h1Input = textToPMd("# This is heading 1");
    let input = textToPMd("This is text input");
    expect(h1Input).toMatch(/<h1>This is heading 1/);
    expect(input).toMatch(/<p>This is text input/);
  });

  test("markdown Test with multiple lines input", () => {
    let multiLineInput = textToPMd(`# Open Source
			## OSDSSD
			It is all about contribution to open source community
		
			* There is one empty line above
			`);
    expect(multiLineInput).not.toBeNull();
  });
});
