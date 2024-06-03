const attributes = [
  'walks',
  'blocks',
  'win',
  'halts',
  'attracts',
  'attracts:wizard',
  'attracts:sheep',
  'collectible',
  'eats',
  'edible',
  'eating'
] as const

export type Attribute = typeof attributes[number]
