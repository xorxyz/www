import { decode, encode } from '../../lib/encoding.js'
import { encrypt, decrypt, validateKey } from '../../lib/encryption.js'
import { registerLevel } from '../../register.js'

const ciphertext = decode("vsymgkf eb a2dajugmvl2ivgwgddr  ienq0zwkhszdadgzeq")
const testPlainText  = decode("quidquid latine dictum sit altum videtur")
const testCipherText = "tg  sp0mdndf jgev gvp4iwkqrhhvp4irkaw2qp"

function formatBinary (str: string, length: number) {
  return str.padStart(length, '0').match(/(.{1,5})/g)?.join(' ')
}

const data = {
  win,
  fail,
  task1: {
    chars: '0n3',
    input: '',
    failed: false,
    won: false,
    output: "",
    verify() {
      const decoded = decode(this.task1.chars).map(n => n.toString(2).padStart(5, '0')).join('')

      this.task1.won = this.task1.input.length === 15 && decoded === this.task1.input
      this.task1.failed = !this.task1.won
      this.task1.output = this.task1.won
        ? `That's right! The string "${this.task1.chars}" is "${formatBinary(this.task1.input, 15)}" in binary.`
        : `Oops! The string "${this.task1.chars}" is not "${formatBinary(this.task1.input, 15)}" in binary.`
    }
  },
  task2: {
    byte: '10101',
    input: '',
    failed: false,
    won: false,
    output: "",
    verify() {
      const { byte, input } = this.task2
      const shifted = (parseInt(byte, 2) >> 2).toString(2).padStart(5, '0')

      this.task2.won = input.length === 5 && shifted === input
      this.task2.failed = !this.task2.won
      this.task2.output = this.task2.won
        ? `That's right! The byte "${byte}" bit shifted right twice is "${formatBinary(input, 5)}".`
        : `Oops! The byte "${byte}" bit shifted right twice is not "${formatBinary(input, 5)}".`
    }
  },
  task3: {
    a: '00101',
    b: '01011',
    failed: false,
    won: false,
    input: '',
    verify() {
      const { a, b, input } = this.task3
      const na = parseInt(a, 2)
      const nb = parseInt(b, 2)
      const xored = (na ^ nb).toString(2).padStart(5, '0')

      this.task3.won = input.length === 5 && xored === input
      this.task3.failed = !this.task3.won
      this.task3.output = this.task3.won
        ? `That's right! XORing the bytes "${a}" and "${b}" together results in "${formatBinary(input, 5)}".`
        : `Oops! XORing the bytes "${a}" and "${b}" together does not result in "${formatBinary(input, 5)}".`
    }
  },
  task4: {
    encrypted: 'cat',
    key: 'dog',
    failed: false,
    won: false,
    input: '',
    verify() {
      const { encrypted, key, input } = this.task4
      const a = decode(encrypted)
      const b = decode(key)

      const won =  input === encode(a.map((n, i) => n ^ b[i]))

      this.task4.won = won
      this.task4.failed = !won
      this.task4.output = won
        ? `That's right! Decrypting ciphertext "${encrypted}" using the key "${key}" results in "${input}".`
        : `Oops! Decrypting ciphertext "${encrypted}" using the key "${key}" does not result in "${input}".`
    }
  },
  task5: {
    seed: '01001',
    input: '',
    failed: false,
    won: false,
    verify() {
      const { input, seed } = this.task5
      const key = parseBinaryKeyString(input)

      const expected = [ 5, 14, 3, 21, 26, 16 ]
      const encrypted = encrypt(decode('albert'), key)

      const won = encrypted.every((n, i) => expected[i] === n) 

      if (won) {
        win(this.task5, `That's right! The key generator produces key "${formatBinary(input, 25)}" using the "${seed}" seed.`)
      } else {
        fail(this.task5, `Oops! The key generator doesn't produce key "${formatBinary(input, 25)}" using the "${seed}" seed.`)
      }
    }
  },
  task6: {
    input: '',
    failed: false,
    won: false,
    verify(this: typeof data) {
      const { input } = this.task6
      const key = parseBinaryKeyString(input)
      const isValidInput = validateKey(key)
    
      if (!isValidInput) return this.fail(`That's not a valid key.`)

      const encrypted = encrypt(testPlainText, key)
    
      if (encode(encrypted) === testCipherText) {
        const value = encode(decrypt(ciphertext, key))
        this.win(this.task6, `You got it! Albert's secret phrase is "${value}"`)
      } else {
        const value = encode(decrypt(ciphertext, key))
        this.fail(this.task6, `No, that's not the right key. With that key, the secret phrase would be "${value}".`)
      }
    }
  },
}

registerLevel('2024/1', () => data)

// takes a 25-bit binary string and returns an array of 5 numbers
function parseBinaryKeyString(value: string): number[] {
  const values = value.match(/.{1,5}/g)
  if (!values) return []
  return values.map(str => parseInt(str, 2))
}

function win(obj: Record<string, any>, text: string) {
  obj.won = true
  obj.failed = false
  obj.output = text
}

function fail(obj: Record<string, any>, text: string) {
  obj.won = false
  obj.failed = true
  obj.output = text
}
