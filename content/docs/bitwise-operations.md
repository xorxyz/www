---
title: Bitwise operations
date: 2024-05-22
description: 
---

Bitwise operations let you operate on individual bits.


## Negation (NOT)

NOT is true if the input is false, and false if the input is true.

|A |= |
|--|--|
|0 |? |
|1 |? |


## Equalility (EQ/XNOR)

XNOR is true if and only both of the inputs have the same truth value.

|A |B |= |
|--|--|--|
|0 |0 |? |
|0 |1 |? |
|1 |0 |? |
|1 |1 |? |


## Conjunction (AND)

AND is true if and only both of the inputs are true.

|A |B |= |
|--|--|--|
|0 |0 |? |
|0 |1 |? |
|1 |0 |? |
|1 |1 |? |


## Disjunction (OR)

OR is true when either one or both of the inputs are true.

|A |B |= |
|--|--|--|
|0 |0 |? |
|0 |1 |? |
|1 |0 |? |
|1 |1 |? |


## Non-equivalence (XOR)

XOR is true if and only if the inputs differ.

<div x-data="truth_table('xor')">

|A |B |= |
|--|--|--|
|0 |0 |? |
|0 |1 |? |
|1 |0 |? |
|1 |1 |? |

</div>
