import Vector from "./vector"

export default class Rect {
  readonly size: Vector
  get width () { return this.size.x }
  get height () { return this.size.y }
  get area () { return this.width * this.height }
  constructor (size: Vector) {
    this.size = size.clone()
  }
}

export function get_bounding_rect(vectors: Vector[]): Rect {
  if (!vectors.length) return new Rect(new Vector())
  const top_left = vectors[0].clone()
  const bottom_right = vectors[0].clone()
  vectors.forEach(v => {
    top_left.setXY(Math.min(top_left.x, v.x), Math.min(top_left.y, v.y))
    bottom_right.setXY(Math.max(bottom_right.x, v.x), Math.max(bottom_right.y, v.y))
  })
  const size = bottom_right.clone().addXY(1, 1).sub(top_left)
  const rect = new Rect(size)
  return rect
}