import Cell from "./cell"
import Thing from "./thing"
import Vector from "./vector"

export default class Grid {
  private size: Vector
  origin: Cell
  columns: Cell[][]
  private cells: Cell[]

  constructor (w: number, h: number) {
    this.size = new Vector(w, h)
    this.columns = new Array(h).fill(0).map((_, x) => new Array(w).fill(0).map((__, y) => new Cell(x, y)))
    this.cells = this.columns.reduce((prev, curr) => ([...prev, ...curr]), [])
    this.origin = this.columns[0][0]
  }

  out_of_bounds(v: Vector) {
    return (v.x < 0 || v.x >= this.size.x || v.y < 0 || v.y >= this.size.y)
  }

  at(v: Vector): Cell | null {
    if (this.out_of_bounds(v)) return null
    let cell = this.columns[v.x][v.y]
    return cell || null
  }

  at_xy(x: number, y: number): Cell | null {
    return this.at(new Vector(x, y))
  }

  put(thing: Thing, v: Vector): boolean {
    const cell = this.at(v)
    if (!cell) return false
    cell.put(thing)
    return true
  }

  each(fn: (cell: Cell) => void) {
    this.cells.forEach(cell => fn(cell))
  }

  render() {
    return this.columns.map(column => column.map(cell => cell.render()))
  }

  clear() {
    this.each(cell => cell.clear())
  }
}
