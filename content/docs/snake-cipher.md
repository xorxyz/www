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
6. Save the result as the first part of the key
7. Reuse the first part as the next seed
8. Repeat this 4 more times
9. Use the last part of the key as the seed for the next run
10. Log the name of the user after each run for audit purposes

### Encryption

1. Start with the character at index 0 (the left-most character)
2. `XOR` together that character with the matching key character
3. Do this for every character
4. If the text you want to encrypt is longer than the key length, repeat the key as many times as needed

For example:
```
The "snake" key encrypts "hello world" into "0kmgjsynyiw"
```
