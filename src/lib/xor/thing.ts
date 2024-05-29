import Vector from "./vector"

export default class Thing {
  name: string
  icon: string
  pos = new Vector(0, 0)
  dir = new Vector(0, 1)
  error = false
  constructor (name: string, icon: string) {
    this.name = name
    this.icon = icon
  }
  render() {
    return this.icon
  }
}
