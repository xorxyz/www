const attributes = [
  'walks',
  'blocks',
  'win',
  'halts',
  'attracts',
  'collectible'
] as const

export type Attribute = typeof attributes[number]
