import { program } from 'commander'
import { createFromTemplate } from 'lib'
import chalk from 'chalk'

program
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .arguments('<project-directory>')
  .option('-t, --template <project>', 'use template project')
  .action((directory: string, options) => {
    createFromTemplate(directory, options.template)
  })

program.parse(process.argv)
