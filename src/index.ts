import { program } from 'commander'
import { createFromTemplate } from 'lib'
import chalk from 'chalk'
import { sayWelcome } from 'utils/welcome'
import pkg from '../package.json'

program
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .arguments('<project-directory>')
  .version(pkg.version)
  .option('-t, --template <project>', 'use template project')
  .option(
    '-l, --latest',
    `use latest dependencies  ${chalk.yellow(
      'Warning: some latest dependencies maybe cause an error from breaking change!!',
    )}`,
  )
  .action((directory: string, options) => {
    sayWelcome()
    createFromTemplate(directory, options.template, options.latest)
  })

program.parse(process.argv)
