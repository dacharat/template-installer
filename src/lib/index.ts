import fs from 'fs'
import prompts, { Choice } from 'prompts'

import { downloadTemplate, hasTemplate, listTemplates } from 'utils/download'
import { install } from 'utils/install'
import { initProject } from 'utils/makeDir'
import * as message from '../utils/message'
import { tryGitInit } from 'utils/git'
import { readPackageJson, writePackageJson } from 'utils/packageIO'
import chalk from 'chalk'
import { terminate } from 'utils/terminate'

export const createFromTemplate = async (
  projectName: string,
  template: string,
  latest: boolean | undefined,
) => {
  // 1. Check missing arguments
  if (fs.existsSync(projectName) && projectName !== '.') {
    terminate(message.alreadyExists(projectName))
  }

  // 2. Display template selection
  if (!template) {
    message.info(`Missing template`)
    try {
      const templates = await listTemplates()
      const answer = await prompts({
        type: 'autocomplete',
        name: 'template',
        message: 'Pick a template',
        choices: templates,
        suggest: (input: any, choices: any) => {
          const regex = new RegExp(input, 'i')
          return choices.filter((choice: Choice) => regex.test(choice.title))
        },
      })
      template = answer.template
    } catch (err) {
      terminate(
        `Failed to fetch the list of templates with the following error: ${err}`,
      )
    }
  }

  // 3. Check template exists
  const isTemplateExists = await hasTemplate(template)
  if (!isTemplateExists) {
    terminate(`Template "${chalk.magenta(template)}" doesn't exist`)
  }

  // 4. Download template to project directory
  const path = await initProject(projectName)
  process.chdir(path)
  await downloadTemplate(path, template)

  // 5. Install the package. If the latest flag is included, it will install the latest dependencies version.
  const packageJson = readPackageJson(path)
  if (latest) {
    message.info('Install latest all latest dependencies version.')
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
