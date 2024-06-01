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
  handlers = new Set<Thing>
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
      this.renderFg(),
      this.renderBg(),
      this.renderBorder(),
      this.renderCursor(),
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
    this.handlers.clear()
  }

  renderFg (): string {
    if (this.handlers.size > 0) return 'text-cyan-900'
    if (!this.thing) return 'text-neutral-400'
    return ''
  }
  
  renderBg (): string {
    if (this.handlers.size > 0) return 'bg-cyan-400'
    if (!this.thing) return 'bg-neutral-900'
    if (this.thing.win) return 'bg-green-500'
    if (this.thing.error) return 'bg-red-500'
    if (this.thing.name === 'wizard') return 'bg-purple-900'
    if (this.thing.name === 'mountain') return 'bg-amber-900'
    if (this.thing.name === 'tree') return 'bg-green-700'
    if (this.thing.name === 'flag') return 'bg-yellow-500'
    return 'bg-neutral-900'
  }
  
  
  renderBorder (): string {
    if (!this.thing) return 'border-neutral-700'
    if (this.thing.fixed) return 'border-neutral-100'
    return 'border-neutral-700'
  }
  
  renderCursor (): string {
    if (!this.thing) return ''
    if (!this.thing.fixed) return 'cursor-grab'
    return ''
  }
  
}
