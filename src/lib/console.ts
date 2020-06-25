import chalk from 'chalk'
import pkg from '../../package.json'

const programName = Object.keys(pkg)[0]

export const missingProjectName = () => {
  return `
Please specify the project directory:
  ${chalk.cyan(programName)} ${chalk.green('<project-directory>')}
For example:
  ${chalk.cyan(programName)} ${chalk.green('hi-jack')} ${chalk.cyan(
    '--template next-default-app',
  )}
Run ${chalk.cyan(`${programName} --help`)} to see all options.
`
}

export const alreadyExists = (projectName: string) => {
  return `
Uh oh! Looks like there's already a directory called ${chalk.red(
    projectName,
  )}. Please try a different name or delete that folder.`
}
