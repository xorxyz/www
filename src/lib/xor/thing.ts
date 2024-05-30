import Vector from "./vector"
import { Attribute } from './attribute'

const directions = [[0, 1], [-1, 0], [0, -1], [1, 0]].map(([x,y]) => new Vector(x, y))

export default class Thing {
  name: string
  icon: string
  pos = new Vector(0, 0)
  dir = new Vector(0, 1)
  win = false
  error = false
  fixed = false
  attributes = new Set<Attribute>
  constructor (name: string, icon: string, attributes: Attribute[]) {
    this.name = name
    this.icon = icon
    attributes.forEach(attr => this.attributes.add(attr))
  }
  render() {
    return this.icon
  }
  rotate_left() {
    const index = directions.findIndex(d => this.dir.equals(d)) - 1
    const nextIndex = index < 0 ? 3 : index
    const nextDir = directions[nextIndex]
    this.dir.copy(nextDir)
  }
  rotate_right() {
    const index = directions.findIndex(d => this.dir.equals(d)) + 1
    const nextIndex = index > 3 ? 0 : index
    const nextDir = directions[nextIndex]
    this.dir.copy(nextDir)
  }
  clone() {
    const copy = new Thing(this.name, this.icon, [...this.attributes])
    copy.pos.copy(this.pos)
    copy.dir.copy(this.dir)
    copy.fixed = this.fixed
    return copy
  }
}

export function createThing(type: string, x = 0, y = 0) {
  let thing
  switch (type) {
    case 'wizard':
      thing = new Thing('wizard', '🧙‍♂️', ['walks'])
      break
    case 'flag':
      thing = new Thing('flag', '🚩', ['win'])
      break
    case 'tree':
      thing = new Thing('tree', '🌲', ['blocks'])
      break
    case 'mountain':
      thing = new Thing('mountain', '⛰️', ['blocks', 'halts'])
      break
    default:
      throw new Error(`Couldn't create thing of type '${type}'`)
  }

  thing.pos.setXY(x, y)
  return thing
}
