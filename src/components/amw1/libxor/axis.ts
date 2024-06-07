import Vector from "./vector"

export const South = new Vector(0, 1)
export const West = new Vector(-1, 0)
export const North = new Vector(0, -1)
export const East = new Vector(1, 0)

export default class Axis {
  private list = [South, West, North, East]
  private index = 0
  get value () { return this.list[this.index]; }
  constructor (dir: Vector = South) {
    this.rotate_to(dir)
  }
  rotate_right () {
    this.index = this.index === 3 ? 0 : this.index + 1
    return this
  }
  rotate_left () {
    this.index = this.index === 0 ? 3 : this.index - 1
    return this
  }
  rotate_to (v: Vector) {
    const index = this.list.findIndex(d => d.equals(v))
    if (index === -1) throw new Error(`Not a valid direction vector.`)
    this.index = index
    return this
  }
}
