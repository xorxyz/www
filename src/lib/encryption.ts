const KEY_LENGTH = 25

type ZeroToThirtyOne = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
                      11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
                      21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
type FixedArray<N extends number, T> = { 0: T, length: N } & T[];
type ValidKey = FixedArray<25, ZeroToThirtyOne>

export function validateKey(key: number[]): key is ValidKey {
  return key.length === KEY_LENGTH
}

export function encrypt(plaintext: number[], key: number[]) {
  return plaintext.map((n, index) => {
    return n ^ key[index % 5]
  })
}

export const decrypt = encrypt
