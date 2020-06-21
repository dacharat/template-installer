import { execSync } from 'child_process'
import * as message from './message'

export const tryGitInit = (): boolean => {
  let didInit = false
  try {
    execSync('git --version', { stdio: 'ignore' })
    if (isInGitRepository() || isInMercurialRepository()) {
      return false
    }

    execSync('git init', { stdio: 'ignore' })
    didInit = true

    execSync('git add -A', { stdio: 'ignore' })
    execSync('git commit -m "Initial commit from Jack Template"', {
      stdio: 'ignore',
    })
    return true
  } catch (e) {
    return false
  }
}

const isInGitRepository = (): boolean => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    message.error(`Cannot initial git: this project is in another repository`)
    return true
  } catch (_) {
    return false
  }
}

const isInMercurialRepository = (): boolean => {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' })
    message.error(`Cannot initial git: this project is in mercurial repository`)
    return true
  } catch (_) {
    return false
  }
}
