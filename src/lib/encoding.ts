const LOWERCASE_A_CODE_POINT_OFFSET = 96
const NUMBER_0_CODE_POINT_OFFSET = 21

// Encode a list of numbers (0-31) into a Tobaud string
export function encode(numbers: number[]): string {
  var result = numbers.map(n => {
    if (n === 0) return " "
    if (n >= 0 && n <= 26) {
      return String.fromCodePoint(n + LOWERCASE_A_CODE_POINT_OFFSET)
    }
    if (n >= 27 && n <= 31) return String.fromCodePoint(n + NUMBER_0_CODE_POINT_OFFSET)
    throw new Error(`encode: Number '${n}' is out of bounds.`)
  }).join('')

  return result
}

// Decode a Tobaud encoded string
export function decode(str: string): number[] {
  var result = str.split('').map((char: string) => {
    if (char == " ") return 0
    if (/[a-z]/.test(char)) return char.codePointAt(0) as number - LOWERCASE_A_CODE_POINT_OFFSET
    if (/[0-4]/.test(char)) return char.codePointAt(0) as number - NUMBER_0_CODE_POINT_OFFSET
    throw new Error(`decode(): Character '${char}' is not allowed.`)
  })

  return result
}
