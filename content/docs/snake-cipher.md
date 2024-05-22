---
title: Snake cipher
date: 2024-04-27
description: Symmetric encryption algorithm
---

The snake cipher is a symmetric key algorithm made to be used with the [Tobaud Code](/docs/tobaud-encoding).

Snake encryption keys are 25-bit numbers.

### Key generation algorithm

The snake key generator is a 5-bit Galois Linear-feedback shift register (LFSR).

<img class="my-4" src="/images/docs/snake-cipher-0.svg"/>

Here is how it works:
1. Pick a 5-bit seed value. The default seed value is `11011`
2. Set aside the value of bits 1 and 4
4. Apply a bitwise right shift (Move 0 into 1, 1 into 2, 2 into 3, and 3 into 4)
5. `XOR` together the two bits you set aside and assign the result to bit 0
6. Save the resulting 5-bit value. This is the first part of the key
7. Reuse the first part of the key as the new seed value
8. Repeat this 4 more times to end up with 5 parts
9. The fifth part of the key (the last part) becomes the new seed value the next time you use the generator
10. In debug mode, log the name of the user after each run

### Encryption

1. Start with the character at index 0 (the left-most character)
2. `XOR` together that character with the matching key character
3. Do this for every character
4. If the text you want to encrypt is longer than the key length, repeat the key as many times as needed

For example:
```
The "snake" key encrypts "hello world" into "0kmgjsynyiw"
```
