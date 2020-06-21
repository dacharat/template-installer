import chalk from 'chalk'
import figlet from 'figlet'

export const sayWelcome = () => {
  console.log(chalk.redBright(figlet.textSync('JACK template')))
}
