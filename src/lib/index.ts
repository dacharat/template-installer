import { missingProjectName, alreadyExists } from './console'
import fs from 'fs'
import {
  downloadTemplate,
  hasTemplate,
  listTemplates,
} from 'utils/downloadTemplate'
import { install } from 'utils/install'
import { initProject } from 'utils/makeDir'
import * as message from '../utils/message'
import { tryGitInit } from 'utils/git'
import { readPackageJson, writePackageJson } from 'utils/packageIO'
import prompts, { Choice } from 'prompts'

export const createFromTemplate = async (
  projectName: string,
  template: string,
  latest: boolean | undefined,
) => {
  // 1. Check missing arguments
  if (!projectName) {
    console.log(missingProjectName())
    process.exit(1)
  }
  if (fs.existsSync(projectName) && projectName !== '.') {
    console.log(alreadyExists(projectName))
    process.exit(1)
  }

  // 2. Display template selection
  if (!template) {
    message.info(`invalid template`)
    try {
      const templates = await listTemplates()
      const nameRes = await prompts({
        type: 'autocomplete',
        name: 'template',
        message: 'Pick an example',
        choices: templates,
        suggest: (input: any, choices: any) => {
          const regex = new RegExp(input, 'i')
          return choices.filter((choice: Choice) => regex.test(choice.title))
        },
      })
      template = nameRes.template
    } catch (e) {
      message.error(
        `Failed to fetch the list of examples with the following error: ${e}`,
      )
    }
  }

  // 3. Check template exists
  const templateExists = await hasTemplate(template)
  if (!templateExists) {
    message.error(`${template} template doesn't exist`)
    return
  }

  // 4. Download template to project directory
  const path = await initProject(projectName)
  process.chdir(path)
  await downloadTemplate(path, template)

  // 5. Install the package. If the latest flag is included, it will install the latest dependencies version.
  const packageJson = readPackageJson(path)
  if (latest) {
    message.info('install latest version is WIP.')
    const dependencies = Object.keys(packageJson.dependencies)
    const devDependencies = Object.keys(packageJson.devDependencies || {})
    const newPackageJson = {
      ...packageJson,
      name: projectName,
      devDependencies: {},
      dependencies: {},
    }
    writePackageJson(path, newPackageJson)
    await install(path, projectName, dependencies)
    await install(path, projectName, devDependencies, true)
  } else {
    packageJson.name = projectName
    writePackageJson(path, packageJson)
    await install(path, projectName)
  }

  // 6. Initialize git
  if (tryGitInit()) {
    message.success('Initialized a git repository.')
  }

  // 7. Complete message
  message.success(`Created ${projectName} at ${path}`)
  message.info(`  cd ${message.cmd(projectName)}`)
  message.info(`Enjoy hacking!!`)
}
