import { missingProjectName, alreadyExists } from './console'
import fs from 'fs'
import { downloadTemplate, hasTemplate } from 'utils/downloadTemplate'
import { install } from 'utils/install'
import { initProject } from 'utils/makeDir'
import * as message from '../utils/message'

export const createFromTemplate = async (
  projectName: string,
  template: string,
) => {
  if (!projectName) {
    console.log(missingProjectName())
    process.exit(1)
  }
  if (fs.existsSync(projectName) && projectName !== '.') {
    console.log(alreadyExists(projectName))
    process.exit(1)
  }
  if (template) {
    const templateExists = await hasTemplate(template)
    if (templateExists) {
      const path = await initProject(projectName)
      process.chdir(path)

      await downloadTemplate(path, template)
      await install(path, null, projectName)
    } else {
      message.error(`${template} template doesn't exist`)
    }
  }
}
