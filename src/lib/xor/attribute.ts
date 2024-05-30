const attributes = [
  'walks',
  'blocks',
  'win',
  'halts'
] as const

export type Attribute = typeof attributes[number]
