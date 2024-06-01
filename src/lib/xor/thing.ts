import Vector from "./vector"
import { Attribute } from './attribute'
import Axis from "./axis"

export default class Thing {
  win = false
  error = false
  fixed = false
  readonly name: string
  readonly icon: string
  readonly pos = new Vector(0, 0)
  readonly dir = new Vector(0, 1)
  readonly attributes = new Set<Attribute>
  constructor (name: string, icon: string, attributes: Attribute[]) {
    this.name = name
    this.icon = icon
    attributes.forEach(attr => this.attributes.add(attr))
  }
  render(): string {
    return this.icon
  }
  rotate_left() {
    const axis = new Axis(this.dir)
    this.dir.copy(axis.rotate_left().value)
  }
  rotate_right() {
    const axis = new Axis(this.dir)
    this.dir.copy(axis.rotate_right().value)
  }
  clone(): Thing {
    const copy = new Thing(this.name, this.icon, [...this.attributes])
    copy.pos.copy(this.pos)
    copy.dir.copy(this.dir)
    copy.fixed = this.fixed
    return copy
  }
  facing (): Vector {
    return this.pos.clone().add(this.dir)
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
    case 'book':
      thing = new Thing('book', '📕', ['attracts', 'collectible'])
      break
    default:
      throw new Error(`Couldn't create thing of type '${type}'`)
  }

  thing.pos.setXY(x, y)
  return thing
}
