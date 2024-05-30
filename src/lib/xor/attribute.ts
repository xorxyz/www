const attributes = [
  'walks',
  'blocks',
  'win',
  'stops'
] as const

export type Attribute = typeof attributes[number]
