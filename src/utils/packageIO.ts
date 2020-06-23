import fs from 'fs'
import path from 'path'
import os from 'os'

export const readPackageJson = (root: string) => {
  const file = fs.readFileSync(path.join(root, 'package.json'))
  return JSON.parse(file.toString())
}

export const writePackageJson = (root: string, packageJson: object) => {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  )
}
