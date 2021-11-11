## Installation

```
git clone https://github.com/nguyenhung15913/OSD600-SSG.git
cd OSD600-SSG
npm install
npm link
```

## Usage

```
osdssg -i <file's location>
osdssg --input <directory's location> // Read all files inside and creates html files for each
 // Note: file's name and folder's name that contains whitespaces have to be placed inside double quote ("")
```

## Flags

```
 -h,--help: See help list
 -v,--version: Version of current osdssg
 -i,--input: input a file or a folder
 -s,--stylesheet: Add a stylesheet link into <head>
 -l,--language: Modify the lang="" in HTML tag
```

## Example

Go to the following link to see examples of the tool

- [OSD600 Static Site Generator](https://dev.to/nguyenhung15913/osd600-static-site-generator-release-0-1-5a5d)

## Formatter

OSD600-SSG uses StandardJS to check the formatting of code. StandardJS will also check style issues & programmer small unwanted errors.

To check:
<code>npm run standard-check // files name can also be specified</code>

To automatically fix all formatting errors:
<code>npm run standard-fix // files name can also be specified</code>

## Linter

OSD600-SSG uses ESLint to check code consistency and to avoid bugs.

To check:
<code>npm run eslint-check // files name can also be specified</code>

To automatically fix all formatting errors:
<code>npm run eslint-fix // files name can also be specified</code>

## Extension needed

Please install Prettier and ESLint extensions in order to integrate Source Code Formatter and Linter into the editor. This will help you to check and list our any errors or warnings once you save your file.

## Testing

This tool uses JestJS as a testing tool. When you want to test the tool, please make sure to create a <code>test</code> directory and put all your test files there. Run <code>npm run test</code> with file name in order for Jest do its work.

## Author

**Hung Nguyen**
