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
}
