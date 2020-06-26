import * as message from '../utils/message'

export const terminate = (text: string) => {
  message.error(text)
  process.exit(1)
}
