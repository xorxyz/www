import Thing from "./thing"
import Vector from "./vector"

interface Output {
  output: string,
  style: string
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
  put(thing: Thing) {
    thing.pos.copy(this.pos)
    this.thing = thing
  }
  rm() {
    this.thing = null
  }
  update(ticks: number) {
    this.output = this.thing
      ? this.thing.render()
      : '..'
  }
  render(): Output {
    return ({ 
      output: this.output, 
      style: this.thing && this.thing.error ? 'bg-red-500' : ''
    })
  }
  clear() {
    this.thing = null
    this.output = '..'
  }
}
