import chalk from 'chalk'

const program = {
  name: 'jack-template',
}

export const missingProjectName = () => {
  return `
Please specify the project directory:
  ${chalk.cyan(program.name)} ${chalk.green('<project-directory>')}
For example:
  ${chalk.cyan(program.name)} ${chalk.green('hi-jack')} ${chalk.cyan(
    '--template next-default-app',
  )}
Run ${chalk.cyan(`${program.name} --help`)} to see all options.
`
}

export const alreadyExists = (projectName: string) => {
  return `
Uh oh! Looks like there's already a directory called ${chalk.red(
    projectName,
  )}. Please try a different name or delete that folder.`
}
