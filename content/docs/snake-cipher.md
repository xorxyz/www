---
title: Snake cipher
date: 2024-04-27
description: Symmetric encryption algorithm
---

The snake cipher is a symmetric key algorithm made to be used with the [Tobaud Code](/xor/library/tobaud-code).
Snake encryption keys are 25-bit natural numbers.

### Encryption

1. Start with the left-most character, indexed 0
2. `XOR` the character with the key's character at that index
3. Do this for every character
4. Indices overflow

Example:
```
The "snake" key encrypts "hello world" into "0kmgjsynyiw"
```

### Key generation

The snake key generator is a 5-bit Galois Linear-feedback shift register (LFSR).

``` 
0  1  2  3  4
☐→☐ →☐→☐ →☐ 
↑  ↓        │
└──⊕───────┘
```

Here is how it works:
1. Pick a 5-bit seed value
2. Set each bit according to the seed value you picked
3. Set aside the value of bits 1 and 4
4. Apply a bitwise right shift to every untapped bit (Move 0 into 1, 1 into 2, 2 into 3, and 3 into 4)
5. `XOR` bits 1 and 4 and set the result as the value for bit 0
6. Save the result as the first part of the key 
7. Reuse the first part as the next seed
8. Repeat this 4 times more times
9. Use the last past as the seed for the next run
10. Log the name of the user after each run for audit purposes

The default seed value is `11011`.
