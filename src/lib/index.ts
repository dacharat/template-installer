import { missingProjectName, alreadyExists } from './console'
import fs from 'fs'
import { downloadTemplate, hasTemplate } from 'utils/downloadTemplate'
import { install } from 'utils/install'
import { initProject } from 'utils/makeDir'
import * as message from '../utils/message'
import { tryGitInit } from 'utils/git'
import { readPackageJson, writePackageJson } from 'utils/packageIO'

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
  if (!template) {
    message.error(`invalid template of ${template}`)
  }

  // 2. Check template exists
  const templateExists = await hasTemplate(template)
  if (!templateExists) {
    message.error(`${template} template doesn't exist`)
  }

  // 3. Download template to project directory
  const path = await initProject(projectName)
  process.chdir(path)
  await downloadTemplate(path, template)

  // 4. Install the package. If the latest flag is included, it will install the latest dependencies version.
  const packageJson = readPackageJson(path)
  if (latest) {
    message.info('install latest version is WIP.')
    // const dependencies = Object.keys(packageJson.dependencies)
    // const devDependencies = Object.keys(packageJson.devDependencies || {})
    // console.log(packageJson, dependencies, devDependencies)
  } else {
    await install(path, projectName)
  }
  packageJson.name = projectName
  // console.log(packageJson)
  writePackageJson(path, packageJson)

  // 4. Initialize git
  if (tryGitInit()) {
    message.success('Initialized a git repository.')
  }

  // 5. Complete message
  message.success(`Created ${projectName} at ${path}`)
  message.info(`  cd ${message.cmd(projectName)}`)
  message.info(`Enjoy hacking!!`)
}
