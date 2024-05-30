import { Attribute } from "./attribute"
import Thing from "./thing"
import Vector from "./vector"

interface Output {
  id: string,
  output: string,
  style: string,
  x: number,
  y: number,
  fixed: boolean
}

export default class Cell {
  readonly pos: Vector
  readonly label: string
  private thing: Thing | null = null
  output: string = '..'
  constructor (x: number, y: number) {
    this.pos = new Vector(x, y)
    this.label = `[${this.pos.x},${this.pos.y}]`
  }
  get is_empty() {
    return this.thing === null
  }
  has_attribute(attr: Attribute) {
    if (!this.thing) return false
    return this.thing.attributes.has(attr)
  }
  put(thing: Thing) {
    thing.pos.copy(this.pos)
    this.thing = thing
  }
  rm(): Thing | null {
    const thing = this.thing
    this.thing = null
    return thing
  }
  update() {
    this.output = this.thing
      ? this.thing.render()
      : '..'
  }
  render(): Output {
    const styles = [
      renderFg(this.thing),
      renderBg(this.thing),
      renderBorder(this.thing),
      renderCursor(this.thing),
    ]

    return ({
      id: `${this.pos.x}${this.pos.y}`,
      output: this.output, 
      style: styles.filter(x => x).join(' '),
      x: this.pos.x,
      y: this.pos.y,
      fixed: this.is_empty || this.thing?.fixed || false
    })
  }
  clear() {
    this.thing = null
    this.output = '..'
  }
}

function renderFg (thing: Thing | null) {
  if (!thing) return 'text-neutral-400'
}

function renderBg (thing: Thing | null) {
  if (!thing) return 'bg-neutral-900'
  if (thing.win) return 'bg-green-500'
  if (thing.error) return 'bg-red-500'
  if (thing.name === 'wizard') return 'bg-purple-900'
  // if (thing.fixed) return 'bg-neutral-700'
  if (thing.name === 'mountain') return 'bg-amber-900'
  if (thing.name === 'tree') return 'bg-green-700'
}


function renderBorder (thing: Thing | null) {
  if (!thing) return 'border-neutral-700'
  if (thing.fixed) return 'border-neutral-100'
  return 'border-neutral-700'
}

function renderCursor (thing: Thing | null) {
  if (!thing) return ''
  if (!thing.fixed) return 'cursor-grab'
}
