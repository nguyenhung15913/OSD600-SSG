/* global require test expect describe */
const { textToPMd, cliValid, textToP } = require("./markdown");

describe("P tag parser test", () => {
	test("Test with null or empty file input", () => {
		const nullInput = textToP(null);
		const emptyStringInput = textToP("");

		expect(nullInput).toBeUndefined();
		expect(emptyStringInput).toBeUndefined();
	});

	test("Test one line input", () => {
		const input = textToP("This is text input");
		expect(input).toMatch(/<p>This is text input/);
	});

	test("Test with multiple lines input", () => {
		const multiLineInput = textToP(`Open Source
              OSDSSD
              It is all about contribution to open source community
          
              There is one empty line above
              `);
		expect(multiLineInput).not.toBeNull();
	});
});

describe("test user's valid CLI", () => {
	test("No commands were passed", () => {
		const nullInput = cliValid(null);

		expect(nullInput).toBeFalsy();
	});

	test("If user did not pass --input or --config flags", () => {
		const styleSheetAdd = {
			stylesheet: true
		};

		const command = cliValid(styleSheetAdd);

		expect(command).toBeFalsy();
	});

	test("If user passed --input or --config flags", () => {
		const inputCLI = {
			i: true,
			input: true,
			config: true,
			c: true
		};
		console.log(inputCLI);

		const commandInput = cliValid(inputCLI);

		expect(commandInput).toBeTruthy();
	});
});

describe("Markdown parser to HTML tests", () => {
	test("markdown Test with null or empty file input", () => {
		const nullInput = textToPMd(null);
		const emptyStringInput = textToPMd("");

		expect(nullInput).toBeUndefined();
		expect(emptyStringInput).toBeUndefined();
	});

	test("markdown Test one line input", () => {
		const h1Input = textToPMd("# This is heading 1");
		const input = textToPMd("This is text input");
		expect(h1Input).toMatch(/<h1>This is heading 1/);
		expect(input).toMatch(/<p>This is text input/);
	});

	test("markdown Test with multiple lines input", () => {
		const multiLineInput = textToPMd(`# Open Source
			## OSDSSD
			It is all about contribution to open source community
		
			* There is one empty line above
			`);
		expect(multiLineInput).not.toBeNull();
	});
});
