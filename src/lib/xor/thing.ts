import Vector from "./vector"
import { Attribute } from './attribute'
import Axis from "./axis"

interface DelayedEffect {
  name: string
  delay: number
  cb: () => void
}

export default class Thing {
  win = false
  error = false
  fixed = false
  delayed_effects = new Set<DelayedEffect>
  readonly name: string
  icon: string
  readonly starting_icon: string
  readonly starting_pos = new Vector(0,0)
  readonly pos = new Vector(0, 0)
  readonly dir = new Vector(0, 1)
  readonly attributes = new Set<Attribute>
  readonly starting_attributes = new Set<Attribute>
  constructor (name: string, icon: string, attributes: Attribute[]) {
    this.name = name
    this.icon = icon
    this.starting_icon = icon
    attributes.forEach(attr => this.starting_attributes.add(attr))
    this.starting_attributes.forEach(attr => this.attributes.add(attr))
  }
  update() {
    if (!this.delayed_effects.size) return
    this.delayed_effects.forEach((effect) => {
      effect.delay--
      if (effect.delay <= 0) {
        effect.cb()
        this.delayed_effects.delete(effect)
      }
    })
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
  schedule_delayed_effect (name: string, delay: number, cb: () => void) {
    this.delayed_effects.add({ name, delay, cb })
  }
  reset() {
    this.error = false
    this.pos.copy(this.starting_pos)
    this.icon = this.starting_icon
    this.attributes.clear()
    this.starting_attributes.forEach(attr => this.attributes.add(attr))
    this.delayed_effects.clear()
    return this
  }
}

export function createThing(type: string, x = 0, y = 0) {
  let thing
  switch (type) {
    case 'wizard':
      thing = new Thing('wizard', '🧙‍♂️', ['walks', 'blocks'])
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
      thing = new Thing('book', '📕', ['attracts', 'attracts:wizard', 'collectible'])
      break
    case 'sheep':
      thing = new Thing('sheep', '🐑', ['walks', 'blocks', 'eats'])
      break
    case 'grass':
      thing = new Thing('grass', ',,', ['attracts', 'attracts:sheep', 'edible'])
      break
    default:
      throw new Error(`Couldn't create thing of type '${type}'`)
  }

  thing.pos.setXY(x, y)
  return thing
}
