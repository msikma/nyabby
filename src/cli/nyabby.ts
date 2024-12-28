#!/usr/bin/env node
// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import fs from 'fs/promises'
import path from 'path'
import {QuietArgumentParser, fromCliArgs} from './argparse.ts'
import type {ParsedArguments} from './argparse.ts'
import {Nyabby} from '../lib/index.ts'

const pkgPath = path.join(import.meta.dirname, '..', '..', 'package.json')
const pkgData = JSON.parse(await fs.readFile(pkgPath, 'utf8'))
const parser = new QuietArgumentParser({
  add_help: false,
  exit_on_error: true,
  description: `${pkgData.description}.`
})

parser.add_argument('search', {help: 'search query', metavar: 'SEARCH'})
parser.add_argument('--filter', {dest: 'filter', help: 'filter to apply', metavar: 'FILTER'})
parser.add_argument('--category', {dest: 'category', help: 'category to apply', metavar: 'CATEGORY'})
parser.add_argument('--min-seeders', {dest: 'minSeeders', help: 'minimum number of seeders', metavar: 'N'})
parser.add_argument('--max-date', {dest: 'maxDate', help: 'maximum date', metavar: 'DATE'})
parser.add_argument('--min-date', {dest: 'minDate', help: 'minimum date', metavar: 'DATE'})
parser.add_argument('--max-age', {dest: 'maxAge', help: 'maximum age in milliseconds', metavar: 'MS'})
parser.add_argument('--min-age', {dest: 'minAge', help: 'minimum age in milliseconds', metavar: 'MS'})
parser.add_argument('--base-url', {dest: 'baseUrl', help: 'Nyaa base url (https://nyaa.si)', metavar: 'URL'})
parser.add_argument('-h', '--help', {action: 'store_true', dest: 'help', help: 'show this help message and exit'})
parser.add_argument('-v', '--version', {action: 'version', version: `${pkgData.version}`})

// Parse command line arguments; if something is wrong, the program exits here.
const args = {
  ...parser.parse_args() as ParsedArguments,
  pathPackage: path.resolve(path.dirname(pkgPath)),
  packageData: pkgData
}

if (args.help) {
  console.log(parser.format_help().trim())
}
else if (args.search == null) {
  parser.error('a search query is required')
}
else {
  const nyabby = new Nyabby(args.baseUrl)
  const res = await nyabby.runSearch(fromCliArgs(args))
  console.log(JSON.stringify(res, null, 2))
}
