import Cell from "./cell"
import Axis, { South } from "./axis"
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

  move(from: Vector, to: Vector, permanent: boolean) {
    if (this.out_of_bounds(from) || this.out_of_bounds(to)) return false
    const scell = this.at(from)
    const tcell = this.at(to)

    if (!scell || !tcell) return false

    // Move the thing to an empty cell
    if (tcell.is_empty) {
      const thing = scell.rm()
      if (!thing) return false
      if (scell.buffer) {
        scell.put(scell.buffer, permanent)
        scell.buffer = null
      }
      tcell.put(thing, permanent)
      this.update_handlers(thing, tcell, scell)
    // Swap the contents of two cells
    } else {
      const pthing = tcell.rm()
      if (!pthing) return false
      if (pthing.fixed) { tcell.put(pthing, false); return false }
      const thing = scell.rm()
      if (!thing) return false
      if (thing.fixed) { scell.put(thing, false); return false }
      scell.put(pthing, permanent)
      tcell.put(thing, permanent)
      this.update_handlers(pthing, scell, tcell)
      this.update_handlers(thing, tcell, scell)
    }

    return true
  }

  update_handlers(thing: Thing, dest_cell: Cell, src_cell?: Cell, prev_dir?: Vector) {
    if (!thing.attributes.has('walks')) return

    const next_handle = this.at(dest_cell.pos.clone().add(thing.dir))
    if (next_handle) next_handle.handlers.add(thing)
    
    if (src_cell) {
      const previous_handle = this.at(src_cell.pos.clone().add(prev_dir || thing.dir))
      if (previous_handle) previous_handle.handlers.delete(thing)
    }
  }

  remove(v: Vector): Thing | null {
    if (this.out_of_bounds(v)) return null
    const cell = this.at(v)
    if (!cell) return null

    const thing = cell.rm()
    if (thing) {
      const target = this.at(thing.facing())
      if (target) {
        target.handlers.delete(thing)
      }
    }

    return thing
  }

  at(v: Vector): Cell | null {
    if (this.out_of_bounds(v)) return null
    let cell = this.columns[v.x][v.y]
    return cell || null
  }

  put(thing: Thing, v: Vector, permanent: boolean): boolean {
    const cell = this.at(v)
    if (!cell) return false
    cell.put(thing, permanent)

    this.update_handlers(thing, cell)
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

  list_linear_cells(v: Vector, dir: Vector): Cell[] {
    if (this.out_of_bounds(v)) return []
    const origin = this.at(v)
    if (!origin) return []
    const result: Cell[] = []
    const next_pos = origin.pos.clone().add(dir)
    while (!this.out_of_bounds(next_pos)) {
      const next_cell = this.at(next_pos)
      if (!next_cell) break
      result.push(next_cell)
      next_pos.add(dir)
    }
    return result
  }

  list_orthogonal_cells(v: Vector, dir: Vector = South): Cell[][] {
    if (this.out_of_bounds(v)) return [[]]
    const axis = new Axis()
    axis.rotate_to(dir)

    return [
      this.list_linear_cells(v, dir),
      this.list_linear_cells(v, axis.rotate_right().value),
      this.list_linear_cells(v, axis.rotate_right().value),
      this.list_linear_cells(v, axis.rotate_right().value)
    ]
  }
}
