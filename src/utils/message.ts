import ora from 'ora'
import chalk from 'chalk'
import { eraseLine } from 'ansi-escapes'

export const info = (msg: string) => {
  console.log(`${chalk.gray('>')} ${msg}`)
}

export const wait = (msg: string) => {
  const spinner = ora(chalk.green(msg))
  spinner.color = 'blue'
  spinner.start()

  return () => {
    spinner.stop()
    process.stdout.write(eraseLine)
  }
}

export const cmd = (command: string) => {
  return chalk.bold(chalk.cyan(command))
}

export const success = (msg: string) => {
  console.log(`${chalk.green('> Success!')} ${msg}`)
}

export const error = (msg: Error | string) => {
  if (msg instanceof Error) {
    msg = msg.message
  }

  console.error(`${chalk.red('> Error!')} ${msg}`)
}
