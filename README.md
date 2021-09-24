<h1 align="center">OSD600 Static Site Generator</h1>

<p align="center">Create a command line tool to convert user's text input file(s) into hmtl file(s).</p>
<p align="center">Note: A new dist folder will be created to contain all files generated</p>

## Features
- Generating an HTML file from user's file input.
- Generating HTML file(s) from user's folder input (Each file inside the directory will generate 1 HTML file).
- File(s) generated will be stored inside new created "dist" directory.
- If the input file is an .md file, the application will transfer bold, itatlics,h1->h4 text to html elements
- "dist" folder will renew every time a new command-line executed (Old file(s) will be deleted and new file(s) will be added).
- Creating a title inside head tag and transforming the first line of the text to h1 tag.
- Creating stylesheet link tag if users use --stylesheet or -s flag.

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
```

## Built With

- JavaScript
- Node
- NPM
- HTML

## Example
Go to the following link to see examples of the tool
- [OSD600 Static Site Generator](https://dev.to/nguyenhung15913/osd600-static-site-generator-release-0-1-5a5d)

## Author

**Hung Nguyen**

- [Profile](https://github.com/nguyenhung15913")
- [Email](mailto:hnguyen97@myseneca.ca")

