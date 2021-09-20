const yargs = require('yargs')
const fs = require('fs')

const parse = require('node-html-parser').parse

const textToP = (input) => {
	return input
		.split(/\r?\n/)
		.map((elem) => `<p>${elem}</p>`)
		.join('\n')
}

const getTitle = (input) => {
	return input.split(/\r?\n/).slice(0, 1)
}

const takeFile = () => {
	if (!yargs.argv._[0].includes('.txt')) {
		return false
	}
	return yargs.argv._[0]
}

let cli = require('yargs')

cli = cli
	.usage('All available options for OSDSSG: ')
	.version(
		true,
		'Display current version of osdssg',
		'Current version of osdssg is 1.0.0'
	)
	.option('help', {
		alias: 'h',
		desc: 'Displaying all options available'
	})
	.option('input', {
		type: 'boolean',
		alias: 'i',
		desc: "Input file's name or directory's name e.g: osdssg --input text.txt or osdssg -i ./dir1"
	})
	.option('version', {
		alias: 'v',
		desc: 'Show current version of osdssg'
	})
	.option('stylesheet', {
		alias: 's',
		desc: 'Optionally specify a URL to a CSS stylesheet in the <head> of the HTML file'
	}).argv

const command = yargs.argv

if (command.i || command.input) {
	if (command._.length <= 0) {
		return console.log('Please enter file name or folder e.g: --input text.txt')
	}

	fs.readFile(`${__dirname}/htmlTemplate.html`, 'utf-8', (err, html) => {
		if (err) throw err

		const fileOrDir = takeFile()
		if (!fileOrDir) {
			return console.log('Only .txt files can be supported in this tool!')
		}

		if (!fs.existsSync(fileOrDir)) {
			return console.log('No File or Directory Found')
		}
		const stats = fs.statSync(fileOrDir)

		const dir = `${__dirname}/dist`

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		} else {
			fs.rmdirSync(dir, { recursive: true })
			fs.mkdirSync(dir)
		}

		if (stats.isFile()) {
			fs.readFile(`${fileOrDir}`, 'utf-8', (error, data) => {
				if (error) throw error

				let parsedHtml = parse(html)

				if (command.s) {
					let head = parsedHtml.querySelector('head')
					head.appendChild(
						parse(`<link href="${command.s}" rel="stylesheet" />`)
					)
				}
				parsedHtml.querySelector('title').set_content(getTitle(data))

				let body = parsedHtml.querySelector('body')
				body.appendChild(parse(textToP(data)))
				body.querySelector('p').replaceWith(parse(`<h1>${getTitle(data)}</h1>`))

				const path = `${process.cwd()}/dist/${fileOrDir}.html`

				if (!fs.existsSync(path)) {
					fs.writeFile(
						`${process.cwd()}/dist/index.html`,
						parsedHtml.toString(),
						(e) => {
							if (e) throw e
							console.log('New file has been created!!')
						}
					)
				}
			})
		} else {
			const files = fs.readdirSync(fileOrDir)
			if (files.length <= 0) {
				return console.log('There is no file in the directory')
			}
			let count = 0
			files.forEach((file) => {
				fs.readFile(`${fileOrDir}/${file}`, 'utf-8', (error, data) => {
					if (error) throw error
					let parsedHtml = parse(html)

					if (command.s) {
						let head = parsedHtml.querySelector('head')
						head.appendChild(
							parse(`<link href="${command.s}" rel="stylesheet" />`)
						)
					}

					parsedHtml.querySelector('title').set_content(getTitle(data))
					let body = parsedHtml.querySelector('body')
					body.appendChild(parse(textToP(data)))
					body
						.querySelector('p')
						.replaceWith(parse(`<h1>${getTitle(data)}</h1>`))
					const path = `${process.cwd()}/dist/${file}.html`

					if (!fs.existsSync(path)) {
						count++
						fs.writeFile(
							`${process.cwd()}/dist/index${count}.html`,
							parsedHtml.toString(),
							(e) => {
								if (e) throw e
								console.log('New file has been created in dist directory!!')
							}
						)
					}
				})
			})
		}
	})
}
