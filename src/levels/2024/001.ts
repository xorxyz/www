import { decode, encode } from '../../lib/encoding.js'
import { encrypt, decrypt, validateKey } from '../../lib/encryption.js'

const ciphertext = decode("vsymgkf eb a2dajugmvl2ivgwgddr  ienq0zwkhszdadgzeq")
const testPlainText  = decode("quidquid latine dictum sit altum videtur")
const testCipherText = "tg  sp0mdndf jgev gvp4iwkqrhhvp4irkaw2qp"

const data = {
  verify,
  win,
  fail,
  input: '',
  output: '',
  failed: false,
  won: false
}

export default () => data

function verify(this: typeof data) {
  const key = parseInput(this.input)
  const isValidInput = validateKey(key)

  if (!isValidInput) return this.fail(`That's not a valid key.`)

  const isWin = verifyAnswer(key)

  if (isWin) {
    const value = encode(decrypt(ciphertext, key))
    this.win(`You got it! Albert's secret phrase is "${value}"`)
  } else {
    const value = encode(decrypt(ciphertext, key))
    this.fail(`No, that's not the right key. With that key, the secret phrase would be "${value}".`)
  }
}

function parseInput(value: string): number[] {
  const values = value.match(/.{1,5}/g)
  if (!values) return []
  return values.map(str => parseInt(str, 2))
}

function verifyAnswer(key: Array<number>) {
  const encrypted = encrypt(testPlainText, key)

  return encode(encrypted) === testCipherText
}

function win(text: string) {
  this.won = true
  this.failed = false
  this.output = text
}

function fail(text: string) {
  this.won = false
  this.failed = true
  this.output = text
}
