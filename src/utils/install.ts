import execa from 'execa'
import * as message from './message'
import { spawn } from 'child_process'

const cmdInstallType = () => {
  try {
    execa.command('yarnpkg --version')
    return true
  } catch (e) {
    return false
  }
}

export const install = (
  root: string,
  dependencies: string[] | null,
  projectName: string,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const useYarn = cmdInstallType()
    let command: string
    let args: string[]

    if (useYarn) {
      command = 'yarnpkg'
      args = dependencies ? ['add', '--exact'] : ['install']
      if (dependencies) {
        args.push(...dependencies)
      }
      args.push('--cwd', root)
    } else {
      command = 'npm'
      args = ([
        'install',
        dependencies && '--save',
        dependencies && '--save-exact',
        '--loglevel',
        'error',
      ].filter(Boolean) as string[]).concat(dependencies || [])
    }

    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    })
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` })
        return
      }
      message.success(`Installed dependencies for ${projectName}`)
      resolve()
    })
  })
}
