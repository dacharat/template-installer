import got from 'got'
import tar from 'tar'
import { Stream } from 'stream'
import { promisify } from 'util'
import * as message from './message'

const REPOSITORY = 'https://codeload.github.com/dacharat/template/tar.gz/master'
const pipeline = promisify(Stream.pipeline)

const isUrlOk = async (url: string): Promise<boolean> => {
  const res = await got(url).catch(e => e)
  return res.statusCode === 200
}

export const hasTemplate = (name: string): Promise<boolean> => {
  return isUrlOk(
    `https://api.github.com/repos/dacharat/template/contents/${encodeURIComponent(
      name,
    )}/package.json`,
  )
}

export const downloadTemplate = async (
  root: string,
  template: string,
): Promise<void> => {
  const stopExampleSpinner = message.wait(
    `Downloading files for ${message.cmd(template)} example`,
  )
  try {
    const complete = await pipeline(
      got.stream(REPOSITORY),
      tar.extract({ cwd: root, strip: 2 }, [`template-master/${template}`]),
    )
    stopExampleSpinner()
    message.success(
      `Downloaded ${message.cmd(template)} files for ${message.cmd(root)}`,
    )
    return complete
  } catch (err) {
    stopExampleSpinner()
    message.error(
      `Error downloading ${message.cmd(template)} files for ${message.cmd(
        root,
      )}`,
    )
    throw err
  }
}
