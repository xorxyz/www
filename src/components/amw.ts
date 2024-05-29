import { registerComponent } from "../register";
import Grid from "../lib/xor/grid";
import Runtime from "../lib/xor/runtime";
import Vector from "../lib/xor/vector";

const grid = new Grid()

class AMW {
  grid = grid
  runtime = new Runtime(grid)
  ticks = 0
  init() {
    this.runtime.on('tick', ({ ticks }) => this.ticks = ticks )
  }
  renderCell(x, y) {
    const cell = this.grid.at(new Vector(x, y))
    if (!cell) return 'x_x'
    return cell.render()
  }
}

registerComponent('amw', ()  => new AMW())
