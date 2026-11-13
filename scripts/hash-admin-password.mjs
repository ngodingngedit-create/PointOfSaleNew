import { hashAdminPassword } from '../api/_lib/passwords.js'

function readHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal so the password is not echoed.')
  }
  return new Promise((resolve, reject) => {
    let value = ''
    process.stdout.write(prompt)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    const onData = (chunk) => {
      for (const byte of chunk) {
        if (byte === 3) {
          cleanup()
          reject(new Error('Cancelled.'))
          return
        }
        if (byte === 13 || byte === 10) {
          cleanup()
          process.stdout.write('\n')
          resolve(value)
          return
        }
        if (byte === 8 || byte === 127) value = value.slice(0, -1)
        else if (byte >= 32 && byte <= 126 && value.length < 1024) value += String.fromCharCode(byte)
      }
    }
    function cleanup() {
      process.stdin.off('data', onData)
      process.stdin.setRawMode(false)
      process.stdin.pause()
    }
    process.stdin.on('data', onData)
  })
}

try {
  const first = await readHidden('New administrator password (12+ characters): ')
  const second = await readHidden('Repeat administrator password: ')
  if (first !== second) throw new Error('Passwords do not match.')
  const hash = await hashAdminPassword(first)
  process.stdout.write(`POS_ADMIN_PASSWORD_HASH=${hash}\n`)
} catch (error) {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
}
