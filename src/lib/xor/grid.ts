import Cell from "./cell"
import Thing from "./thing"
import Vector from "./vector"

export default class Grid {
  origin: Cell
  columns: Cell[][]
  private cells: Cell[]

  constructor () {
    this.columns = new Array(8).fill(0).map((_, x) => new Array(8).fill(0).map((__, y) => new Cell(x, y)))
    this.cells = this.columns.reduce((prev, curr) => ([...prev, ...curr]), [])
    this.origin = this.columns[0][0]
  }

  at(v: Vector): Cell | null {
    let cell = this.columns[v.x][v.y]
    return cell || null
  }

  atXY(x: number, y: number): Cell | null {
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
