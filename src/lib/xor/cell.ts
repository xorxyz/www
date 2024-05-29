import Thing from "./thing"
import Vector from "./vector"

export default class Cell {
  readonly pos: Vector
  readonly label: string
  private thing: Thing | null = null
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
  render(): string {
    return this.thing
      ? this.thing.render()
      : '..'
  }
}
