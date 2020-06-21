import makeDir from 'make-dir'
import ora from 'ora'

export const initProject = async (projectName: string) => {
  const path = makeDir.sync(projectName)
  const spinner = ora('Cooking project').start()

  spinner.stopAndPersist({
    symbol: '💻',
    text: ` ${projectName} created at ${path}`,
  })
  return path
}
