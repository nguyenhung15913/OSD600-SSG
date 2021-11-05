/* global require module */
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
const { parse } = require('node-html-parser')

const syntaxHighlight = (body, head) => {
  if (body.querySelector('pre') != null) {
    head.appendChild(
      parse('<link href="/styles/highlight.css" rel="stylesheet" />')
    )

    body.querySelectorAll('pre').forEach((child) => {
      child.classList.add('highlight')
    })
  }
}

const cliValid = (command) => {
  if (!command.c && command.config && !command.i && !command.input) {
    return console.log(
      'Please enter file name or folder e.g: --input text.txt or --config ssg-config.json'
    )
  }
}

const textToPMd = (input) => {
  return md.render(input)
}

module.exports = {
  textToPMd,
  syntaxHighlight,
  cliValid
}
